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
        //
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CouponCode $couponCode)
    {
        //
    }
}
