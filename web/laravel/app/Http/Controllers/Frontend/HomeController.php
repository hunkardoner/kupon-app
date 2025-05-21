<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\CouponCode;
use App\Models\Slider;
use Illuminate\Http\Request;

class HomeController extends Controller
{
    public function index()
    {
        $sliders = Slider::where('is_active', true)->orderBy('order')->get();
        $categories = Category::whereNull('parent_id')->with('children')->get();
        $couponCodes = CouponCode::where('is_active', true)
            ->where('end_date', '>=', now())
            ->orWhereNull('end_date')
            ->latest()
            ->take(10)
            ->get();

        return view('frontend.home', compact('sliders', 'categories', 'couponCodes'));
    }
}
