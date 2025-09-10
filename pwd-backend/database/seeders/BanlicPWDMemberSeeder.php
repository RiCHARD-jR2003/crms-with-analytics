<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PWDMember;
use App\Models\Application;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class BanlicPWDMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create a PWD Member user
        $user = User::create([
            'username' => 'banlic_pwd',
            'email' => 'banlic@pwd.com',
            'password' => Hash::make('password123'),
            'role' => 'PWDMember',
            'status' => 'Active',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        // Create PWD Member record
        $pwdMember = PWDMember::create([
            'userID' => $user->userID,
            'pwd_id' => 'PWD-2025-000999',
            'firstName' => 'Banlic',
            'lastName' => 'PWD Member',
            'birthDate' => '1990-01-01',
            'gender' => 'Male',
            'disabilityType' => 'Physical',
            'address' => 'Banlic, Cabuyao, Laguna',
            'contactNumber' => '09123456789',
            'created_at' => Carbon::now(),
            'updated_at' => Carbon::now()
        ]);

        // Create approved application with Banlic barangay
        Application::create([
            'pwdID' => $user->userID,
            'firstName' => 'Banlic',
            'lastName' => 'PWD Member',
            'middleName' => 'Test',
            'birthDate' => '1990-01-01',
            'gender' => 'Male',
            'civilStatus' => 'Single',
            'nationality' => 'Filipino',
            'disabilityType' => 'Physical',
            'disabilityCause' => 'Birth',
            'address' => 'Banlic, Cabuyao, Laguna',
            'barangay' => 'Banlic',
            'city' => 'Cabuyao',
            'province' => 'Laguna',
            'postalCode' => '4025',
            'email' => 'banlic@pwd.com',
            'contactNumber' => '09123456789',
            'emergencyContact' => 'Emergency Contact',
            'emergencyPhone' => '09123456788',
            'emergencyRelationship' => 'Parent',
            'idType' => 'Driver License',
            'idNumber' => 'DL123456789',
            'submissionDate' => Carbon::now()->subDays(30),
            'status' => 'Approved',
            'remarks' => 'Approved for testing barangay-specific announcements',
            'created_at' => Carbon::now()->subDays(30),
            'updated_at' => Carbon::now()->subDays(30)
        ]);

        echo "Banlic PWD Member created successfully!\n";
        echo "Username: banlic_pwd\n";
        echo "Password: password123\n";
        echo "Barangay: Banlic\n";
    }
}
