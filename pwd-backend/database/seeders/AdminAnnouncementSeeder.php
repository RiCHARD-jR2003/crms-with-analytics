<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Announcement;
use App\Models\User;

class AdminAnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Find or create an Admin user
        $adminUser = User::where('role', 'Admin')->first();
        
        if (!$adminUser) {
            // Create a default admin user if none exists
            $adminUser = User::create([
                'username' => 'admin',
                'email' => 'admin@pwd.com',
                'password' => bcrypt('password123'),
                'role' => 'Admin',
                'status' => 'active'
            ]);
        }

        // Create sample announcements
        $announcements = [
            [
                'authorID' => $adminUser->userID,
                'title' => 'PWD Card Distribution Schedule',
                'content' => 'PWD cards will be distributed on January 25, 2025 from 9:00 AM to 4:00 PM at the barangay hall. All PWD members are required to bring their valid ID and medical certificate.',
                'type' => 'Information',
                'priority' => 'High',
                'targetAudience' => 'All',
                'status' => 'Active',
                'publishDate' => '2025-01-20',
                'expiryDate' => '2025-02-20',
                'views' => 0
            ],
            [
                'authorID' => $adminUser->userID,
                'title' => 'Medical Mission Announcement',
                'content' => 'Free medical check-up for PWD members on January 30, 2025. Please bring your PWD ID and wear comfortable clothing. The medical mission will be held at the municipal health center.',
                'type' => 'Event',
                'priority' => 'Medium',
                'targetAudience' => 'PWD Members',
                'status' => 'Active',
                'publishDate' => '2025-01-18',
                'expiryDate' => '2025-02-18',
                'views' => 0
            ],
            [
                'authorID' => $adminUser->userID,
                'title' => 'Benefit Application Deadline',
                'content' => 'Deadline for submitting benefit applications is January 31, 2025. All applications must be submitted with complete requirements including medical certificate, barangay clearance, and valid ID.',
                'type' => 'Notice',
                'priority' => 'High',
                'targetAudience' => 'PWD Members',
                'status' => 'Active',
                'publishDate' => '2025-01-15',
                'expiryDate' => '2025-02-15',
                'views' => 0
            ],
            [
                'authorID' => $adminUser->userID,
                'title' => 'Emergency Contact Information Update',
                'content' => 'All PWD members are requested to update their emergency contact information at the barangay office. This is important for emergency situations and disaster preparedness.',
                'type' => 'Emergency',
                'priority' => 'High',
                'targetAudience' => 'All',
                'status' => 'Active',
                'publishDate' => '2025-01-22',
                'expiryDate' => '2025-02-22',
                'views' => 0
            ],
            [
                'authorID' => $adminUser->userID,
                'title' => 'Monthly PWD Meeting Schedule',
                'content' => 'Monthly PWD meetings will be held every first Saturday of the month at 2:00 PM. All PWD members and barangay presidents are encouraged to attend.',
                'type' => 'Information',
                'priority' => 'Medium',
                'targetAudience' => 'All',
                'status' => 'Active',
                'publishDate' => '2025-01-25',
                'expiryDate' => '2025-02-25',
                'views' => 0
            ]
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }

        $this->command->info('Admin announcements created successfully!');
    }
}
