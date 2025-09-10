<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $primaryKey = 'userID';
    public $incrementing = true;

    protected $fillable = [
        'username',
        'password',
        'email',
        'role',
        'status'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    // Relationships
    public function admin()
    {
        return $this->hasOne(Admin::class, 'userID', 'userID');
    }

    public function barangayPresident()
    {
        return $this->hasOne(BarangayPresident::class, 'userID', 'userID');
    }

    public function pwdMember()
    {
        return $this->hasOne(PWDMember::class, 'userID', 'userID');
    }

    public function auditLogs()
    {
        return $this->hasMany(AuditLog::class, 'userID', 'userID');
    }

    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'authorID', 'userID');
    }

    public function reports()
    {
        return $this->hasMany(Report::class, 'generatedBy', 'userID');
    }

    // Helper methods
    public function isAdmin()
    {
        return $this->role === 'Admin';
    }

    public function isBarangayPresident()
    {
        return $this->role === 'BarangayPresident';
    }

    public function isPWDMember()
    {
        return $this->role === 'PWDMember';
    }

    // Override default password field
    public function getAuthPassword()
    {
        return $this->password;
    }
}
