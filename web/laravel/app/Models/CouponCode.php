<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CouponCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'description',
        'discount_type',
        'discount_value',
        'start_date',
        'end_date',
        'max_uses',
        'max_uses_per_user',
        'min_purchase_amount',
        'is_active',
        'brand_id',
        'campaign_url',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
    ];

    /**
     * Get the brand that owns the coupon code.
     */
    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    /**
     * The categories that belong to the coupon code.
     */
    public function categories()
    {
        return $this->belongsToMany(Category::class, 'category_coupon_code');
    }
}
