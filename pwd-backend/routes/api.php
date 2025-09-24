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
use App\Http\Controllers\API\GmailController;
use App\Http\Controllers\LanguageController;
use App\Http\Controllers\DashboardController as MainDashboardController;
use App\Http\Controllers\API\AnalyticsController;

// Language routes
Route::prefix('language')->group(function () {
    Route::post('/change', [LanguageController::class, 'changeLanguage']);
    Route::get('/current', [LanguageController::class, 'getCurrentLanguage']);
    Route::get('/supported', [LanguageController::class, 'getSupportedLanguages']);
});

// Google Translate routes (commented out - controller needs to be created)
/*
Route::prefix('translate')->group(function () {
    Route::post('/', [TranslateController::class, 'translate']);
    Route::post('/batch', [TranslateController::class, 'translateBatch']);
    Route::post('/detect', [TranslateController::class, 'detectLanguage']);
    Route::post('/section', [TranslateController::class, 'translateSection']);
});
*/

// Public Dashboard routes (working)
Route::get('/dashboard-stats', [MainDashboardController::class, 'getDashboardStats']);
Route::get('/dashboard-monthly', [MainDashboardController::class, 'getMonthlyStats']);
Route::get('/dashboard-activities', [MainDashboardController::class, 'getRecentActivities']);
Route::get('/dashboard-coordination', [MainDashboardController::class, 'getBarangayCoordination']);






