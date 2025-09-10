<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\BarangayPresident;
use Illuminate\Support\Facades\Hash;

class BarangayPresidentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all barangays
        $barangays = [
            'Baclaran',
            'Banay-Banay',
            'Banlic',
            'Bigaa',
            'Butong',
            'Casile',
            'Diezmo',
            'Gulod',
            'Mamatid',
            'Marinig',
            'Niugan',
            'Pittland',
            'Pulo',
            'Sala',
            'San Isidro',
            'Barangay I Poblacion',
            'Barangay II Poblacion',
            'Barangay III Poblacion'
        ];

        $createdUsers = [];

        foreach ($barangays as $index => $barangay) {
            // Generate unique username and email for each barangay president
            $barangaySlug = strtolower(str_replace([' ', '-'], '_', $barangay));
            $username = 'bp_' . $barangaySlug;
            $email = 'president@' . $barangaySlug . '.com';
            $barangayID = 'BRGY' . str_pad($index + 1, 3, '0', STR_PAD_LEFT);

            // Create Barangay President User
            $user = User::create([
                'username' => $username,
                'email' => $email,
                'password' => Hash::make('password123'),
                'role' => 'BarangayPresident',
                'status' => 'active'
            ]);

            // Create Barangay President Record
            BarangayPresident::create([
                'userID' => $user->userID,
                'barangayID' => $barangayID,
                'barangay' => $barangay
            ]);

            $createdUsers[] = [
                'barangay' => $barangay,
                'username' => $username,
                'email' => $email,
                'password' => 'password123'
            ];
        }

        $this->command->info('All Barangay Presidents created successfully!');
        $this->command->info('Total created: ' . count($createdUsers));
        
        foreach ($createdUsers as $user) {
            $this->command->info("Barangay: {$user['barangay']} | Username: {$user['username']} | Email: {$user['email']} | Password: {$user['password']}");
        }
    }
}
