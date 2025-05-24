@extends('frontend.layouts.app')

@section('title', '"' . $query . '" Arama Sonuçları')

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item active" aria-current="page">Arama Sonuçları</li>
        </ol>
    </nav>

    <!-- Search Header -->
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="mb-2">"{{ $query }}" için Arama Sonuçları</h1>
            <p class="text-muted">{{ $totalResults }} sonuç bulundu</p>
        </div>
    </div>

    <!-- Search Again -->
    <div class="row mb-4">
        <div class="col-md-8">
            <form method="GET" action="{{ route('search') }}" class="d-flex">
                <input type="text" class="form-control" name="q" value="{{ $query }}" 
                       placeholder="Kupon, marka veya kategori ara...">
                <button class="btn btn-primary ms-2" type="submit">
                    <i class="fas fa-search"></i> Ara
                </button>
            </form>
        </div>
    </div>

    @if($totalResults > 0)
        <!-- Coupons Section -->
        @if($coupons->count() > 0)
            <div class="row mb-5">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3><i class="fas fa-ticket-alt text-primary"></i> Kuponlar ({{ $coupons->count() }})</h3>
                        <a href="{{ route('coupons.index', ['search' => $query]) }}" class="btn btn-outline-primary btn-sm">
                            Tümünü Gör
                        </a>
                    </div>
                    <div class="row">
                        @foreach($coupons as $coupon)
                            <div class="col-md-6 col-lg-4 mb-3">
                                <div class="card h-100 coupon-card">
                                    <div class="card-header bg-white">
                                        <div class="d-flex justify-content-between align-items-center">
                                            @if($coupon->brand)
                                                <div class="d-flex align-items-center">
                                                    @if($coupon->brand->logo)
                                                        <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" 
                                                             class="brand-logo me-2" style="max-height: 25px;">
                                                    @endif
                                                    <small><strong>{{ $coupon->brand->name }}</strong></small>
                                                </div>
                                            @endif
                                            @if($coupon->discount_percentage)
                                                <span class="badge bg-danger">%{{ $coupon->discount_percentage }}</span>
                                            @endif
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <h6 class="card-title">{{ $coupon->title }}</h6>
                                        <p class="card-text text-muted small">{{ Str::limit($coupon->description, 80) }}</p>
                                        @if($coupon->code)
                                            <code class="small">{{ $coupon->code }}</code>
                                        @endif
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <a href="{{ route('coupons.show', $coupon->id) }}" class="btn btn-primary w-100 btn-sm">
                                            Detayları Gör
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif

        <!-- Brands Section -->
        @if($brands->count() > 0)
            <div class="row mb-5">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3><i class="fas fa-store text-success"></i> Markalar ({{ $brands->count() }})</h3>
                        <a href="{{ route('brands.index') }}?search={{ $query }}" class="btn btn-outline-success btn-sm">
                            Tümünü Gör
                        </a>
                    </div>
                    <div class="row">
                        @foreach($brands as $brand)
                            <div class="col-md-6 col-lg-3 mb-3">
                                <div class="card h-100 brand-card">
                                    <div class="card-body text-center">
                                        @if($brand->logo)
                                            <img src="{{ $brand->logo_url }}" alt="{{ $brand->name }}" 
                                                 class="img-fluid mb-3" style="max-height: 60px;">
                                        @else
                                            <div class="bg-light rounded d-flex align-items-center justify-content-center mb-3 mx-auto" 
                                                 style="width: 60px; height: 60px;">
                                                <i class="fas fa-store fa-2x text-muted"></i>
                                            </div>
                                        @endif
                                        <h6 class="card-title">{{ $brand->name }}</h6>
                                        <p class="card-text text-muted small">{{ Str::limit($brand->description, 60) }}</p>
                                        <span class="badge bg-light text-dark">{{ $brand->coupon_codes_count ?? 0 }} kupon</span>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <a href="{{ route('brands.show', $brand->slug) }}" class="btn btn-success w-100 btn-sm">
                                            Kuponları Gör
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif

        <!-- Categories Section -->
        @if($categories->count() > 0)
            <div class="row mb-5">
                <div class="col-md-12">
                    <div class="d-flex justify-content-between align-items-center mb-3">
                        <h3><i class="fas fa-tags text-info"></i> Kategoriler ({{ $categories->count() }})</h3>
                        <a href="{{ route('categories.index') }}" class="btn btn-outline-info btn-sm">
                            Tümünü Gör
                        </a>
                    </div>
                    <div class="row">
                        @foreach($categories as $category)
                            <div class="col-md-6 col-lg-3 mb-3">
                                <div class="card h-100 category-card">
                                    <div class="card-body text-center">
                                        <div class="category-icon mb-3">
                                            <i class="fas fa-tags fa-2x text-info"></i>
                                        </div>
                                        <h6 class="card-title">{{ $category->name }}</h6>
                                        <p class="card-text text-muted small">{{ Str::limit($category->description, 60) }}</p>
                                        <span class="badge bg-light text-dark">{{ $category->coupon_codes_count ?? 0 }} kupon</span>
                                    </div>
                                    <div class="card-footer bg-transparent">
                                        <a href="{{ route('categories.show', $category->slug) }}" class="btn btn-info w-100 btn-sm">
                                            Kuponları Gör
                                        </a>
                                    </div>
                                </div>
                            </div>
                        @endforeach
                    </div>
                </div>
            </div>
        @endif
    @else
        <!-- No Results -->
        <div class="text-center py-5">
            <div class="mb-4">
                <i class="fas fa-search fa-4x text-muted"></i>
            </div>
            <h3 class="text-muted mb-3">"{{ $query }}" için sonuç bulunamadı</h3>
            <p class="text-muted mb-4">Aradığınız terime uygun kupon, marka veya kategori bulunamadı.</p>
            
            <div class="row justify-content-center">
                <div class="col-md-6">
                    <div class="card bg-light">
                        <div class="card-body">
                            <h6 class="card-title">Arama önerilerimiz:</h6>
                            <ul class="list-unstyled mb-0 text-start">
                                <li><i class="fas fa-check text-success"></i> Daha genel terimler kullanın</li>
                                <li><i class="fas fa-check text-success"></i> Yazım hatası olup olmadığını kontrol edin</li>
                                <li><i class="fas fa-check text-success"></i> Farklı kelimeler deneyin</li>
                                <li><i class="fas fa-check text-success"></i> Marka adlarını tam olarak yazın</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mt-4">
                <a href="{{ route('coupons.index') }}" class="btn btn-primary me-2">
                    <i class="fas fa-ticket-alt"></i> Tüm Kuponlar
                </a>
                <a href="{{ route('brands.index') }}" class="btn btn-success me-2">
                    <i class="fas fa-store"></i> Tüm Markalar
                </a>
                <a href="{{ route('categories.index') }}" class="btn btn-info">
                    <i class="fas fa-tags"></i> Tüm Kategoriler
                </a>
            </div>
        </div>
    @endif
</div>

<style>
.coupon-card, .brand-card, .category-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e3e6f0;
}

.coupon-card:hover, .brand-card:hover, .category-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.brand-logo {
    max-height: 25px;
    width: auto;
}

.category-icon {
    opacity: 0.8;
}
</style>
@endsection
