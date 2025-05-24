@extends('frontend.layouts.app')

@section('content')
<div class="container py-5">
    <!-- Page Header -->
    <div class="row mb-5">
        <div class="col-12">
            <div class="text-center">
                <h1 class="display-4 fw-bold mb-3">Kategoriler</h1>
                <p class="lead text-muted">İhtiyacınıza göre kategori seçin ve en iyi fırsatları keşfedin</p>
            </div>
        </div>
    </div>

    <!-- Categories Grid -->
    <div class="row g-4">
        @forelse($categories as $category)
        <div class="col-6 col-md-4 col-lg-3">
            <a href="{{ route('categories.show', $category->slug) }}" class="text-decoration-none">
                <div class="card category-card h-100 border-0 shadow-sm hover-scale">
                    <div class="card-img-wrapper">
                        <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/300x200?text=' . urlencode($category->name) }}" 
                            class="card-img-top" alt="{{ $category->name }}" loading="lazy">
                        <div class="card-img-overlay d-flex align-items-end">
                            <h5 class="card-title text-white m-0 p-3 w-100 category-label">{{ $category->name }}</h5>
                        </div>
                    </div>
                    @if($category->children && $category->children->count() > 0)
                    <div class="card-body">
                        <div class="d-flex flex-wrap gap-1">
                            @foreach($category->children->take(3) as $child)
                                <span class="badge bg-light text-dark">{{ $child->name }}</span>
                            @endforeach
                            @if($category->children->count() > 3)
                                <span class="badge bg-primary">+{{ $category->children->count() - 3 }} daha</span>
                            @endif
                        </div>
                    </div>
                    @endif
                </div>
            </a>
        </div>
        @empty
        <div class="col-12">
            <div class="text-center py-5">
                <i class="bi bi-folder2-open display-1 text-muted mb-3"></i>
                <h3 class="text-muted">Henüz kategori bulunmuyor</h3>
                <p class="text-muted">Yakında yeni kategoriler eklenecek!</p>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($categories->hasPages())
    <div class="row mt-5">
        <div class="col-12 d-flex justify-content-center">
            {{ $categories->links() }}
        </div>
    </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .card-img-wrapper {
        position: relative;
        height: 200px;
        overflow: hidden;
        border-radius: 12px 12px 0 0;
    }
    
    .card-img-wrapper img {
        height: 100%;
        width: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
    }
    
    .category-card:hover img {
        transform: scale(1.05);
    }
    
    .category-label {
        background: linear-gradient(0deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%);
        border-radius: 0 0 12px 12px;
    }
    
    .hover-scale {
        transition: all 0.3s ease;
    }
    
    .hover-scale:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15) !important;
    }

    .category-card {
        border-radius: 12px;
        overflow: hidden;
    }
</style>
@endpush
