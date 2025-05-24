<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'image',
        'content',
        'is_published',
        'published_at',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Get the image URL with storage path
     */
    public function getImageUrlAttribute()
    {
        if ($this->image && !str_starts_with($this->image, 'http')) {
            return asset('storage/' . $this->image);
        }
        return $this->image;
    }

    /**
     * Get the blog excerpt
     */
    public function getExcerptAttribute()
    {
        return \Str::limit(strip_tags($this->content), 150);
    }

    /**
     * Get reading time in minutes
     */
    public function getReadingTimeAttribute()
    {
        $wordCount = str_word_count(strip_tags($this->content));
        $readingTime = ceil($wordCount / 200); // Average reading speed: 200 words per minute
        return $readingTime;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($blog) {
            if (empty($blog->slug)) {
                $blog->slug = Str::slug($blog->title);
            }
        });

        static::updating(function ($blog) {
            if (empty($blog->slug) || $blog->isDirty('title')) {
                $blog->slug = Str::slug($blog->title);
            }
        });
    }
}
