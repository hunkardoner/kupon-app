<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CouponCode;
use Illuminate\Http\Request;
use App\Http\Resources\CouponCodeResource;

class CouponCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CouponCodeResource::collection(CouponCode::with(['brand', 'categories'])->where('is_active', true)->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'code' => 'required|string|max:255|unique:coupon_codes,code',
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'max_uses' => 'nullable|integer|min:0',
            'max_uses_per_user' => 'nullable|integer|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'brand_id' => 'required|exists:brands,id',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
        ]);

        $couponCode = CouponCode::create($validatedData);

        if ($request->has('categories') && is_array($request->input('categories'))) {
            $couponCode->categories()->sync($request->input('categories'));
        }

        return new CouponCodeResource($couponCode->load(['brand', 'categories']));
    }

    /**
     * Display the specified resource.
     */
    public function show(CouponCode $couponCode)
    {
        return new CouponCodeResource($couponCode->load(['brand', 'categories']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CouponCode $couponCode)
    {
        $validatedData = $request->validate([
            'code' => 'sometimes|required|string|max:255|unique:coupon_codes,code,' . $couponCode->id,
            'description' => 'nullable|string',
            'discount_type' => 'sometimes|required|in:percentage,fixed_amount',
            'discount_value' => 'sometimes|required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'max_uses' => 'nullable|integer|min:0',
            'max_uses_per_user' => 'nullable|integer|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'is_active' => 'sometimes|boolean',
            'brand_id' => 'sometimes|required|exists:brands,id',
            'categories' => 'nullable|array', // Expect an array of category IDs
            'categories.*' => 'exists:categories,id' // Each item in the array must be a valid category ID
        ]);

        $couponCode->update($validatedData);

        if ($request->has('categories')) {
            $couponCode->categories()->sync($request->input('categories', []));
        }

        return new CouponCodeResource($couponCode->load(['brand', 'categories']));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CouponCode $couponCode)
    {
        //
    }
}
