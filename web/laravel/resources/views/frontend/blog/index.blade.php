@extends('frontend.layouts.app')

@section('title', 'Blog')

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item active" aria-current="page">Blog</li>
        </ol>
    </nav>

    <!-- Page Header -->
    <div class="row mb-5">
        <div class="col-md-12 text-center">
            <h1 class="display-4 mb-3">Blog</h1>
            <p class="lead text-muted">Kupon dünyasından haberler, ipuçları ve daha fazlası</p>
        </div>
    </div>

    <!-- Blog Posts -->
    @if($blogs->count() > 0)
        <div class="row">
            @foreach($blogs as $blog)
                <div class="col-md-6 col-lg-4 mb-4">
                    <article class="card h-100 shadow-sm blog-card">
                        @if($blog->image)
                            <div class="blog-image-container">
                                <img src="{{ $blog->image_url }}" alt="{{ $blog->title }}" class="card-img-top blog-image">
                                <div class="blog-overlay"></div>
                            </div>
                        @endif
                        
                        <div class="card-body d-flex flex-column">
                            <div class="blog-meta mb-2">
                                <small class="text-muted">
                                    <i class="fas fa-calendar-alt me-1"></i>
                                    {{ $blog->published_at->format('d M Y') }}
                                    <span class="mx-2">•</span>
                                    <i class="fas fa-clock me-1"></i>
                                    {{ $blog->reading_time }} dk okuma
                                </small>
                            </div>
                            
                            <h5 class="card-title mb-3">
                                <a href="{{ route('blog.show', $blog->slug) }}" class="text-decoration-none text-dark">
                                    {{ $blog->title }}
                                </a>
                            </h5>
                            
                            <p class="card-text text-muted flex-grow-1">
                                {{ $blog->excerpt }}
                            </p>
                            
                            <div class="mt-auto">
                                <a href="{{ route('blog.show', $blog->slug) }}" class="btn btn-outline-primary btn-sm">
                                    Devamını Oku
                                    <i class="fas fa-arrow-right ms-1"></i>
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        @if($blogs->hasPages())
            <div class="row mt-5">
                <div class="col-12 d-flex justify-content-center">
                    {{ $blogs->links() }}
                </div>
            </div>
        @endif
    @else
        <!-- No Posts -->
        <div class="row">
            <div class="col-12 text-center py-5">
                <div class="mb-4">
                    <i class="fas fa-newspaper fa-4x text-muted"></i>
                </div>
                <h3 class="text-muted mb-3">Henüz blog yazısı yok</h3>
                <p class="text-muted">Yakında ilginç blog yazıları yayınlanacak!</p>
            </div>
        </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .blog-card {
        border: none;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border-radius: 12px;
        overflow: hidden;
    }

    .blog-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
    }

    .blog-image-container {
        position: relative;
        height: 200px;
        overflow: hidden;
    }

    .blog-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
    }

    .blog-card:hover .blog-image {
        transform: scale(1.05);
    }

    .blog-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, rgba(0,0,0,0.1), transparent);
    }

    .blog-meta {
        font-size: 0.85rem;
    }

    .card-title a:hover {
        color: var(--bs-primary) !important;
    }

    .btn-outline-primary {
        border-radius: 20px;
        padding: 0.375rem 1rem;
    }
</style>
@endpush
