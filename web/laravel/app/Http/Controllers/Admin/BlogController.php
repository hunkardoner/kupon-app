<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $blogs = Blog::latest()->paginate(10);
        return view('admin.blogs.index', compact('blogs'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('admin.blogs.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'content' => 'required|string',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:65535',
        ]);

        if ($request->hasFile('image')) {
            $imageName = Str::slug($validatedData['title']) . '-' . time() . '.' . $request->image->extension();
            $request->image->storeAs('public/blogs', $imageName);
            $validatedData['image'] = 'blogs/' . $imageName;
        }

        $validatedData['is_published'] = $request->has('is_published');
        if ($validatedData['is_published'] && empty($validatedData['published_at'])) {
            $validatedData['published_at'] = now();
        }

        Blog::create($validatedData);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Blog $blog)
    {
        return view('admin.blogs.show', compact('blog'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Blog $blog)
    {
        return view('admin.blogs.edit', compact('blog'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Blog $blog)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'content' => 'required|string',
            'is_published' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:65535',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if it exists
            if ($blog->image) {
                Storage::delete('public/' . $blog->image);
            }
            $imageName = Str::slug($validatedData['title']) . '-' . time() . '.' . $request->image->extension();
            $request->image->storeAs('public/blogs', $imageName);
            $validatedData['image'] = 'blogs/' . $imageName;
        }

        $validatedData['is_published'] = $request->has('is_published');
        if ($validatedData['is_published'] && empty($validatedData['published_at']) && !$blog->is_published) {
            $validatedData['published_at'] = now();
        } elseif (!$validatedData['is_published']) {
            $validatedData['published_at'] = null;
        }

        $blog->update($validatedData);

        return redirect()->route('admin.blogs.index')->with('success', 'Blog post updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Blog $blog)
    {
        if ($blog->image) {
            Storage::delete('public/' . $blog->image);
        }
        $blog->delete();
        return redirect()->route('admin.blogs.index')->with('success', 'Blog post deleted successfully.');
    }
}
