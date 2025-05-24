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
    public function index(Request $request)
    {
        $query = CouponCode::with(['brand', 'categories'])->where('is_active', true);

        if ($request->has('brand_id')) {
            $query->where('brand_id', $request->input('brand_id'));
        }

        if ($request->has('category_id')) {
            $query->whereHas('categories', function ($q) use ($request) {
                $q->where('categories.id', $request->input('category_id'));
            });
        }

        return CouponCodeResource::collection($query->latest()->paginate(10));
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
            'campaign_url' => 'nullable|url|max:2048',
            'campaign_title' => 'nullable|string|max:255',
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
    public function show($id)
    {
        $couponCode = CouponCode::with(['brand', 'categories'])->find($id);
        
        if (!$couponCode) {
            return response()->json([
                'success' => false,
                'message' => 'Kupon kodu bulunamadı.'
            ], 404);
        }
        
        return new CouponCodeResource($couponCode);
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
            'campaign_url' => 'nullable|url|max:2048',
            'campaign_title' => 'nullable|string|max:255',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:categories,id'
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