// Get applications by status
Route::get('/applications/status/{status}', function ($status) {
    try {
        $applications = \App\Models\Application::where('status', urldecode($status))->get();
        
        return response()->json($applications);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
});

// PWD Members fallback route (when pwd_member table doesn't exist)
Route::get('/pwd-members-fallback', function () {
    try {
        // Get approved applications as PWD members
        $approvedApplications = \App\Models\Application::where('status', 'Approved')->get();
        
        $members = $approvedApplications->map(function ($app) {
            return [
                'id' => $app->applicationID,
                'userID' => $app->applicationID,
                'firstName' => $app->firstName,
                'lastName' => $app->lastName,
                'middleName' => $app->middleName,
                'birthDate' => $app->birthDate,
                'gender' => $app->gender,
                'disabilityType' => $app->disabilityType,
                'address' => $app->address,
                'contactNumber' => $app->contactNumber,
                'email' => $app->email,
                'barangay' => $app->barangay,
                'emergencyContact' => $app->emergencyContact,
                'emergencyPhone' => $app->emergencyPhone,
                'emergencyRelationship' => $app->emergencyRelationship,
                'status' => 'Active',
                'created_at' => $app->created_at,
                'updated_at' => $app->updated_at
            ];
        });
        
        return response()->json([
            'success' => true,
            'members' => $members,
            'count' => $members->count(),
            'source' => 'approved_applications'
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to fetch PWD members',
            'error' => $e->getMessage()
        ], 500);
    }
});


// Database and email test route
Route::get('/test-database-email', function () {
    try {
        // Test database connection
        $dbTest = 'Database: ';
        try {
            $appCount = \App\Models\Application::count();
            $dbTest .= "SUCCESS - Applications count: {$appCount}";
        } catch (\Exception $e) {
            $dbTest .= "ERROR - " . $e->getMessage();
        }

        // Test email service
        $emailTest = 'Email: ';
        try {
            $emailService = new \App\Services\EmailService();
            $gmailService = $emailService->getGmailService();
            $emailTest .= "Gmail API configured: " . ($gmailService->isConfigured() ? 'YES' : 'NO');
        } catch (\Exception $e) {
            $emailTest .= "ERROR - " . $e->getMessage();
        }

        return response()->json([
            'message' => 'Database and Email Test',
            'database_test' => $dbTest,
            'email_test' => $emailTest,
            'env_check' => [
                'db_connection' => config('database.default'),
                'db_host' => config('database.connections.mysql.host'),
                'db_database' => config('database.connections.mysql.database'),
                'mail_mailer' => config('mail.default'),
                'mail_host' => config('mail.mailers.smtp.host'),
                'mail_username' => config('mail.mailers.smtp.username'),
                'google_client_id' => !empty(config('services.google.client_id')) ? 'SET' : 'NOT SET',
                'google_refresh_token' => !empty(config('services.google.refresh_token')) ? 'SET' : 'NOT SET'
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Test failed',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Test approval email for existing application
Route::get('/test-approval-email/{applicationId}', function ($applicationId) {
    try {
        $application = \App\Models\Application::find($applicationId);
        
        if (!$application) {
            return response()->json([
                'error' => 'Application not found',
                'application_id' => $applicationId
            ], 404);
        }

        // Generate test credentials
        $testPassword = 'testpass123';
        $testPwdId = 'PWD-TEST-' . $applicationId;

        // Send approval email using SMTP only
        \Illuminate\Support\Facades\Mail::send('emails.application-approved', [
            'firstName' => $application->firstName,
            'lastName' => $application->lastName,
            'email' => $application->email,
            'password' => $testPassword,
            'pwdId' => $testPwdId,
            'loginUrl' => 'http://localhost:3000/login'
        ], function ($message) use ($application) {
            $message->to($application->email)
                   ->subject('PWD Application Approved - Account Created')
                   ->from('sarinonhoelivan29@gmail.com', 'Cabuyao PDAO RMS');
        });

        return response()->json([
            'message' => 'Approval email sent successfully',
            'application' => [
                'id' => $application->applicationID,
                'name' => $application->firstName . ' ' . $application->lastName,
                'email' => $application->email
            ],
            'credentials' => [
                'email' => $application->email,
                'password' => $testPassword,
                'pwdId' => $testPwdId
            ],
            'from' => 'sarinonhoelivan29@gmail.com'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to send approval email',
            'message' => $e->getMessage(),
            'application_id' => $applicationId
        ], 500);
    }
});

// Test Gmail integration route (for testing purposes)
Route::get('/test-gmail-integration', function () {
    try {
        $emailService = new \App\Services\EmailService();
        $gmailService = $emailService->getGmailService();
        
        $status = [
            'gmail_configured' => $gmailService->isConfigured(),
            'client_id_set' => !empty(config('services.google.client_id')),
            'client_secret_set' => !empty(config('services.google.client_secret')),
            'refresh_token_set' => !empty(config('services.google.refresh_token')),
            'redirect_uri' => config('services.google.redirect_uri'),
            'frontend_url' => config('app.frontend_url', 'http://localhost:3000'),
            'admin_email' => 'sarinonhoelivan29@gmail.com',
            'mail_from_address' => config('mail.from.address'),
            'mail_from_name' => config('mail.from.name')
        ];
        
        return response()->json([
            'message' => 'Gmail integration test for admin email',
            'status' => $status,
            'admin_email' => 'sarinonhoelivan29@gmail.com',
            'instructions' => [
                '1. Set up Google Cloud Console project',
                '2. Enable Gmail API',
                '3. Create OAuth 2.0 credentials',
                '4. Add environment variables to .env',
                '5. Complete OAuth flow via /api/gmail/auth-url',
                '6. Test email sending via /api/gmail/test'
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Gmail integration test failed',
            'message' => $e->getMessage(),
            'admin_email' => 'sarinonhoelivan29@gmail.com'
        ], 500);
    }
});

// Test sending approval email to applicant
Route::get('/test-send-approval-email/{email}', function ($email) {
    try {
        $emailService = new \App\Services\EmailService();
        
        $testData = [
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => $email, // This will be the recipient
            'password' => 'testpass123',
            'pwdId' => 'PWD-TEST-001',
            'loginUrl' => 'http://localhost:3000/login'
        ];
        
        $result = $emailService->sendApplicationApprovalEmail($testData);
        
        return response()->json([
            'message' => 'Test approval email sent',
            'success' => $result,
            'recipient' => $email,
            'from' => 'sarinonhoelivan29@gmail.com',
            'test_data' => $testData
        ]);
        
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to send test approval email',
            'message' => $e->getMessage(),
            'recipient' => $email
        ], 500);
    }
});

// Test application submission (for debugging)
Route::post('/test-application-submission', function (Request $request) {
    try {
        // Log the incoming request
        \Illuminate\Support\Facades\Log::info('Test application submission', [
            'request_data' => $request->all(),
            'has_files' => $request->hasFile('idPicture') || $request->hasFile('medicalCertificate') || $request->hasFile('barangayClearance')
        ]);

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
            // Document validation rules
            'idPicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'medicalCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'clinicalAbstract' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'voterCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'idPicture_0' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'idPicture_1' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'birthCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'wholeBodyPicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'affidavit' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'barangayCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'barangayClearance' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['status'] = 'Pending Barangay Approval';
        $data['submissionDate'] = now();

        // Handle file uploads
        $uploadPath = 'uploads/applications/' . date('Y/m/d');
        \Illuminate\Support\Facades\Storage::makeDirectory($uploadPath);

        if ($request->hasFile('idPicture')) {
            $idPictureFile = $request->file('idPicture');
            $idPictureName = 'id_picture_' . time() . '.' . $idPictureFile->getClientOriginalExtension();
            $idPicturePath = $idPictureFile->storeAs($uploadPath, $idPictureName, 'public');
            $data['idPicture'] = $idPicturePath;
        }

        if ($request->hasFile('medicalCertificate')) {
            $medicalFile = $request->file('medicalCertificate');
            $medicalName = 'medical_cert_' . time() . '.' . $medicalFile->getClientOriginalExtension();
            $medicalPath = $medicalFile->storeAs($uploadPath, $medicalName, 'public');
            $data['medicalCertificate'] = $medicalPath;
        }

        if ($request->hasFile('barangayClearance')) {
            $clearanceFile = $request->file('barangayClearance');
            $clearanceName = 'barangay_clearance_' . time() . '.' . $clearanceFile->getClientOriginalExtension();
            $clearancePath = $clearanceFile->storeAs($uploadPath, $clearanceName, 'public');
            $data['barangayClearance'] = $clearancePath;
        }

        // Handle new document fields
        if ($request->hasFile('clinicalAbstract')) {
            $clinicalFile = $request->file('clinicalAbstract');
            $clinicalName = 'clinical_abstract_' . time() . '.' . $clinicalFile->getClientOriginalExtension();
            $clinicalPath = $clinicalFile->storeAs($uploadPath, $clinicalName, 'public');
            $data['clinicalAbstract'] = $clinicalPath;
        }

        if ($request->hasFile('voterCertificate')) {
            $voterFile = $request->file('voterCertificate');
            $voterName = 'voter_certificate_' . time() . '.' . $voterFile->getClientOriginalExtension();
            $voterPath = $voterFile->storeAs($uploadPath, $voterName, 'public');
            $data['voterCertificate'] = $voterPath;
        }

        // Handle multiple ID pictures
        $idPictures = [];
        for ($i = 0; $i < 2; $i++) {
            if ($request->hasFile("idPicture_$i")) {
                $idPictureFile = $request->file("idPicture_$i");
                $idPictureName = "id_picture_{$i}_" . time() . '.' . $idPictureFile->getClientOriginalExtension();
                $idPicturePath = $idPictureFile->storeAs($uploadPath, $idPictureName, 'public');
                $idPictures[] = $idPicturePath;
            }
        }
        if (!empty($idPictures)) {
            $data['idPictures'] = json_encode($idPictures);
        }

        if ($request->hasFile('birthCertificate')) {
            $birthFile = $request->file('birthCertificate');
            $birthName = 'birth_certificate_' . time() . '.' . $birthFile->getClientOriginalExtension();
            $birthPath = $birthFile->storeAs($uploadPath, $birthName, 'public');
            $data['birthCertificate'] = $birthPath;
        }

        if ($request->hasFile('wholeBodyPicture')) {
            $wholeBodyFile = $request->file('wholeBodyPicture');
            $wholeBodyName = 'whole_body_picture_' . time() . '.' . $wholeBodyFile->getClientOriginalExtension();
            $wholeBodyPath = $wholeBodyFile->storeAs($uploadPath, $wholeBodyName, 'public');
            $data['wholeBodyPicture'] = $wholeBodyPath;
        }

        if ($request->hasFile('affidavit')) {
            $affidavitFile = $request->file('affidavit');
            $affidavitName = 'affidavit_' . time() . '.' . $affidavitFile->getClientOriginalExtension();
            $affidavitPath = $affidavitFile->storeAs($uploadPath, $affidavitName, 'public');
            $data['affidavit'] = $affidavitPath;
        }

        if ($request->hasFile('barangayCertificate')) {
            $barangayCertFile = $request->file('barangayCertificate');
            $barangayCertName = 'barangay_certificate_' . time() . '.' . $barangayCertFile->getClientOriginalExtension();
            $barangayCertPath = $barangayCertFile->storeAs($uploadPath, $barangayCertName, 'public');
            $data['barangayCertificate'] = $barangayCertPath;
        }

        \Illuminate\Support\Facades\Log::info('Creating application with data', [
            'data' => $data
        ]);

        $application = \App\Models\Application::create($data);

        \Illuminate\Support\Facades\Log::info('Application created successfully', [
            'application_id' => $application->applicationID,
            'application' => $application->toArray()
        ]);

        return response()->json([
            'message' => 'Test application submitted successfully',
            'application' => $application,
            'debug_info' => [
                'data_sent' => $data,
                'application_id' => $application->applicationID
            ]
        ], 201);

    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Test application submission failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return response()->json([
            'error' => 'Failed to submit test application',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
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

// Debug PWD members and applications
Route::get('/debug-pwd-applications', function () {
    try {
        $members = \App\Models\PWDMember::all();
        $applications = \App\Models\Application::where('status', 'Approved')->get();
        
        $debug = [
            'pwd_members' => $members->map(function($member) {
                return [
                    'id' => $member->id,
                    'userID' => $member->userID,
                    'name' => $member->firstName . ' ' . $member->lastName
                ];
            }),
            'approved_applications' => $applications->map(function($app) {
                return [
                    'applicationID' => $app->applicationID,
                    'pwdID' => $app->pwdID,
                    'name' => $app->firstName . ' ' . $app->lastName,
                    'barangay' => $app->barangay
                ];
            })
        ];
        
        return response()->json($debug);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// PWD members route - Returns real database data with emergency contact
Route::get('/mock-pwd', function () {
    try {
        $members = \App\Models\PWDMember::all();
        
        // Transform the data to match the expected format
        $transformedMembers = $members->map(function ($member) {
            // Get emergency contact and barangay from the approved application
            // Match pwdID in applications to the PWD member's userID field
            $approvedApplication = \App\Models\Application::where('pwdID', $member->userID)
                ->where('status', 'Approved')
                ->latest()
                ->first();
            
            $emergencyContact = $approvedApplication ? $approvedApplication->emergencyContact : $member->emergencyContact;
            $barangay = $approvedApplication ? $approvedApplication->barangay : $member->barangay;
            $idPictures = $approvedApplication ? $approvedApplication->idPictures : null;
            
            // Get email from the User table
            $user = \App\Models\User::where('userID', $member->userID)->first();
            $email = $user ? $user->email : $member->email;
            
            // Generate PWD ID if not exists
            $pwdId = $member->pwd_id ?: 'PWD-' . str_pad($member->userID, 6, '0', STR_PAD_LEFT);
            
            return [
                'id' => $member->id,
                'userID' => $member->userID,
                'pwd_id' => $pwdId,
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
                'idPictures' => $idPictures,
                'email' => $email,
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
Route::apiResource('complaints', 'App\Http\Controllers\API\ComplaintController');
Route::apiResource('reports', 'App\Http\Controllers\API\ReportController');

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public benefit routes (for frontend access)
Route::get('/benefits', [BenefitController::class, 'index']);
Route::get('/benefits/{id}', [BenefitController::class, 'show']);

// Test route for benefits
Route::get('/test-benefits', function () {
    return response()->json(['message' => 'Benefits route test']);
});

// Simple benefits routes
Route::get('/benefits-simple', function () {
    try {
        $benefits = \App\Models\Benefit::all();
        return response()->json($benefits);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::post('/benefits-simple', function (Request $request) {
    try {
        $benefit = \App\Models\Benefit::create($request->all());
        return response()->json($benefit, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::put('/benefits-simple/{id}', function (Request $request, $id) {
    try {
        $benefit = \App\Models\Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }
        $benefit->update($request->all());
        return response()->json($benefit);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::delete('/benefits-simple/{id}', function ($id) {
    try {
        $benefit = \App\Models\Benefit::find($id);
        if (!$benefit) {
            return response()->json(['error' => 'Benefit not found'], 404);
        }
        $benefit->delete();
        return response()->json(['message' => 'Benefit deleted successfully']);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

// Benefit claims routes
Route::get('/benefit-claims/{benefitId}', function ($benefitId) {
    try {
        $claims = \App\Models\BenefitClaim::where('benefitID', $benefitId)->get();
        return response()->json($claims);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

Route::post('/benefit-claims', function (Request $request) {
    try {
        $claim = \App\Models\BenefitClaim::create($request->all());
        return response()->json($claim, 201);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});

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


// Public application submission route
Route::post('/applications', function (Request $request) {
    try {
        // Log the incoming request for debugging
        \Illuminate\Support\Facades\Log::info('Application submission attempt', [
            'request_data' => $request->all(),
            'has_files' => $request->hasFile('idPicture') || $request->hasFile('medicalCertificate') || $request->hasFile('barangayClearance')
        ]);

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
            // Document validation rules
            'idPicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'medicalCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'clinicalAbstract' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'voterCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'idPicture_0' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'idPicture_1' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'birthCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'wholeBodyPicture' => 'nullable|file|mimes:jpeg,png,jpg|max:2048',
            'affidavit' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'barangayCertificate' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
            'barangayClearance' => 'nullable|file|mimes:jpeg,png,jpg,pdf|max:2048',
        ]);

        if ($validator->fails()) {
            \Illuminate\Support\Facades\Log::error('Application validation failed', [
                'errors' => $validator->errors()
            ]);
            return response()->json([
                'error' => 'Validation failed',
                'messages' => $validator->errors()
            ], 422);
        }

        $data = $request->all();
        $data['status'] = 'Pending Barangay Approval';
        $data['submissionDate'] = now();

        // Handle file uploads
        $uploadPath = 'uploads/applications/' . date('Y/m/d');
        \Illuminate\Support\Facades\Storage::makeDirectory($uploadPath);

        if ($request->hasFile('idPicture')) {
            $idPictureFile = $request->file('idPicture');
            $idPictureName = 'id_picture_' . time() . '.' . $idPictureFile->getClientOriginalExtension();
            $idPicturePath = $idPictureFile->storeAs($uploadPath, $idPictureName, 'public');
            $data['idPicture'] = $idPicturePath;
        }

        if ($request->hasFile('medicalCertificate')) {
            $medicalFile = $request->file('medicalCertificate');
            $medicalName = 'medical_cert_' . time() . '.' . $medicalFile->getClientOriginalExtension();
            $medicalPath = $medicalFile->storeAs($uploadPath, $medicalName, 'public');
            $data['medicalCertificate'] = $medicalPath;
        }

        if ($request->hasFile('barangayClearance')) {
            $clearanceFile = $request->file('barangayClearance');
            $clearanceName = 'barangay_clearance_' . time() . '.' . $clearanceFile->getClientOriginalExtension();
            $clearancePath = $clearanceFile->storeAs($uploadPath, $clearanceName, 'public');
            $data['barangayClearance'] = $clearancePath;
        }

        // Handle new document fields
        if ($request->hasFile('clinicalAbstract')) {
            $clinicalFile = $request->file('clinicalAbstract');
            $clinicalName = 'clinical_abstract_' . time() . '.' . $clinicalFile->getClientOriginalExtension();
            $clinicalPath = $clinicalFile->storeAs($uploadPath, $clinicalName, 'public');
            $data['clinicalAbstract'] = $clinicalPath;
        }

        if ($request->hasFile('voterCertificate')) {
            $voterFile = $request->file('voterCertificate');
            $voterName = 'voter_certificate_' . time() . '.' . $voterFile->getClientOriginalExtension();
            $voterPath = $voterFile->storeAs($uploadPath, $voterName, 'public');
            $data['voterCertificate'] = $voterPath;
        }

        // Handle multiple ID pictures
        $idPictures = [];
        for ($i = 0; $i < 2; $i++) {
            if ($request->hasFile("idPicture_$i")) {
                $idPictureFile = $request->file("idPicture_$i");
                $idPictureName = "id_picture_{$i}_" . time() . '.' . $idPictureFile->getClientOriginalExtension();
                $idPicturePath = $idPictureFile->storeAs($uploadPath, $idPictureName, 'public');
                $idPictures[] = $idPicturePath;
            }
        }
        if (!empty($idPictures)) {
            $data['idPictures'] = json_encode($idPictures);
        }

        if ($request->hasFile('birthCertificate')) {
            $birthFile = $request->file('birthCertificate');
            $birthName = 'birth_certificate_' . time() . '.' . $birthFile->getClientOriginalExtension();
            $birthPath = $birthFile->storeAs($uploadPath, $birthName, 'public');
            $data['birthCertificate'] = $birthPath;
        }

        if ($request->hasFile('wholeBodyPicture')) {
            $wholeBodyFile = $request->file('wholeBodyPicture');
            $wholeBodyName = 'whole_body_picture_' . time() . '.' . $wholeBodyFile->getClientOriginalExtension();
            $wholeBodyPath = $wholeBodyFile->storeAs($uploadPath, $wholeBodyName, 'public');
            $data['wholeBodyPicture'] = $wholeBodyPath;
        }

        if ($request->hasFile('affidavit')) {
            $affidavitFile = $request->file('affidavit');
            $affidavitName = 'affidavit_' . time() . '.' . $affidavitFile->getClientOriginalExtension();
            $affidavitPath = $affidavitFile->storeAs($uploadPath, $affidavitName, 'public');
            $data['affidavit'] = $affidavitPath;
        }

        if ($request->hasFile('barangayCertificate')) {
            $barangayCertFile = $request->file('barangayCertificate');
            $barangayCertName = 'barangay_certificate_' . time() . '.' . $barangayCertFile->getClientOriginalExtension();
            $barangayCertPath = $barangayCertFile->storeAs($uploadPath, $barangayCertName, 'public');
            $data['barangayCertificate'] = $barangayCertPath;
        }

        \Illuminate\Support\Facades\Log::info('Creating application with data', [
            'data' => $data
        ]);

        $application = \App\Models\Application::create($data);

        \Illuminate\Support\Facades\Log::info('Application created successfully', [
            'application_id' => $application->applicationID,
            'application' => $application->toArray()
        ]);

        return response()->json([
            'message' => 'Application submitted successfully',
            'application' => $application
        ], 201);

    } catch (\Exception $e) {
        \Illuminate\Support\Facades\Log::error('Application submission failed', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
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
    
    // PWD Member change password route
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
    Route::get('reports/all-barangays', [ReportController::class, 'getAllBarangays']);

// Debug route for testing barangay performance
Route::get('debug/barangay-performance', function() {
    try {
        $pwdCount = \App\Models\PWDMember::count();
        $appCount = \App\Models\Application::count();
        
        return response()->json([
            'pwd_members_total' => $pwdCount,
            'applications_total' => $appCount,
            'status' => 'success'
        ]);
    } catch (\Exception $e) {
        return response()->json(['error' => $e->getMessage()], 500);
    }
});
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
    
    // Gmail API routes for admin email (sarinonhoelivan29@gmail.com)
    Route::get('gmail/auth-url', [GmailController::class, 'getAuthUrl']);
    Route::post('gmail/callback', [GmailController::class, 'handleCallback']);
    Route::get('gmail/test', [GmailController::class, 'testConnection']);
    Route::get('gmail/status', [GmailController::class, 'getStatus']);
    
    // Analytics routes with automated suggestions
    Route::prefix('analytics')->group(function () {
        Route::get('suggestions', [AnalyticsController::class, 'getAutomatedSuggestions']);
        Route::get('suggestions/category/{category}', [AnalyticsController::class, 'getCategorySuggestions']);
        Route::get('suggestions/summary', [AnalyticsController::class, 'getSuggestionSummary']);
        Route::get('suggestions/high-priority', [AnalyticsController::class, 'getHighPrioritySuggestions']);
        Route::get('transaction-analysis', [AnalyticsController::class, 'getTransactionAnalysis']);
    });
});

// Simple test route
Route::get('/api/test-basic', function () {
    return response()->json([
        'message' => 'Server is working!',
        'status' => 'OK',
        'time' => now()
    ]);
});

// Test email sending with updated credentials
Route::get('/api/test-email/{email}', function ($email) {
    try {
        $emailService = new \App\Services\EmailService();
        
        $result = $emailService->sendApplicationApprovalEmail([
            'firstName' => 'Test',
            'lastName' => 'User',
            'email' => $email,
            'password' => 'test123',
            'pwdId' => 'PWD-000001',
            'loginUrl' => 'http://localhost:3000/login'
        ]);

        return response()->json([
            'message' => 'Email test completed',
            'email' => $email,
            'sent' => $result,
            'from' => 'sarinonhoelivan29@gmail.com'
        ]);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Email test failed',
            'message' => $e->getMessage(),
            'email' => $email
        ], 500);
    }
});

Route::get('/api/test-admin-approve/{applicationId}', function ($applicationId) {
    try {
        $application = \App\Models\Application::findOrFail($applicationId);
        
        // Generate secure random password
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
        $pwdId = 'PWD-' . str_pad($pwdUser->userID, 6, '0', STR_PAD_LEFT);

        // Update application status
        $application->update([
            'status' => 'Approved',
            'remarks' => 'Test approval - Account created',
            'pwdID' => $pwdUser->userID
        ]);

        // Send email notification
        try {
            $emailService = new \App\Services\EmailService();
            $emailSent = $emailService->sendApplicationApprovalEmail([
                'firstName' => $application->firstName,
                'lastName' => $application->lastName,
                'email' => $application->email,
                'password' => $randomPassword,
                'pwdId' => $pwdId,
                'loginUrl' => config('app.frontend_url', 'http://localhost:3000/login')
            ]);

            return response()->json([
                'message' => '✅ ADMIN APPROVAL SUCCESSFUL!',
                'details' => [
                    'application_approved' => true,
                    'user_account_created' => true,
                    'email_sent' => $emailSent
                ],
                'application' => [
                    'id' => $application->applicationID,
                    'name' => $application->firstName . ' ' . $application->lastName,
                    'email' => $application->email,
                    'status' => $application->status
                ],
                'user_account' => [
                    'userID' => $pwdUser->userID,
                    'email' => $pwdUser->email,
                    'role' => $pwdUser->role,
                    'status' => $pwdUser->status,
                    'pwdId' => $pwdId
                ],
                'login_credentials' => [
                    'email' => $application->email,
                    'password' => $randomPassword,
                    'note' => 'Password is hashed in database for security'
                ],
                'email_status' => $emailSent ? 'Email sent successfully' : 'Email failed to send'
            ]);

        } catch (\Exception $mailError) {
            return response()->json([
                'message' => '✅ ADMIN APPROVAL SUCCESSFUL! (Email failed)',
                'details' => [
                    'application_approved' => true,
                    'user_account_created' => true,
                    'email_sent' => false,
                    'email_error' => $mailError->getMessage()
                ],
                'application' => $application,
                'user_account' => $pwdUser,
                'login_credentials' => [
                    'email' => $application->email,
                    'password' => $randomPassword
                ]
            ]);
        }

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to approve application',
            'message' => $e->getMessage()
        ], 500);
    }
});

Route::get('/api/test-approve-application/{applicationId}', function ($applicationId) {
    try {
        $application = \App\Models\Application::findOrFail($applicationId);
        
        // Generate secure random password
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
        $pwdId = 'PWD-' . str_pad($pwdUser->userID, 6, '0', STR_PAD_LEFT);

        // Update application status
        $application->update([
            'status' => 'Approved',
            'remarks' => 'Test approval - Account created',
            'pwdID' => $pwdUser->userID
        ]);

        // Send email notification
        try {
            $emailService = new \App\Services\EmailService();
            $emailSent = $emailService->sendApplicationApprovalEmail([
                'firstName' => $application->firstName,
                'lastName' => $application->lastName,
                'email' => $application->email,
                'password' => $randomPassword,
                'pwdId' => $pwdId,
                'loginUrl' => config('app.frontend_url', 'http://localhost:3000/login')
            ]);

            return response()->json([
                'message' => 'Application approved successfully! User account created and email sent.',
                'application' => [
                    'id' => $application->applicationID,
                    'name' => $application->firstName . ' ' . $application->lastName,
                    'email' => $application->email,
                    'status' => $application->status
                ],
                'user_account' => [
                    'userID' => $pwdUser->userID,
                    'email' => $pwdUser->email,
                    'role' => $pwdUser->role,
                    'status' => $pwdUser->status,
                    'pwdId' => $pwdId
                ],
                'login_credentials' => [
                    'email' => $application->email,
                    'password' => $randomPassword,
                    'note' => 'Password is hashed in database for security'
                ],
                'email_sent' => $emailSent
            ]);

        } catch (\Exception $mailError) {
            return response()->json([
                'message' => 'Application approved and user account created, but email failed to send.',
                'error' => $mailError->getMessage(),
                'application' => $application,
                'user_account' => $pwdUser,
                'login_credentials' => [
                    'email' => $application->email,
                    'password' => $randomPassword
                ]
            ]);
        }

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to approve application',
            'message' => $e->getMessage()
        ], 500);
    }
});

// Fallback route for undefined API endpoints
Route::fallback(function () {
    return response()->json([
        'message' => 'API endpoint not found. Please check your request.'
    ], 404);
});