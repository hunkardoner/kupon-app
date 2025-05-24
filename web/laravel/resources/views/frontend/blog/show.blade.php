@extends('frontend.layouts.app')

@section('title', $blog->meta_title ?: $blog->title)
@section('meta_description', $blog->meta_description ?: $blog->excerpt)

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item"><a href="{{ route('blog.index') }}">Blog</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ \Str::limit($blog->title, 50) }}</li>
        </ol>
    </nav>

    <div class="row">
        <!-- Main Content -->
        <div class="col-lg-8">
            <article class="blog-post">
                <!-- Featured Image -->
                @if($blog->image)
                    <div class="blog-featured-image mb-4">
                        <img src="{{ $blog->image_url }}" alt="{{ $blog->title }}" class="img-fluid rounded shadow">
                    </div>
                @endif

                <!-- Post Header -->
                <header class="mb-4">
                    <h1 class="display-5 mb-3">{{ $blog->title }}</h1>
                    
                    <div class="blog-meta d-flex flex-wrap align-items-center text-muted mb-3">
                        <span class="me-3">
                            <i class="fas fa-calendar-alt me-1"></i>
                            {{ $blog->published_at->format('d M Y') }}
                        </span>
                        <span class="me-3">
                            <i class="fas fa-clock me-1"></i>
                            {{ $blog->reading_time }} dakika okuma
                        </span>
                        <span>
                            <i class="fas fa-eye me-1"></i>
                            Yayınlandı
                        </span>
                    </div>
                </header>

                <!-- Post Content -->
                <div class="blog-content">
                    {!! $blog->content !!}
                </div>

                <!-- Share Buttons -->
                <div class="blog-share mt-5 pt-4 border-top">
                    <h6 class="mb-3">Bu yazıyı paylaş:</h6>
                    <div class="d-flex gap-2">
                        <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->url()) }}" 
                           target="_blank" class="btn btn-outline-primary btn-sm">
                            <i class="fab fa-facebook-f me-1"></i>Facebook
                        </a>
                        <a href="https://twitter.com/intent/tweet?url={{ urlencode(request()->url()) }}&text={{ urlencode($blog->title) }}" 
                           target="_blank" class="btn btn-outline-info btn-sm">
                            <i class="fab fa-twitter me-1"></i>Twitter
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url={{ urlencode(request()->url()) }}" 
                           target="_blank" class="btn btn-outline-dark btn-sm">
                            <i class="fab fa-linkedin-in me-1"></i>LinkedIn
                        </a>
                        <button onclick="copyToClipboard('{{ request()->url() }}')" class="btn btn-outline-secondary btn-sm">
                            <i class="fas fa-link me-1"></i>Linki Kopyala
                        </button>
                    </div>
                </div>
            </article>
        </div>

        <!-- Sidebar -->
        <div class="col-lg-4">
            <div class="sticky-top" style="top: 2rem;">
                <!-- Related Posts -->
                @if($relatedBlogs->count() > 0)
                    <div class="card mb-4">
                        <div class="card-header bg-white">
                            <h6 class="card-title mb-0">
                                <i class="fas fa-newspaper me-2 text-primary"></i>
                                İlgili Yazılar
                            </h6>
                        </div>
                        <div class="card-body">
                            @foreach($relatedBlogs as $related)
                                <div class="d-flex mb-3 {{ !$loop->last ? 'pb-3 border-bottom' : '' }}">
                                    @if($related->image)
                                        <div class="flex-shrink-0 me-3">
                                            <img src="{{ $related->image_url }}" alt="{{ $related->title }}" 
                                                 class="rounded" style="width: 60px; height: 60px; object-fit: cover;">
                                        </div>
                                    @endif
                                    <div class="flex-grow-1">
                                        <h6 class="mb-1">
                                            <a href="{{ route('blog.show', $related->slug) }}" 
                                               class="text-decoration-none text-dark small">
                                                {{ \Str::limit($related->title, 60) }}
                                            </a>
                                        </h6>
                                        <small class="text-muted">
                                            <i class="fas fa-calendar-alt me-1"></i>
                                            {{ $related->published_at->format('d M Y') }}
                                        </small>
                                    </div>
                                </div>
                            @endforeach
                        </div>
                    </div>
                @endif

                <!-- Back to Blog -->
                <div class="card">
                    <div class="card-body text-center">
                        <i class="fas fa-arrow-left text-primary mb-2" style="font-size: 2rem;"></i>
                        <h6 class="card-title">Tüm Blog Yazıları</h6>
                        <p class="card-text small text-muted mb-3">
                            Daha fazla ipucu ve haber için blog sayfamızı ziyaret edin.
                        </p>
                        <a href="{{ route('blog.index') }}" class="btn btn-primary btn-sm">
                            Blog'a Dön
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    .blog-featured-image img {
        width: 100%;
        height: 400px;
        object-fit: cover;
    }

    .blog-content {
        font-size: 1.1rem;
        line-height: 1.8;
    }

    .blog-content h1,
    .blog-content h2,
    .blog-content h3,
    .blog-content h4,
    .blog-content h5,
    .blog-content h6 {
        margin-top: 2rem;
        margin-bottom: 1rem;
        color: #333;
    }

    .blog-content p {
        margin-bottom: 1.5rem;
        text-align: justify;
    }

    .blog-content img {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        margin: 1.5rem 0;
    }

    .blog-content blockquote {
        border-left: 4px solid var(--bs-primary);
        padding-left: 1.5rem;
        margin: 2rem 0;
        font-style: italic;
        background-color: #f8f9fa;
        padding: 1rem 1.5rem;
        border-radius: 0 8px 8px 0;
    }

    .blog-content ul,
    .blog-content ol {
        margin-bottom: 1.5rem;
        padding-left: 2rem;
    }

    .blog-content li {
        margin-bottom: 0.5rem;
    }

    .blog-meta {
        font-size: 0.95rem;
    }

    .blog-share .btn {
        border-radius: 20px;
    }

    @media (max-width: 768px) {
        .blog-content {
            font-size: 1rem;
        }
        
        .blog-featured-image img {
            height: 250px;
        }
    }
</style>
@endpush

@push('scripts')
<script>
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(function() {
            // Show success message
            const button = event.target.closest('button');
            const originalHtml = button.innerHTML;
            button.innerHTML = '<i class="fas fa-check me-1"></i>Kopyalandı!';
            button.classList.remove('btn-outline-secondary');
            button.classList.add('btn-success');
            
            setTimeout(function() {
                button.innerHTML = originalHtml;
                button.classList.remove('btn-success');
                button.classList.add('btn-outline-secondary');
            }, 2000);
        }).catch(function(err) {
            console.error('Kopyalama hatası: ', err);
            alert('Link kopyalanamadı. Lütfen manuel olarak kopyalayın.');
        });
    }
</script>
@endpush
