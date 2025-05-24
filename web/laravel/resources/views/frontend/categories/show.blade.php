@extends('frontend.layouts.app')

@section('content')
<div class="container py-5">
    <!-- Category Header -->
    <div class="row mb-5">
        <div class="col-12">
            <div class="category-header text-center p-5 rounded-4 position-relative overflow-hidden">
                @if($category->image)
                <div class="category-bg-image position-absolute top-0 start-0 w-100 h-100"></div>
                <div class="category-overlay position-absolute top-0 start-0 w-100 h-100"></div>
                @endif
                <div class="position-relative z-1">
                    <nav aria-label="breadcrumb" class="mb-3">
                        <ol class="breadcrumb justify-content-center">
                            <li class="breadcrumb-item"><a href="{{ route('home') }}" class="text-white-50">Anasayfa</a></li>
                            <li class="breadcrumb-item"><a href="{{ route('categories.index') }}" class="text-white-50">Kategoriler</a></li>
                            <li class="breadcrumb-item active text-white" aria-current="page">{{ $category->name }}</li>
                        </ol>
                    </nav>
                    <h1 class="display-4 fw-bold text-white mb-3">{{ $category->name }}</h1>
                    @if($category->description)
                    <p class="lead text-white-75 mb-0">{{ $category->description }}</p>
                    @endif
                    <div class="mt-4">
                        <span class="badge bg-primary fs-6 px-3 py-2">{{ $couponCodes->total() }} Kupon Mevcut</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Subcategories -->
    @if($category->children && $category->children->count() > 0)
    <div class="row mb-5">
        <div class="col-12">
            <h3 class="fw-bold mb-4">Alt Kategoriler</h3>
            <div class="row g-3">
                @foreach($category->children as $child)
                <div class="col-6 col-md-4 col-lg-3">
                    <a href="{{ route('categories.show', $child->slug) }}" class="text-decoration-none">
                        <div class="card border-0 shadow-sm hover-scale">
                            <div class="card-body text-center py-4">
                                <h6 class="mb-0">{{ $child->name }}</h6>
                            </div>
                        </div>
                    </a>
                </div>
                @endforeach
            </div>
        </div>
    </div>
    @endif

    <!-- Filters and Search -->
    <div class="row mb-4">
        <div class="col-md-8">
            <h3 class="fw-bold">{{ $category->name }} Kuponları</h3>
            <p class="text-muted">Bu kategorideki en güncel kupon kodları</p>
        </div>
        <div class="col-md-4">
            <form method="GET" class="d-flex">
                <input type="text" name="search" class="form-control me-2" placeholder="Kupon ara..." value="{{ request('search') }}">
                <button type="submit" class="btn btn-primary">
                    <i class="bi bi-search"></i>
                </button>
            </form>
        </div>
    </div>

    <!-- Coupons Grid -->
    <div class="row g-4">
        @forelse($couponCodes as $coupon)
        <div class="col-md-6 col-lg-4">
            <div class="card coupon-card h-100 border-0 shadow-sm hover-float">
                <div class="card-header border-0 bg-white pt-4 px-4">
                    <div class="d-flex align-items-center">
                        <div class="brand-logo me-3">
                            @if($coupon->brand && $coupon->brand->logo)
                                <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" class="img-fluid rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                            @else
                                <div class="brand-placeholder rounded-circle d-flex align-items-center justify-content-center" style="width: 40px; height: 40px; background-color: #6366F1; color: white; font-weight: bold;">
                                    {{ $coupon->brand ? substr($coupon->brand->name, 0, 1) : '?' }}
                                </div>
                            @endif
                        </div>
                        <div>
                            <h6 class="mb-0">{{ $coupon->brand ? $coupon->brand->name : 'Genel Teklif' }}</h6>
                            <small class="text-muted">{{ $coupon->end_date ? 'Son kullanım: ' . $coupon->end_date->format('d.m.Y') : 'Süresiz' }}</small>
                        </div>
                    </div>
                </div>
                <div class="card-body px-4">
                    <p class="card-text">{{ Str::limit($coupon->description, 80) }}</p>
                    @if($coupon->categories->count() > 0)
                    <div class="mb-3">
                        @foreach($coupon->categories->take(3) as $cat)
                            <span class="badge bg-light text-dark me-1">{{ $cat->name }}</span>
                        @endforeach
                    </div>
                    @endif
                </div>
                <div class="card-footer border-0 bg-white px-4 pb-4">
                    <div class="coupon-code-container d-flex align-items-center mb-3">
                        <div class="coupon-code flex-grow-1 text-center py-2 me-2 bg-light rounded" style="font-family: monospace; font-weight: bold; letter-spacing: 1px;">{{ $coupon->code }}</div>
                        <button class="btn btn-primary copy-btn" data-clipboard-text="{{ $coupon->code }}">
                            <i class="bi bi-clipboard"></i>
                        </button>
                    </div>
                    <div class="d-flex gap-2">
                        <a href="{{ route('coupons.show', $coupon->id) }}" class="btn btn-outline-secondary btn-sm">Detaylar</a>
                        @if($coupon->campaign_url)
                            <a href="{{ $coupon->campaign_url }}" target="_blank" class="btn btn-success btn-sm">
                                {{ $coupon->campaign_title ?: 'Kampanyaya Git' }}
                            </a>
                        @endif
                    </div>
                </div>
            </div>
        </div>
        @empty
        <div class="col-12">
            <div class="text-center py-5">
                <i class="bi bi-ticket-perforated display-1 text-muted mb-3"></i>
                <h3 class="text-muted">Bu kategoride henüz kupon bulunmuyor</h3>
                <p class="text-muted">Yakında yeni kuponlar eklenecek!</p>
                <a href="{{ route('categories.index') }}" class="btn btn-primary">Diğer Kategorileri Gör</a>
            </div>
        </div>
        @endforelse
    </div>

    <!-- Pagination -->
    @if($couponCodes->hasPages())
    <div class="row mt-5">
        <div class="col-12 d-flex justify-content-center">
            {{ $couponCodes->links() }}
        </div>
    </div>
    @endif
</div>
@endsection

@push('styles')
<style>
    .category-header {
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
        min-height: 300px;
    }
    
    .category-bg-image {
        background-image: url('{{ $category->image ? asset('storage/' . $category->image) : '' }}');
        background-size: cover;
        background-position: center;
        opacity: 0.3;
    }
    
    .category-overlay {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%);
    }
    
    .z-1 {
        z-index: 1;
    }
    
    .coupon-card {
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .hover-float:hover {
        transform: translateY(-5px);
    }
    
    .hover-scale {
        transition: all 0.3s ease;
    }
    
    .hover-scale:hover {
        transform: scale(1.02);
    }
</style>
@endpush

@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        var clipboard = new ClipboardJS('.copy-btn');
        
        clipboard.on('success', function(e) {
            const originalHtml = e.trigger.innerHTML;
            e.trigger.innerHTML = '<i class="bi bi-check"></i>';
            e.trigger.classList.remove('btn-primary');
            e.trigger.classList.add('btn-success');
            
            setTimeout(function() {
                e.trigger.innerHTML = originalHtml;
                e.trigger.classList.remove('btn-success');
                e.trigger.classList.add('btn-primary');
            }, 2000);
            
            e.clearSelection();
        });
    });
</script>
@endpush
