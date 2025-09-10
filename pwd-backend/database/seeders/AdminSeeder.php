<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    public function run()
    {
        // Create admin user
        $user = User::create([
            'username' => 'admin',
            'email' => 'admin@pdao.com',
            'password' => Hash::make('password123'),
            'role' => 'Admin',
            'status' => 'Active'
        ]);

        // Create admin record
        Admin::create([
            'userID' => $user->userID
        ]);

        echo "Admin user created successfully!\n";
        echo "Username: admin\n";
        echo "Password: password123\n";
        echo "Email: admin@pdao.com\n";
    }
}
