<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * Typically, users are redirected here after authentication.
     *
     * @var string
     */
    public const HOME = '/home';

    /**
     * Define your route model bindings, pattern filters, and other route configuration.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();

        $this->routes(function () {
            // Add a test route directly here
            Route::get('/api/test-direct', function () {
                return response()->json(['message' => 'Direct route test']);
            });

            // Add login route directly here
            Route::post('/api/login', [\App\Http\Controllers\API\AuthController::class, 'login']);

            // Add dashboard stats route (requires authentication)
            Route::middleware('auth:sanctum')->get('/api/applications/dashboard/stats', function (Request $request) {
                try {
                    // Get the authenticated user
                    $user = $request->user();
                    $barangay = 'Barangay Poblacion'; // Default
                    
                    if ($user && $user->role === 'BarangayPresident') {
                        // Load the barangay president relationship
                        $user->load('barangayPresident');
                        if ($user->barangayPresident && $user->barangayPresident->barangay) {
                            $barangay = $user->barangayPresident->barangay;
                        }
                    }
                    
                    // Filter applications by barangay
                    $query = \App\Models\Application::where('barangay', $barangay);
                    
                    $stats = [
                        'totalApplications' => $query->count(),
                        'pendingApplications' => $query->where('status', 'Pending Barangay Approval')->count(),
                        'approvedApplications' => $query->where('status', 'Approved')->count(),
                        'rejectedApplications' => $query->where('status', 'Rejected')->count(),
                        'pendingAdminApproval' => $query->where('status', 'Pending Admin Approval')->count(),
                        'barangay' => $barangay
                    ];
                    
                    return response()->json($stats);
                } catch (\Exception $e) {
                    // Fallback to mock data if there's an error
                    return response()->json([
                        'totalApplications' => 0,
                        'pendingApplications' => 0,
                        'approvedApplications' => 0,
                        'rejectedApplications' => 0,
                        'pendingAdminApproval' => 0,
                        'barangay' => 'Barangay Poblacion',
                        'error' => $e->getMessage()
                    ]);
                }
            });

            // Add applications routes
            Route::get('/api/applications', function () {
                try {
                    $applications = \App\Models\Application::orderBy('created_at', 'desc')->get();
                    return response()->json($applications);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            });
            
            // Add application by ID route
            Route::get('/api/applications/{id}', function ($id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    return response()->json($application);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Application not found'], 404);
                }
            });
            
            // Add application update route
            Route::put('/api/applications/{id}', function (Request $request, $id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    $application->update($request->all());
                    return response()->json($application);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to update application'], 500);
                }
            });
            
            // Add application delete route
            Route::delete('/api/applications/{id}', function ($id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    $application->delete();
                    return response()->json(['message' => 'Application deleted successfully']);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to delete application'], 500);
                }
            });
            
            // Add application status update route
            Route::patch('/api/applications/{id}/status', function (Request $request, $id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    $application->update([
                        'status' => $request->status,
                        'remarks' => $request->remarks
                    ]);
                    return response()->json($application);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to update application status'], 500);
                }
            });
            
            
            // Add application approval routes
            Route::middleware('auth:sanctum')->post('/api/applications/{id}/approve-barangay', function (Request $request, $id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'remarks' => 'nullable|string|max:500',
                    ]);

                    if ($validator->fails()) {
                        return response()->json([
                            'error' => 'Validation failed',
                            'messages' => $validator->errors()
                        ], 422);
                    }

                    $application->update([
                        'status' => 'Pending Admin Approval',
                        'remarks' => $request->remarks || 'Approved by Barangay President'
                    ]);

                    return response()->json([
                        'message' => 'Application approved successfully',
                        'application' => $application
                    ]);

                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Failed to approve application',
                        'message' => $e->getMessage()
                    ], 500);
                }
            });
            
            Route::middleware('auth:sanctum')->post('/api/applications/{id}/reject', function (Request $request, $id) {
                try {
                    $application = \App\Models\Application::findOrFail($id);
                    
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'remarks' => 'required|string|max:500',
                    ]);

                    if ($validator->fails()) {
                        return response()->json([
                            'error' => 'Validation failed',
                            'messages' => $validator->errors()
                        ], 422);
                    }

                    $application->update([
                        'status' => 'Rejected',
                        'remarks' => $request->remarks
                    ]);

                    return response()->json([
                        'message' => 'Application rejected successfully',
                        'application' => $application
                    ]);

                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Failed to reject application',
                        'message' => $e->getMessage()
                    ], 500);
                }
            });
            
            // Add admin dashboard stats route
            Route::middleware('auth:sanctum')->get('/api/admin/dashboard/stats', function (Request $request) {
                try {
                    $user = $request->user();
                    
                    // Only allow admin users
                    if ($user->role !== 'Admin') {
                        return response()->json(['error' => 'Unauthorized'], 403);
                    }
                    
                    // Get all applications across all barangays
                    $totalApplications = \App\Models\Application::count();
                    $pendingBarangayApproval = \App\Models\Application::where('status', 'Pending Barangay Approval')->count();
                    $pendingAdminApproval = \App\Models\Application::where('status', 'Pending Admin Approval')->count();
                    $approvedApplications = \App\Models\Application::where('status', 'Approved')->count();
                    $rejectedApplications = \App\Models\Application::where('status', 'Rejected')->count();
                    
                    return response()->json([
                        'totalApplications' => $totalApplications,
                        'pendingBarangayApproval' => $pendingBarangayApproval,
                        'pendingAdminApproval' => $pendingAdminApproval,
                        'approvedApplications' => $approvedApplications,
                        'rejectedApplications' => $rejectedApplications,
                        'totalRegisteredPWDs' => $approvedApplications, // Same as approved applications
                        'unclaimedPWDCards' => $approvedApplications, // Assuming all approved need cards
                        'complaintsFeedback' => 0 // Placeholder - would need separate table
                    ]);
                    
                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Failed to fetch admin dashboard stats',
                        'message' => $e->getMessage()
                    ], 500);
                }
            });

            // Announcement Routes
            Route::get('/api/announcements', function () {
                try {
                    $announcements = \App\Models\Announcement::with('author')->get();
                    return response()->json($announcements);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to fetch announcements', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::get('/api/announcements/admin', function () {
                try {
                    $announcements = \App\Models\Announcement::with('author')
                        ->whereHas('author', function($query) {
                            $query->where('role', 'Admin');
                        })
                        ->get();
                    return response()->json($announcements);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to fetch admin announcements', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::post('/api/announcements', function (Request $request) {
                try {
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'title' => 'required|string|max:100',
                        'content' => 'required|string',
                        'type' => 'required|string|in:Information,Event,Notice,Emergency',
                        'priority' => 'required|string|in:Low,Medium,High',
                        'targetAudience' => 'required|string|max:100',
                        'status' => 'required|string|in:Draft,Active,Archived',
                        'expiryDate' => 'required|date|after:today',
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 400);
                    }

                    $data = $request->all();
                    $data['authorID'] = 1; // Default author ID
                    $data['views'] = 0;
                    $data['publishDate'] = now()->toDateString();

                    $announcement = \App\Models\Announcement::create($data);
                    return response()->json($announcement, 201);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to create announcement', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::put('/api/announcements/{id}', function (Request $request, $id) {
                try {
                    $announcement = \App\Models\Announcement::find($id);
                    
                    if (!$announcement) {
                        return response()->json(['error' => 'Announcement not found'], 404);
                    }

                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'title' => 'sometimes|required|string|max:100',
                        'content' => 'sometimes|required|string',
                        'type' => 'sometimes|required|string|in:Information,Event,Notice,Emergency',
                        'priority' => 'sometimes|required|string|in:Low,Medium,High',
                        'targetAudience' => 'sometimes|required|string|max:100',
                        'status' => 'sometimes|required|string|in:Draft,Active,Archived',
                        'expiryDate' => 'sometimes|required|date|after:publishDate',
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 400);
                    }

                    $announcement->update($request->all());
                    return response()->json($announcement);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to update announcement', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::delete('/api/announcements/{id}', function ($id) {
                try {
                    $announcement = \App\Models\Announcement::find($id);
                    
                    if (!$announcement) {
                        return response()->json(['error' => 'Announcement not found'], 404);
                    }

                    $announcement->delete();
                    return response()->json(['message' => 'Announcement deleted successfully']);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to delete announcement', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::get('/api/announcements/audience/{audience}', function ($audience) {
                try {
                    $announcements = \App\Models\Announcement::where('targetAudience', $audience)
                        ->orderBy('created_at', 'desc')
                        ->get();
                    
                    return response()->json($announcements);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to fetch announcements', 'message' => $e->getMessage()], 500);
                }
            });
            
            // Support Desk Routes
            Route::get('/api/support/tickets', function () {
                try {
                    // Mock support tickets data
                    $tickets = [
                        [
                            'id' => 1,
                            'ticketNumber' => 'SUP-001',
                            'subject' => 'PWD Card Application Issue',
                            'description' => 'I submitted my PWD card application 2 weeks ago but haven\'t received any updates. Can you please check the status?',
                            'requester' => 'John Doe',
                            'email' => 'john.doe@email.com',
                            'phone' => '+63 912 345 6789',
                            'status' => 'Open',
                            'priority' => 'High',
                            'category' => 'PWD Card',
                            'createdAt' => '2025-09-01',
                            'updatedAt' => '2025-09-05',
                            'replies' => [
                                [
                                    'id' => 1,
                                    'message' => 'Thank you for contacting us. We have received your application and it is currently under review.',
                                    'author' => 'Admin',
                                    'createdAt' => '2025-09-02'
                                ]
                            ]
                        ],
                        [
                            'id' => 2,
                            'ticketNumber' => 'SUP-002',
                            'subject' => 'Benefits Information Request',
                            'description' => 'I would like to know what benefits are available for PWD members in our barangay.',
                            'requester' => 'Maria Santos',
                            'email' => 'maria.santos@email.com',
                            'phone' => '+63 987 654 3210',
                            'status' => 'In Progress',
                            'priority' => 'Medium',
                            'category' => 'Benefits',
                            'createdAt' => '2025-09-03',
                            'updatedAt' => '2025-09-04',
                            'replies' => []
                        ],
                        [
                            'id' => 3,
                            'ticketNumber' => 'SUP-003',
                            'subject' => 'Account Login Problem',
                            'description' => 'I cannot log into my PWD member account. It says invalid credentials.',
                            'requester' => 'Pedro Cruz',
                            'email' => 'pedro.cruz@email.com',
                            'phone' => '+63 923 456 7890',
                            'status' => 'Resolved',
                            'priority' => 'High',
                            'category' => 'Technical',
                            'createdAt' => '2025-08-28',
                            'updatedAt' => '2025-08-30',
                            'replies' => [
                                [
                                    'id' => 1,
                                    'message' => 'We have reset your password and sent new login credentials to your email.',
                                    'author' => 'Admin',
                                    'createdAt' => '2025-08-29'
                                ]
                            ]
                        ]
                    ];
                    
                    return response()->json($tickets);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to fetch support tickets', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::post('/api/support/tickets', function (Request $request) {
                try {
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'subject' => 'required|string|max:255',
                        'description' => 'required|string',
                        'requester' => 'required|string|max:255',
                        'email' => 'required|email|max:255',
                        'phone' => 'required|string|max:20',
                        'category' => 'required|string|in:PWD Card,Benefits,Technical,General',
                        'priority' => 'required|string|in:Low,Medium,High'
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 400);
                    }

                    // Generate ticket number
                    $ticketNumber = 'SUP-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
                    
                    $ticket = [
                        'id' => rand(100, 999),
                        'ticketNumber' => $ticketNumber,
                        'subject' => $request->subject,
                        'description' => $request->description,
                        'requester' => $request->requester,
                        'email' => $request->email,
                        'phone' => $request->phone,
                        'status' => 'Open',
                        'priority' => $request->priority,
                        'category' => $request->category,
                        'createdAt' => now()->toDateString(),
                        'updatedAt' => now()->toDateString(),
                        'replies' => []
                    ];
                    
                    return response()->json($ticket, 201);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to create support ticket', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::post('/api/support/tickets/{id}/reply', function (Request $request, $id) {
                try {
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'message' => 'required|string'
                    ]);

                    if ($validator->fails()) {
                        return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 400);
                    }

                    $reply = [
                        'id' => rand(1, 999),
                        'message' => $request->message,
                        'author' => 'Admin',
                        'createdAt' => now()->toDateString()
                    ];
                    
                    return response()->json($reply, 201);
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to add reply', 'message' => $e->getMessage()], 500);
                }
            });
            
            // Add PWD Member Profile routes
            Route::middleware('auth:sanctum')->get('/api/pwd-member/profile', function (Request $request) {
                try {
                    $user = $request->user();
                    
                    if ($user->role !== 'PWDMember') {
                        return response()->json(['error' => 'Unauthorized'], 403);
                    }
                    
                    $pwdMember = \App\Models\PWDMember::where('userID', $user->userID)->first();
                    
                    if (!$pwdMember) {
                        return response()->json(['error' => 'PWD Member profile not found'], 404);
                    }
                    
                    // Get barangay from the original application
                    $application = \App\Models\Application::where('pwdID', $user->userID)->first();
                    $barangay = $application ? $application->barangay : 'Unknown';
                    
                    return response()->json([
                        'userID' => $user->userID,
                        'firstName' => $pwdMember->firstName,
                        'lastName' => $pwdMember->lastName,
                        'email' => $user->email,
                        'contactNumber' => $pwdMember->contactNumber ?? '',
                        'address' => $pwdMember->address,
                        'birthDate' => $pwdMember->birthDate,
                        'gender' => $pwdMember->gender,
                        'disabilityType' => $pwdMember->disabilityType,
                        'barangay' => $barangay,
                        'created_at' => $pwdMember->created_at,
                        'updated_at' => $pwdMember->updated_at
                    ]);
                    
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to fetch profile', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::middleware('auth:sanctum')->put('/api/pwd-member/profile', function (Request $request) {
                try {
                    $user = $request->user();
                    
                    if ($user->role !== 'PWDMember') {
                        return response()->json(['error' => 'Unauthorized'], 403);
                    }
                    
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'firstName' => 'required|string|max:255',
                        'lastName' => 'required|string|max:255',
                        'contactNumber' => 'nullable|string|max:20',
                        'address' => 'nullable|string|max:500',
                        'birthDate' => 'nullable|date',
                        'gender' => 'nullable|in:Male,Female,Other',
                        'disabilityType' => 'nullable|in:Physical,Visual,Hearing,Mental,Intellectual,Learning,Speech,Multiple'
                    ]);
                    
                    if ($validator->fails()) {
                        return response()->json(['error' => 'Validation failed', 'messages' => $validator->errors()], 422);
                    }
                    
                    $pwdMember = \App\Models\PWDMember::where('userID', $user->userID)->first();
                    
                    if (!$pwdMember) {
                        return response()->json(['error' => 'PWD Member profile not found'], 404);
                    }
                    
                    $pwdMember->update([
                        'firstName' => $request->firstName,
                        'lastName' => $request->lastName,
                        'contactNumber' => $request->contactNumber,
                        'address' => $request->address,
                        'birthDate' => $request->birthDate,
                        'gender' => $request->gender,
                        'disabilityType' => $request->disabilityType
                    ]);
                    
                    return response()->json([
                        'message' => 'Profile updated successfully',
                        'profile' => [
                            'firstName' => $pwdMember->firstName,
                            'lastName' => $pwdMember->lastName,
                            'email' => $user->email,
                            'contactNumber' => $pwdMember->contactNumber,
                            'address' => $pwdMember->address,
                            'birthDate' => $pwdMember->birthDate,
                            'gender' => $pwdMember->gender,
                            'disabilityType' => $pwdMember->disabilityType
                        ]
                    ]);
                    
                } catch (\Exception $e) {
                    return response()->json(['error' => 'Failed to update profile', 'message' => $e->getMessage()], 500);
                }
            });
            
            Route::middleware('auth:sanctum')->put('/api/pwd-member/change-password', function (Request $request) {
                try {
                    $user = $request->user();
                    
                    if ($user->role !== 'PWDMember') {
                        return response()->json(['error' => 'Unauthorized'], 403);
                    }
                    
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'currentPassword' => 'required|string',
                        'newPassword' => 'required|string|min:6'
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
                    return response()->json(['error' => 'Failed to change password', 'message' => $e->getMessage()], 500);
                }
            });

            // Add route to reset PWD member password for testing
            Route::get('/api/reset-pwd-password/{email}', function ($email) {
                try {
                    $user = \App\Models\User::where('email', $email)->first();
                    if (!$user) {
                        return response()->json(['error' => 'User not found'], 404);
                    }
                    
                    $newPassword = 'password123'; // Simple password for testing
                    $user->update([
                        'password' => \Illuminate\Support\Facades\Hash::make($newPassword)
                    ]);
                    
                    return response()->json([
                        'message' => 'Password reset successfully',
                        'email' => $user->email,
                        'newPassword' => $newPassword,
                        'role' => $user->role
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            });

            // Add test route to check PWD member accounts
            Route::get('/api/test-pwd-login/{email}', function ($email) {
                try {
                    $user = \App\Models\User::where('email', $email)->first();
                    if (!$user) {
                        return response()->json(['error' => 'User not found'], 404);
                    }
                    
                    $pwdMember = \App\Models\PWDMember::where('userID', $user->userID)->first();
                    
                    return response()->json([
                        'user' => [
                            'userID' => $user->userID,
                            'username' => $user->username,
                            'email' => $user->email,
                            'role' => $user->role,
                            'status' => $user->status,
                            'created_at' => $user->created_at
                        ],
                        'pwdMember' => $pwdMember ? [
                            'id' => $pwdMember->id,
                            'firstName' => $pwdMember->firstName,
                            'lastName' => $pwdMember->lastName,
                            'disabilityType' => $pwdMember->disabilityType
                        ] : null
                    ]);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            });

            // Add test route for debugging
            Route::get('/api/test-pwd-creation', function () {
                try {
                    // Test User creation
                    $user = \App\Models\User::create([
                        'username' => 'test@example.com',
                        'email' => 'test@example.com',
                        'password' => \Illuminate\Support\Facades\Hash::make('password123'),
                        'role' => 'PWDMember',
                        'status' => 'active'
                    ]);
                    
                    // Test PWDMember creation
                    $pwdMember = \App\Models\PWDMember::create([
                        'userID' => $user->userID,
                        'firstName' => 'Test',
                        'lastName' => 'User',
                        'birthDate' => '1990-01-01',
                        'gender' => 'Male',
                        'disabilityType' => 'Physical',
                        'address' => 'Test Address'
                    ]);
                    
                    return response()->json([
                        'message' => 'Test successful',
                        'user' => $user,
                        'pwdMember' => $pwdMember
                    ]);
                    
                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Test failed',
                        'message' => $e->getMessage(),
                        'trace' => $e->getTraceAsString()
                    ], 500);
                }
            });
            
            // Add admin approval route
            Route::middleware('auth:sanctum')->post('/api/applications/{id}/approve-admin', function (Request $request, $id) {
                try {
                    $user = $request->user();
                    
                    // Only allow admin users
                    if ($user->role !== 'Admin') {
                        return response()->json(['error' => 'Unauthorized'], 403);
                    }
                    
                    $application = \App\Models\Application::findOrFail($id);
                    
                    $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
                        'remarks' => 'nullable|string|max:500',
                    ]);

                    if ($validator->fails()) {
                        return response()->json([
                            'error' => 'Validation failed',
                            'messages' => $validator->errors()
                        ], 422);
                    }

                    // Generate random password
                    $randomPassword = \Illuminate\Support\Str::random(12);
                    
                    // Check if user already exists
                    $existingUser = \App\Models\User::where('email', $application->email)->first();
                    
                    if ($existingUser) {
                        // User already exists, update their role to PWDMember and password
                        $existingUser->update([
                            'role' => 'PWDMember',
                            'status' => 'active',
                            'password' => \Illuminate\Support\Facades\Hash::make($randomPassword)
                        ]);
                        $pwdUser = $existingUser;
                    } else {
                        // Create new PWD Member User Account
                        $pwdUser = \App\Models\User::create([
                            'username' => $application->email, // Use email as username
                            'email' => $application->email,
                            'password' => \Illuminate\Support\Facades\Hash::make($randomPassword),
                            'role' => 'PWDMember',
                            'status' => 'active'
                        ]);
                    }

                    // Generate unique PWD ID
                    $pwdId = \App\Services\PWDIdGenerator::generate();
                    
                    // Create or update PWD Member Record
                    $existingPwdMember = \App\Models\PWDMember::where('userID', $pwdUser->userID)->first();
                    
                    if ($existingPwdMember) {
                        // Update existing PWD Member record
                        $existingPwdMember->update([
                            'pwd_id' => $pwdId,
                            'pwd_id_generated_at' => now(),
                            'firstName' => $application->firstName,
                            'lastName' => $application->lastName,
                            'birthDate' => $application->birthDate,
                            'gender' => $application->gender,
                            'disabilityType' => $application->disabilityType,
                            'address' => $application->address,
                            'contactNumber' => $application->contactNumber
                        ]);
                        $pwdMember = $existingPwdMember;
                    } else {
                        // Create new PWD Member Record
                        $pwdMember = \App\Models\PWDMember::create([
                            'userID' => $pwdUser->userID,
                            'pwd_id' => $pwdId,
                            'pwd_id_generated_at' => now(),
                            'firstName' => $application->firstName,
                            'lastName' => $application->lastName,
                            'birthDate' => $application->birthDate,
                            'gender' => $application->gender,
                            'disabilityType' => $application->disabilityType,
                            'address' => $application->address,
                            'contactNumber' => $application->contactNumber
                        ]);
                    }

                    // Generate QR code data after PWD member creation/update
                    try {
                        $qrData = \App\Services\QRCodeGenerator::generateAndStore($pwdMember);
                        \Illuminate\Support\Facades\Log::info("QR code generated for PWD member: {$pwdId}");
                    } catch (\Exception $qrError) {
                        // Log QR generation error but don't fail the approval
                        \Illuminate\Support\Facades\Log::error('QR code generation failed: ' . $qrError->getMessage());
                    }

                    // Update application status
                    $application->update([
                        'status' => 'Approved',
                        'remarks' => $request->remarks || 'Approved by Admin',
                        'pwdID' => $pwdUser->userID
                    ]);

                    // Send email notification
                    try {
                        \Illuminate\Support\Facades\Mail::send('emails.application-approved', [
                            'firstName' => $application->firstName,
                            'lastName' => $application->lastName,
                            'email' => $application->email,
                            'password' => $randomPassword,
                            'pwdId' => $pwdId,
                            'loginUrl' => 'http://localhost:3000/login'
                        ], function ($message) use ($application) {
                            $message->to($application->email)
                                   ->subject('PWD Application Approved - Account Created');
                        });
                    } catch (\Exception $mailError) {
                        // Log email error but don't fail the approval
                        \Illuminate\Support\Facades\Log::error('Email sending failed: ' . $mailError->getMessage());
                    }

                    return response()->json([
                        'message' => 'Application approved successfully. PWD Member account created and email sent.',
                        'application' => $application,
                        'pwdUser' => [
                            'userID' => $pwdUser->userID,
                            'pwdId' => $pwdId,
                            'email' => $pwdUser->email,
                            'password' => $randomPassword
                        ]
                    ]);

                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Failed to approve application',
                        'message' => $e->getMessage()
                    ], 500);
                }
            });
            
            // Add applications by status route
            Route::middleware('auth:sanctum')->get('/api/applications/status/{status}', function (Request $request, $status) {
                try {
                    $user = $request->user();
                    
                    // Decode the status parameter
                    $decodedStatus = urldecode($status);
                    
                    $applications = \App\Models\Application::where('status', $decodedStatus)->get();
                    
                    return response()->json($applications);
                    
                } catch (\Exception $e) {
                    return response()->json([
                        'error' => 'Failed to fetch applications by status',
                        'message' => $e->getMessage()
                    ], 500);
                }
            });
            
            // Add user details route for barangay information
            Route::middleware('auth:sanctum')->get('/api/users/{id}', [\App\Http\Controllers\API\UserController::class, 'show']);

            // Add barangay-specific application routes
            Route::middleware('auth:sanctum')->get('/api/applications/barangay/{barangay}/status/{status}', function (Request $request, $barangay, $status) {
                try {
                    $decodedBarangay = urldecode($barangay);
                    $decodedStatus = urldecode($status);
                    
                    $query = \App\Models\Application::where('barangay', $decodedBarangay);
                    
                    if ($decodedStatus !== 'all') {
                        $query->where('status', $decodedStatus);
                    }
                    
                    $applications = $query->get();
                    
                    return response()->json($applications);
                } catch (\Exception $e) {
                    return response()->json(['error' => $e->getMessage()], 500);
                }
            });

            Route::middleware('api')
                ->prefix('api')
                ->group(base_path('routes/api.php'));

            Route::middleware('web')
                ->group(base_path('routes/web.php'));
        });
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });
    }
}
