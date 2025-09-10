<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('barangay_president', function (Blueprint $table) {
            // Drop the default id column
            $table->dropColumn('id');
            
            // Add the proper structure
            $table->unsignedBigInteger('userID')->primary();
            $table->string('barangayID', 50)->nullable();
            
            // Add foreign key constraint
            $table->foreign('userID')->references('userID')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('barangay_president', function (Blueprint $table) {
            $table->dropForeign(['userID']);
            $table->dropColumn(['userID', 'barangayID']);
            $table->id();
        });
    }
};
