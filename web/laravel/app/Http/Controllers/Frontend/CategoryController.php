<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::whereNull('parent_id')
            ->with('children')
            ->orderBy('name')
            ->paginate(12);

        return view('frontend.categories.index', compact('categories'));
    }

    public function show($slug)
    {
        $category = Category::where('slug', $slug)
            ->with('children')
            ->firstOrFail();

        $couponCodes = $category->couponCodes()
            ->where('is_active', true)
            ->where(function($query) {
                $query->where('end_date', '>=', now())
                      ->orWhereNull('end_date');
            })
            ->with('brand')
            ->latest()
            ->paginate(12);

        return view('frontend.categories.show', compact('category', 'couponCodes'));
    }
}
