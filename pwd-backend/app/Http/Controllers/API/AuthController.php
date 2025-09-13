<?php
// app/Http/Controllers/API/AuthController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|unique:users',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
            'role' => 'required|in:Admin,BarangayPresident,PWDMember',
            'firstName' => 'required_if:role,PWDMember',
            'lastName' => 'required_if:role,PWDMember',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'role' => $request->role,
            'status' => 'active'
        ]);

        // Create role-specific record
        if ($request->role === 'PWDMember') {
            $user->pwdMember()->create([
                'firstName' => $request->firstName,
                'lastName' => $request->lastName,
                'birthDate' => $request->birthDate,
                'gender' => $request->gender,
                'disabilityType' => $request->disabilityType,
                'address' => $request->address,
            ]);
        } else if ($request->role === 'BarangayPresident') {
            $user->barangayPresident()->create([
                'barangayID' => $request->barangayID,
            ]);
        } else if ($request->role === 'Admin') {
            $user->admin()->create();
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user->load([$request->role === 'PWDMember' ? 'pwdMember' : 
                     ($request->role === 'BarangayPresident' ? 'barangayPresident' : 'admin')]),
            'access_token' => $token,
            'token_type' => 'Bearer',
        ], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->only('username', 'password');
        
        // First try to authenticate with username
        if (!Auth::attempt($credentials)) {
            // If username fails, try with email
            $emailCredentials = [
                'email' => $request->username,
                'password' => $request->password
            ];
            
            if (!Auth::attempt($emailCredentials)) {
                return response()->json([
                    'message' => 'Invalid login credentials'
                ], 401);
            }
        }

        // Find user by username first, then by email if not found
        $user = User::where('username', $request->username)->first();
        if (!$user) {
            $user = User::where('email', $request->username)->firstOrFail();
        }
        
        // Check if user is active
        if (strtolower($user->status) !== 'active') {
            return response()->json([
                'message' => 'Your account is inactive. Please contact administrator.'
            ], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        // Load role-specific data
        if ($user->role === 'PWDMember') {
            // Check if pwdMember relationship exists
            if ($user->pwdMember) {
                $user->load('pwdMember');
                // Get barangay from approved application
                $approvedApplication = $user->pwdMember->applications()
                    ->where('status', 'Approved')
                    ->latest()
                    ->first();
                if ($approvedApplication) {
                    $user->barangay = $approvedApplication->barangay;
                }
            } else {
                // If no pwdMember relationship, get barangay from application
                $approvedApplication = \App\Models\Application::where('email', $user->email)
                    ->where('status', 'Approved')
                    ->latest()
                    ->first();
                if ($approvedApplication) {
                    $user->barangay = $approvedApplication->barangay;
                }
            }
        } else if ($user->role === 'BarangayPresident') {
            $user->load('barangayPresident');
        } else if ($user->role === 'Admin') {
            $user->load('admin');
        }

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}