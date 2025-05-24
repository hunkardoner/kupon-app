<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Brand extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slug',
        'logo',
        'description',
        'is_active',
    ];

    /**
     * Get the logo URL with storage path
     */
    public function getLogoUrlAttribute()
    {
        if ($this->logo && !str_starts_with($this->logo, 'http')) {
            return asset('storage/' . $this->logo);
        }
        return $this->logo;
    }

    public function couponCodes()
    {
        return $this->hasMany(CouponCode::class);
    }
}
