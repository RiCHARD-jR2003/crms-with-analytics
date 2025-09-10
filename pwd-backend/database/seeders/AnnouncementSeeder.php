<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Announcement;
use Carbon\Carbon;

class AnnouncementSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $announcements = [
            [
                'title' => 'Welcome to PDAO System',
                'content' => 'Welcome to the Cabuyao PDAO (Persons with Disabilities Affairs Office) system. We are here to serve and support all PWD members in our community.',
                'type' => 'Information',
                'priority' => 'Medium',
                'targetAudience' => 'PWD Members',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(30)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'New Benefits Available',
                'content' => 'We are pleased to announce new benefits available for PWD members. Please visit our office or contact us for more information.',
                'type' => 'Information',
                'priority' => 'High',
                'targetAudience' => 'PWD Members',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(60)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Office Hours Update',
                'content' => 'Our office hours have been updated. We are now open Monday to Friday from 8:00 AM to 5:00 PM. We are closed on weekends and holidays.',
                'type' => 'Notice',
                'priority' => 'Low',
                'targetAudience' => 'All',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(90)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Emergency Contact Information',
                'content' => 'In case of emergency, please contact our office at (049) 123-4567 or email us at support@pdao.cabuyao.gov.ph. We are here to help 24/7.',
                'type' => 'Emergency',
                'priority' => 'High',
                'targetAudience' => 'All',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(365)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            // Barangay-specific announcements
            [
                'title' => 'Bigaa Barangay Health Center Schedule',
                'content' => 'The Bigaa Barangay Health Center will be open every Tuesday and Thursday from 8:00 AM to 4:00 PM for PWD members. Please bring your PWD ID for priority service.',
                'type' => 'Information',
                'priority' => 'Medium',
                'targetAudience' => 'Bigaa',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(60)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Butong Barangay Meeting',
                'content' => 'There will be a PWD community meeting at Butong Barangay Hall on Saturday, September 15, 2025 at 2:00 PM. All PWD members are encouraged to attend.',
                'type' => 'Event',
                'priority' => 'High',
                'targetAudience' => 'Butong',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(30)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Marinig Barangay Road Construction',
                'content' => 'Road construction in Marinig Barangay will begin next week. Alternative routes are available. Please plan your travel accordingly.',
                'type' => 'Notice',
                'priority' => 'Medium',
                'targetAudience' => 'Marinig',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(45)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Gulod Barangay Sports Event',
                'content' => 'Gulod Barangay will host a PWD-friendly sports event on September 20, 2025. Registration is now open. Contact the barangay office for details.',
                'type' => 'Event',
                'priority' => 'Low',
                'targetAudience' => 'Gulod',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(20)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'title' => 'Banlic Barangay Health Program',
                'content' => 'Banlic Barangay is launching a new health program for PWD members. Free medical check-ups will be available every Wednesday at the barangay health center.',
                'type' => 'Information',
                'priority' => 'High',
                'targetAudience' => 'Banlic',
                'status' => 'Active',
                'authorID' => 1,
                'views' => 0,
                'publishDate' => Carbon::now()->toDateString(),
                'expiryDate' => Carbon::now()->addDays(45)->toDateString(),
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ];

        foreach ($announcements as $announcement) {
            Announcement::create($announcement);
        }
    }
}