<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB; // Added this import for DB facade

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Temporarily change the column to VARCHAR to avoid enum constraints
        DB::statement("ALTER TABLE application MODIFY COLUMN status VARCHAR(50) DEFAULT 'Pending Barangay Approval'");
        
        // Update existing 'Pending' status to 'Pending Barangay Approval'
        DB::statement("UPDATE application SET status = 'Pending Barangay Approval' WHERE status = 'Pending'");
        
        // Change back to enum with new values
        DB::statement("ALTER TABLE application MODIFY COLUMN status ENUM('Pending Barangay Approval', 'Pending Admin Approval', 'Approved', 'Rejected') DEFAULT 'Pending Barangay Approval'");
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Temporarily change to VARCHAR
        DB::statement("ALTER TABLE application MODIFY COLUMN status VARCHAR(50) DEFAULT 'Pending'");
        
        // Update back to 'Pending'
        DB::statement("UPDATE application SET status = 'Pending' WHERE status IN ('Pending Barangay Approval', 'Pending Admin Approval')");
        
        // Change back to original enum
        DB::statement("ALTER TABLE application MODIFY COLUMN status ENUM('Pending', 'Approved', 'Rejected') DEFAULT 'Pending'");
    }
};
