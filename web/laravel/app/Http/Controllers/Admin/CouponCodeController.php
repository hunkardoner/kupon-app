<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CouponCode;
use App\Models\Brand;
use App\Models\Category;
use Illuminate\Http\Request;

class CouponCodeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $couponCodes = CouponCode::with('brand')->latest()->paginate(10);
        return view('admin.coupon_codes.index', compact('couponCodes'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $brands = Brand::where('is_active', true)->orderBy('name')->get();
        $categories = Category::orderBy('name')->get();
        return view('admin.coupon_codes.create', compact('brands', 'categories'));
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
            'brand_id' => 'nullable|exists:brands,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);

        $couponCode = CouponCode::create($validatedData);

        if ($request->has('category_ids')) {
            $couponCode->categories()->sync($request->category_ids);
        }

        return redirect()->route('admin.coupon-codes.index')->with('success', 'Coupon code created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CouponCode $couponCode)
    {
        $couponCode->load('brand', 'categories');
        return view('admin.coupon_codes.show', compact('couponCode'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CouponCode $couponCode)
    {
        $brands = Brand::where('is_active', true)->orderBy('name')->get();
        $categories = Category::orderBy('name')->get();
        $couponCode->load('categories'); // Mevcut kategorileri yükle
        return view('admin.coupon_codes.edit', compact('couponCode', 'brands', 'categories'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CouponCode $couponCode)
    {
        $validatedData = $request->validate([
            'code' => 'required|string|max:255|unique:coupon_codes,code,' . $couponCode->id,
            'description' => 'nullable|string',
            'discount_type' => 'required|in:percentage,fixed_amount',
            'discount_value' => 'required|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'max_uses' => 'nullable|integer|min:0',
            'max_uses_per_user' => 'nullable|integer|min:0',
            'min_purchase_amount' => 'nullable|numeric|min:0',
            'is_active' => 'boolean',
            'brand_id' => 'nullable|exists:brands,id',
            'category_ids' => 'nullable|array',
            'category_ids.*' => 'exists:categories,id',
        ]);
        
        // 'is_active' checkbox değeri gelmezse false olarak ayarla
        $validatedData['is_active'] = $request->has('is_active');

        $couponCode->update($validatedData);

        if ($request->has('category_ids')) {
            $couponCode->categories()->sync($request->category_ids);
        } else {
            $couponCode->categories()->detach(); // Hiç kategori seçilmediyse mevcut ilişkileri kaldır
        }

        return redirect()->route('admin.coupon-codes.index')->with('success', 'Coupon code updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CouponCode $couponCode)
    {
        $couponCode->categories()->detach(); // Önce pivot tablodaki ilişkileri sil
        $couponCode->delete();
        return redirect()->route('admin.coupon-codes.index')->with('success', 'Coupon code deleted successfully.');
    }
}
