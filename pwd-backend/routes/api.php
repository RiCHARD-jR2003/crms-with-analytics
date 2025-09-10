<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\PWDMemberController;
use App\Http\Controllers\API\ComplaintController;
use App\Http\Controllers\API\BenefitController;
use App\Http\Controllers\API\BenefitClaimController;
use App\Http\Controllers\API\AnnouncementController;
use App\Http\Controllers\API\ReportController;
use App\Http\Controllers\API\AuditLogController;
use App\Http\Controllers\API\SupportTicketController;
use App\Http\Controllers\API\DashboardController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working',
        'timestamp' => now()->toISOString(),
        'server_ip' => request()->server('SERVER_ADDR'),
        'client_ip' => request()->ip(),
        'user_agent' => request()->userAgent()
    ]);
});

// Mobile connectivity test
Route::get('/mobile-test', function () {
    return response()->json([
        'status' => 'success',
        'message' => 'Mobile connection successful',
        'timestamp' => now()->toISOString(),
        'server_info' => [
            'ip' => request()->server('SERVER_ADDR'),
            'port' => request()->server('SERVER_PORT'),
            'host' => request()->getHost()
        ]
    ]);
});

// Test PWD members route
Route::get('/test-pwd', function () {
    try {
        $members = \App\Models\PWDMember::all();
        return response()->json(['count' => $members->count(), 'members' => $members]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Simple PWD members route
Route::get('/simple-pwd', function () {
    try {
        $members = DB::table('pwd_members')->get();
        return response()->json(['count' => $members->count(), 'members' => $members]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// PWD members route - Returns real database data with emergency contact
Route::get('/mock-pwd', function () {
    try {
        $members = \App\Models\PWDMember::with(['applications' => function($query) {
            $query->where('status', 'Approved')->latest()->first();
        }])->get();
        
        // Transform the data to match the expected format
        $transformedMembers = $members->map(function ($member) {
            // Get emergency contact and barangay from the approved application
            $approvedApplication = $member->applications->first();
            $emergencyContact = $approvedApplication ? $approvedApplication->emergencyContact : null;
            $barangay = $approvedApplication ? $approvedApplication->barangay : null;
            
                        return [
                            'id' => $member->id,
                            'userID' => $member->userID,
                            'pwd_id' => $member->pwd_id ?: "PWD-{$member->userID}",
                            'firstName' => $member->firstName,
                            'lastName' => $member->lastName,
                            'middleName' => $member->middleName,
                            'birthDate' => $member->birthDate,
                            'gender' => $member->gender,
                            'disabilityType' => $member->disabilityType,
                            'address' => $member->address,
                            'contactNumber' => $member->contactNumber,
                            'emergencyContact' => $emergencyContact,
                            'barangay' => $barangay,
                            'qr_code_data' => $member->qr_code_data,
                            'qr_code_generated_at' => $member->qr_code_generated_at
                        ];
        });
        
        return response()->json([
            'count' => $members->count(),
            'members' => $transformedMembers
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch PWD members',
            'message' => $e->getMessage(),
            'count' => 0,
            'members' => []
        ], 500);
    }
});

Route::apiResource('users', 'App\Http\Controllers\API\UserController');
Route::apiResource('pwd-members', 'App\Http\Controllers\API\PWDMemberController');
Route::apiResource('complaints', 'App\Http\Controllers\API\ComplaintController');
Route::apiResource('benefits', 'App\Http\Controllers\API\BenefitController');
Route::apiResource('reports', 'App\Http\Controllers\API\ReportController');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public announcements route - PWD members need to see announcements
Route::get('/announcements', [AnnouncementController::class, 'index']);
Route::get('/announcements/admin', [AnnouncementController::class, 'getAdminAnnouncements']);
Route::get('/announcements/audience/{audience}', [AnnouncementController::class, 'getByAudience']);
Route::get('/announcements/{id}', [AnnouncementController::class, 'show']);

// Public benefit claim routes for QR scanner
Route::get('/benefit-claims', [BenefitClaimController::class, 'index']);
Route::post('/benefit-claims', [BenefitClaimController::class, 'store']);
Route::patch('/benefit-claims/{id}/status', [BenefitClaimController::class, 'updateStatus']);

// PWD Member profile routes
Route::get('/pwd-member/profile', function (Request $request) {
    try {
        $user = $request->user();
        if (!$user || $user->role !== 'PWDMember') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $pwdMember = $user->pwdMember;
        if (!$pwdMember) {
            return response()->json(['error' => 'PWD Member not found'], 404);
        }
        
        // Get barangay from approved application
        $approvedApplication = $pwdMember->applications()
            ->where('status', 'Approved')
            ->latest()
            ->first();
        
        $profile = [
            'userID' => $user->userID,
            'firstName' => $pwdMember->firstName,
            'lastName' => $pwdMember->lastName,
            'email' => $user->email,
            'contactNumber' => $pwdMember->contactNumber,
            'address' => $pwdMember->address,
            'birthDate' => $pwdMember->birthDate,
            'gender' => $pwdMember->gender,
            'disabilityType' => $pwdMember->disabilityType,
            'pwd_id' => $pwdMember->pwd_id,
            'barangay' => $approvedApplication ? $approvedApplication->barangay : null,
            'created_at' => $pwdMember->created_at,
        ];
        
        return response()->json($profile);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::put('/pwd-member/profile', function (Request $request) {
    try {
        $user = $request->user();
        if (!$user || $user->role !== 'PWDMember') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $pwdMember = $user->pwdMember;
        if (!$pwdMember) {
            return response()->json(['error' => 'PWD Member not found'], 404);
        }
        
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'firstName' => 'required|string|max:50',
            'lastName' => 'required|string|max:50',
            'email' => 'required|email',
            'contactNumber' => 'required|string|max:20',
            'address' => 'required|string',
            'birthDate' => 'required|date',
            'gender' => 'required|string',
            'disabilityType' => 'required|string',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }
        
        // Update user email
        $user->update(['email' => $request->email]);
        
        // Update PWD member data
        $pwdMember->update([
            'firstName' => $request->firstName,
            'lastName' => $request->lastName,
            'contactNumber' => $request->contactNumber,
            'address' => $request->address,
            'birthDate' => $request->birthDate,
            'gender' => $request->gender,
            'disabilityType' => $request->disabilityType,
        ]);
        
        return response()->json(['message' => 'Profile updated successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::put('/pwd-member/change-password', function (Request $request) {
    try {
        $user = $request->user();
        if (!$user || $user->role !== 'PWDMember') {
            return response()->json(['error' => 'Unauthorized'], 401);
        }
        
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'currentPassword' => 'required',
            'newPassword' => 'required|min:6',
        ]);
        
        if ($validator->fails()) {
            return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
        }
        
        // Verify current password
        if (!\Illuminate\Support\Facades\Hash::check($request->currentPassword, $user->password)) {
            return response()->json(['error' => 'Current password is incorrect'], 400);
        }
        
        // Update password
        $user->update([
            'password' => \Illuminate\Support\Facades\Hash::make($request->newPassword)
        ]);
        
        return response()->json(['message' => 'Password changed successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Public application submission route
Route::post('/applications', function (Request $request) {
    try {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'firstName' => 'required|string|max:50',
            'lastName' => 'required|string|max:50',
            'email' => 'required|email|unique:application,email',
            'contactNumber' => 'required|string|max:20',
            'barangay' => 'nullable|string|max:100',
            'disabilityType' => 'required|string|max:100',
            'address' => 'required|string',
            'birthDate' => 'required|date',
            'gender' => 'required|string|max:10',
            'idType' => 'required|string|max:50',
            'idNumber' => 'required|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['status'] = 'Pending Barangay Approval';
        $data['submissionDate'] = now();

        $application = \App\Models\Application::create($data);

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application
        ], 201);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to submit application',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Test route for file preview (no auth required for testing)
Route::get('test-file/{messageId}', function($messageId) {
    try {
        $message = App\Models\SupportTicketMessage::find($messageId);
        if (!$message || !$message->hasAttachment()) {
            return response()->json(['error' => 'No attachment found'], 404);
        }
        
        $filePath = storage_path('app/public/' . $message->attachment_path);
        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File not found: ' . $filePath], 404);
        }
        
        $fileContent = file_get_contents($filePath);
        $mimeType = $message->attachment_type ?: mime_content_type($filePath);
        
        return response($fileContent)
            ->header('Content-Type', $mimeType)
            ->header('Content-Disposition', 'inline; filename="' . $message->attachment_name . '"');
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // User management routes
    Route::apiResource('users', UserController::class);
    
    // PWD Member routes
    Route::apiResource('pwd-members', PWDMemberController::class);
    Route::get('pwd-members/{id}/applications', [PWDMemberController::class, 'getApplications']);
    Route::get('pwd-members/{id}/complaints', [PWDMemberController::class, 'getComplaints']);
    Route::get('pwd-members/{id}/benefit-claims', [PWDMemberController::class, 'getBenefitClaims']);
    
    // Application routes are handled in RouteServiceProvider
    
    // Complaint routes
    Route::apiResource('complaints', ComplaintController::class);
    Route::patch('complaints/{id}/status', [ComplaintController::class, 'updateStatus']);
    
    // Benefit routes
    Route::apiResource('benefits', BenefitController::class);
    
    // Benefit Claim routes
    Route::apiResource('benefit-claims', BenefitClaimController::class);
    Route::patch('benefit-claims/{id}/status', [BenefitClaimController::class, 'updateStatus']);
    
    // Announcement routes (protected - for admin operations)
    Route::post('/announcements', [AnnouncementController::class, 'store']);
    Route::put('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::patch('/announcements/{id}', [AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [AnnouncementController::class, 'destroy']);
    Route::get('announcements/audience/{audience}', [AnnouncementController::class, 'getByAudience']);
    
    // Report routes
    Route::apiResource('reports', ReportController::class);
    Route::post('reports/generate/{type}', [ReportController::class, 'generateReport']);
    
    // Additional report endpoints
    Route::get('reports/barangay-stats/{barangay}', [ReportController::class, 'getBarangayStats']);
    Route::get('reports/pwd-masterlist/{barangay}', [ReportController::class, 'getPWDMasterlist']);
    Route::get('reports/application-status/{barangay}', [ReportController::class, 'getApplicationStatusReport']);
    Route::get('reports/disability-distribution/{barangay}', [ReportController::class, 'getDisabilityDistribution']);
    Route::get('reports/age-group-analysis/{barangay}', [ReportController::class, 'getAgeGroupAnalysis']);
    Route::get('reports/benefit-distribution/{barangay}', [ReportController::class, 'getBenefitDistribution']);
    Route::get('reports/monthly-activity/{barangay}', [ReportController::class, 'getMonthlyActivitySummary']);
    Route::get('reports/city-wide-stats', [ReportController::class, 'getCityWideStats']);
    Route::get('reports/barangay-performance', [ReportController::class, 'getBarangayPerformance']);
    Route::get('reports/{id}/download', [ReportController::class, 'downloadReport']);
    
    // Audit Log routes
    Route::get('audit-logs', [AuditLogController::class, 'index']);
    Route::get('audit-logs/user/{userId}', [AuditLogController::class, 'getByUser']);
    Route::get('audit-logs/action/{action}', [AuditLogController::class, 'getByAction']);
    
    // Support Ticket routes
    Route::apiResource('support-tickets', SupportTicketController::class);
    Route::post('support-tickets/{id}/messages', [SupportTicketController::class, 'addMessage']);
    Route::get('support-tickets/messages/{messageId}/download', [SupportTicketController::class, 'downloadAttachment']);
    Route::get('support-tickets/messages/{messageId}/force-download', [SupportTicketController::class, 'forceDownloadAttachment']);
    
    // Dashboard data routes
    Route::get('dashboard/test', [DashboardController::class, 'test']);
    Route::get('dashboard/recent-activities', [DashboardController::class, 'getRecentActivities']);
    Route::get('dashboard/barangay-contacts', [DashboardController::class, 'getBarangayContacts']);
});

// Fallback route for undefined API endpoints
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found. Please check your request.'
    ], 404);
});