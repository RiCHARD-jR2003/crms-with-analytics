<?php
// app/Http/Controllers/API/BenefitController.php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Benefit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BenefitController extends Controller
{
    public function index()
    {
        $benefits = Benefit::with('benefitClaims.pwdMember.user')->get();
        return response()->json($benefits);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'benefitType' => 'required|string|max:50',
            'description' => 'required|string',
            'schedule' => 'required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $benefit = Benefit::create($request->all());

        return response()->json($benefit, 201);
    }

    public function show($id)
    {
        $benefit = Benefit::with('benefitClaims.pwdMember.user')->find($id);
        
        if (!$benefit) {
            return response()->json(['message' => 'Benefit not found'], 404);
        }
        
        return response()->json($benefit);
    }

    public function update(Request $request, $id)
    {
        $benefit = Benefit::find($id);
        
        if (!$benefit) {
            return response()->json(['message' => 'Benefit not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'benefitType' => 'sometimes|required|string|max:50',
            'description' => 'sometimes|required|string',
            'schedule' => 'sometimes|required|date',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);
        }

        $benefit->update($request->all());

        return response()->json($benefit);
    }

    public function destroy($id)
    {
        $benefit = Benefit::find($id);
        
        if (!$benefit) {
            return response()->json(['message' => 'Benefit not found'], 404);
        }

        $benefit->delete();

        return response()->json(['message' => 'Benefit deleted successfully']);
    }
}