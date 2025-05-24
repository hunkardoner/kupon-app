<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Brand;
use Illuminate\Http\Request;

class BrandController extends Controller
{
    public function index()
    {
        try {
            $brands = Brand::where('is_active', true)
                ->orderBy('name')
                ->paginate(12);

            return view('frontend.brands.index', compact('brands'));
        } catch (\Exception $e) {
            \Log::error('BrandController index error: ' . $e->getMessage());
            throw $e;
        }
    }

    public function show($slug)
    {
        $brand = Brand::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        $couponCodes = $brand->couponCodes()
            ->where('is_active', true)
            ->where(function($query) {
                $query->where('end_date', '>=', now())
                      ->orWhereNull('end_date');
            })
            ->with('categories')
            ->latest()
            ->paginate(12);

        return view('frontend.brands.show', compact('brand', 'couponCodes'));
    }
}
