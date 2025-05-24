@extends('frontend.layouts.app')

@section('content')
<div class="container py-5">
    <!-- Page Header -->
    <div class="row mb-5">
        <div class="col-12">
            <div class="text-center">
                <h1 class="display-4 fw-bold mb-3">Popüler Markalar</h1>
                <p class="lead text-muted">En sevdiğiniz markalardan özel indirimler ve kupon kodları</p>
            </div>
        </div>
    </div>

    <!-- Search -->
    <div class="row mb-4">
        <div class="col-12">
            <form method="GET" class="d-flex justify-content-center">
                <div class="input-group" style="max-width: 500px;">
                    <input type="text" name="search" class="form-control form-control-lg" placeholder="Marka ara..." value="{{ request('search') }}">
                    <button type="submit" class="btn btn-primary">
                        <i class="bi bi-search"></i>
                    </button>
                </div>
            </form>
        </div>
    </div>

    <!-- Brands Grid -->
    <div class="row g-4">
        @forelse($brands as $brand)
        <div class="col-6 col-md-4 col-lg-3">
            <a href="{{ route('brands.show', $brand->slug) }}" class="text-decoration-none">
                <div class="card brand-card h-100 border-0 shadow-sm hover-scale">
                    <div class="card-body text-center p-4">
                        <div class="brand-logo-wrapper mb-3">
                            @if($brand->logo)
                                <img src="{{ $brand->logo_url }}" alt="{{ $brand->name }}" class="brand-logo img-fluid">
                            @else
                                <div class="brand-placeholder rounded-circle mx-auto d-flex align-items-center justify-content-center">
                                    <span class="fw-bold fs-1">{{ substr($brand->name, 0, 1) }}</span>
                                </div>
                            @endif
                        </div>
                        <h5 class="card-title mb-2">{{ $brand->name }}</h5>
                        @if($brand->description)
                        <p class="card-text text-muted small">{{ Str::limit($brand->description, 60) }}</p>
                        @endif
                        <div class="mt-3">
                            <span class="badge bg-primary">{{ $brand->couponCodes()->where('is_active', true)->count() }} Kupon</span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
        @empty
        <div class="col-12">
            <div class="text-center py-5">
                <i class="bi bi-shop display-1 text-muted mb-3"></i>
                <h3 class="text-muted">Henüz marka bulunmuyor</h3>
                <p class="text-muted">Yakında yeni markalar eklenecek!</p>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($brands->hasPages())
    <div class="row mt-5">
        <div class="col-12 d-flex justify-content-center">
            {{ $brands->links() }}
        </div>
    </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .brand-card {
        border-radius: 16px;
        transition: all 0.3s ease;
    }
    
    .hover-scale:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 40px rgba(0,0,0,0.1) !important;
    }
    
    .brand-logo-wrapper {
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .brand-logo {
        max-height: 80px;
        max-width: 100%;
        object-fit: contain;
    }
    
    .brand-placeholder {
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        color: white;
    }
    
    .card-title {
        color: #1f2937;
        font-weight: 600;
    }
    
    .card:hover .card-title {
        color: #6366F1;
    }
</style>
@endpush
