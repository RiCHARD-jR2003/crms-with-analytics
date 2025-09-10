<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Benefit extends Model
{
    use HasFactory;

    protected $table = 'benefit';
    protected $primaryKey = 'benefitID';
    
    protected $fillable = [
        'benefitType',
        'description',
        'schedule'
    ];

    protected $casts = [
        'schedule' => 'date'
    ];

    // Relationships
    public function benefitClaims()
    {
        return $this->hasMany(BenefitClaim::class, 'benefitID', 'benefitID');
    }
}