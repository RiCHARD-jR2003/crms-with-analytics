<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PWDMember extends Model
{
    use HasFactory;

    protected $table = 'pwd_member';
    protected $primaryKey = 'id';
    public $incrementing = true;

    protected $fillable = [
        'userID',
        'pwd_id',
        'pwd_id_generated_at',
        'qr_code_data',
        'qr_code_generated_at',
        'firstName',
        'lastName',
        'birthDate',
        'gender',
        'disabilityType',
        'address',
        'contactNumber'
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class, 'userID', 'userID');
    }

    public function applications()
    {
        return $this->hasMany(Application::class, 'pwdID', 'userID');
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class, 'pwdID', 'userID');
    }

    public function benefitClaims()
    {
        return $this->hasMany(BenefitClaim::class, 'pwdID', 'userID');
    }

    protected $casts = [
        'birthDate' => 'date',
        'pwd_id_generated_at' => 'datetime',
        'qr_code_generated_at' => 'datetime'
    ];
}