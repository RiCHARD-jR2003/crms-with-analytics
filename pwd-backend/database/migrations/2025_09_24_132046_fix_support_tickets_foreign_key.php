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
        // Add the foreign key constraint (no need to drop since it doesn't exist)
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->foreign('pwd_member_id')->references('id')->on('pwd_members')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Drop the foreign key constraint
        Schema::table('support_tickets', function (Blueprint $table) {
            $table->dropForeign(['pwd_member_id']);
        });
    }
};
