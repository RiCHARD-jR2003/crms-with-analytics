<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    /**
     * Test method
     */
    public function test()
    {
        return response()->json(['message' => 'DashboardController is working']);
    }

    /**
     * Get recent activities for admin dashboard
     */
    public function getRecentActivities()
    {
        try {
            // Return mock data for now
            $activities = [
                [
                    'id' => 1,
                    'type' => 'application',
                    'title' => 'New PWD Application',
                    'description' => 'Application from Juan Dela Cruz',
                    'status' => 'pending',
                    'barangay' => 'Banaybanay',
                    'created_at' => now()->subMinutes(30),
                    'icon' => 'person_add',
                    'color' => '#F39C12'
                ],
                [
                    'id' => 2,
                    'type' => 'announcement',
                    'title' => 'New Announcement',
                    'description' => 'Monthly PWD Meeting Schedule',
                    'status' => 'published',
                    'barangay' => 'All',
                    'created_at' => now()->subHours(2),
                    'icon' => 'campaign',
                    'color' => '#3498DB'
                ],
                [
                    'id' => 3,
                    'type' => 'application',
                    'title' => 'New PWD Application',
                    'description' => 'Application from Maria Santos',
                    'status' => 'approved',
                    'barangay' => 'Banlic',
                    'created_at' => now()->subHours(4),
                    'icon' => 'person_add',
                    'color' => '#27AE60'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $activities
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get barangay contacts for coordination table
     */
    public function getBarangayContacts()
    {
        try {
            // Return mock data for now
            $contacts = [
                [
                    'barangay' => 'Banaybanay',
                    'president_name' => 'John Smith',
                    'email' => 'john.smith@banaybanay.com',
                    'phone' => '+63 999 123 4567',
                    'address' => 'Barangay Banaybanay, Cabuyao City, Laguna',
                    'pwd_count' => 25,
                    'pending_applications' => 3,
                    'status' => 'active'
                ],
                [
                    'barangay' => 'Banlic',
                    'president_name' => 'Maria Garcia',
                    'email' => 'maria.garcia@banlic.com',
                    'phone' => '+63 999 234 5678',
                    'address' => 'Barangay Banlic, Cabuyao City, Laguna',
                    'pwd_count' => 18,
                    'pending_applications' => 2,
                    'status' => 'active'
                ],
                [
                    'barangay' => 'Bigaa',
                    'president_name' => 'Pedro Santos',
                    'email' => 'pedro.santos@bigaa.com',
                    'phone' => '+63 999 345 6789',
                    'address' => 'Barangay Bigaa, Cabuyao City, Laguna',
                    'pwd_count' => 32,
                    'pending_applications' => 5,
                    'status' => 'active'
                ],
                [
                    'barangay' => 'Butong',
                    'president_name' => 'Ana Rodriguez',
                    'email' => 'ana.rodriguez@butong.com',
                    'phone' => '+63 999 456 7890',
                    'address' => 'Barangay Butong, Cabuyao City, Laguna',
                    'pwd_count' => 15,
                    'pending_applications' => 1,
                    'status' => 'active'
                ],
                [
                    'barangay' => 'Casile',
                    'president_name' => 'Carlos Lopez',
                    'email' => 'carlos.lopez@casile.com',
                    'phone' => '+63 999 567 8901',
                    'address' => 'Barangay Casile, Cabuyao City, Laguna',
                    'pwd_count' => 28,
                    'pending_applications' => 4,
                    'status' => 'active'
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $contacts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch barangay contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get status color for applications
     */
    private function getStatusColor($status)
    {
        switch (strtolower($status)) {
            case 'approved':
                return '#27AE60';
            case 'pending':
                return '#F39C12';
            case 'rejected':
                return '#E74C3C';
            default:
                return '#7F8C8D';
        }
    }

    /**
     * Get status color for support tickets
     */
    private function getTicketStatusColor($status)
    {
        switch ($status) {
            case 'open':
                return '#E74C3C';
            case 'in_progress':
                return '#F39C12';
            case 'resolved':
                return '#27AE60';
            case 'closed':
                return '#7F8C8D';
            default:
                return '#7F8C8D';
        }
    }
}
