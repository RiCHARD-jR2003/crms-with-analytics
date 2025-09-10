<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\PWDMember;
use App\Models\Application;
use Illuminate\Support\Facades\Hash;

class PWDMemberSeeder extends Seeder
{
    public function run()
    {
        // Create test PWD members
        $pwdMembers = [
            [
                'firstName' => 'Juan',
                'lastName' => 'Dela Cruz',
                'birthDate' => '1985-03-15',
                'gender' => 'Male',
                'disabilityType' => 'Visual Impairment',
                'address' => '123 Main Street, Barangay Poblacion',
                'contactNumber' => '09123456789',
                'pwd_id' => 'PWD-001',
                'qr_code_data' => json_encode([
                    'pwd_id' => 'PWD-001',
                    'userID' => 1,
                    'name' => 'Juan Dela Cruz',
                    'firstName' => 'Juan',
                    'lastName' => 'Dela Cruz'
                ])
            ],
            [
                'firstName' => 'Maria',
                'lastName' => 'Santos',
                'birthDate' => '1990-07-22',
                'gender' => 'Female',
                'disabilityType' => 'Hearing Impairment',
                'address' => '456 Oak Avenue, Barangay Baclaran',
                'contactNumber' => '09123456790',
                'pwd_id' => 'PWD-002',
                'qr_code_data' => json_encode([
                    'pwd_id' => 'PWD-002',
                    'userID' => 2,
                    'name' => 'Maria Santos',
                    'firstName' => 'Maria',
                    'lastName' => 'Santos'
                ])
            ],
            [
                'firstName' => 'Pedro',
                'lastName' => 'Reyes',
                'birthDate' => '1978-11-08',
                'gender' => 'Male',
                'disabilityType' => 'Mobility Impairment',
                'address' => '789 Pine Street, Barangay Banlic',
                'contactNumber' => '09123456791',
                'pwd_id' => 'PWD-003',
                'qr_code_data' => json_encode([
                    'pwd_id' => 'PWD-003',
                    'userID' => 3,
                    'name' => 'Pedro Reyes',
                    'firstName' => 'Pedro',
                    'lastName' => 'Reyes'
                ])
            ]
        ];

        foreach ($pwdMembers as $index => $memberData) {
            // Create or find user account
            $username = 'pwd_' . strtolower(str_replace(' ', '_', $memberData['firstName'] . '_' . $memberData['lastName']));
            $email = strtolower($memberData['firstName'] . '.' . $memberData['lastName'] . '@pwd.com');
            
            $user = User::firstOrCreate(
                ['username' => $username],
                [
                    'email' => $email,
                    'password' => Hash::make('password123'),
                    'role' => 'PWDMember',
                    'status' => 'Active'
                ]
            );

            // Create PWD member record
            $pwdMember = PWDMember::create([
                'userID' => $user->userID,
                'firstName' => $memberData['firstName'],
                'lastName' => $memberData['lastName'],
                'birthDate' => $memberData['birthDate'],
                'gender' => $memberData['gender'],
                'disabilityType' => $memberData['disabilityType'],
                'address' => $memberData['address'],
                'contactNumber' => $memberData['contactNumber'],
                'pwd_id' => $memberData['pwd_id'],
                'qr_code_data' => $memberData['qr_code_data'],
                'qr_code_generated_at' => now()
            ]);

            // Create approved application
            Application::create([
                'firstName' => $memberData['firstName'],
                'lastName' => $memberData['lastName'],
                'email' => strtolower($memberData['firstName'] . '.' . $memberData['lastName'] . '@pwd.com'),
                'contactNumber' => $memberData['contactNumber'],
                'barangay' => explode(', ', $memberData['address'])[1] ?? 'Barangay Poblacion',
                'disabilityType' => $memberData['disabilityType'],
                'address' => $memberData['address'],
                'birthDate' => $memberData['birthDate'],
                'gender' => $memberData['gender'],
                'idType' => 'PhilHealth ID',
                'idNumber' => 'PH' . str_pad($index + 1, 10, '0', STR_PAD_LEFT),
                'status' => 'Approved',
                'submissionDate' => now()->subDays(30),
                'emergencyContact' => 'Emergency Contact ' . ($index + 1)
            ]);

            echo "Created PWD Member: {$memberData['firstName']} {$memberData['lastName']} (PWD ID: {$memberData['pwd_id']})\n";
        }

        echo "PWD Members created successfully!\n";
        echo "Test QR codes can be generated for these members.\n";
    }
}
