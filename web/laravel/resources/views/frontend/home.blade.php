@extends('frontend.layouts.app')

@section('content')
<div class="container-fluid px-0">
    <!-- Hero Section with Gradient Background -->
    <div class="hero-section position-relative overflow-hidden text-center bg-gradient-primary text-white py-5">
        <div class="container py-5">
            <h1 class="display-4 fw-bold animate__animated animate__fadeInDown">{{ config('app.name', 'KuponSal') }}</h1>
            <p class="lead mb-4 animate__animated animate__fadeInUp animate__delay-1s">Özel fırsatlar ve indirimlerle büyük tasarruf edin</p>
            <div class="search-container col-md-8 col-lg-6 mx-auto animate__animated animate__fadeIn animate__delay-2s">
                <div class="input-group mb-4">
                    <input type="text" class="form-control form-control-lg shadow-sm" placeholder="Markalar, kategoriler veya kupon kodları için arama yapın...">
                    <button class="btn btn-primary px-4" type="button">
                        <i class="bi bi-search"></i> Ara
                    </button>
                </div>
            </div>
            <div class="mt-3 animate__animated animate__bounceIn animate__delay-3s">
                <a href="#featured-coupons" class="btn btn-outline-light btn-lg px-4 shadow-sm">Fırsatları Keşfet</a>
            </div>
        </div>
        <div class="custom-shape-divider-bottom">
            <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
            </svg>
        </div>
    </div>

    <!-- Popular Categories -->
    <div class="container py-5">
        <div class="row mb-4">
            <div class="col-md-8">
                <h2 class="fw-bold with-line">Popüler Kategoriler</h2>
            </div>
            <div class="col-md-4 text-md-end">
                <a href="{{ route('categories.index') }}" class="btn btn-outline-primary rounded-pill">Tüm Kategorileri Gör</a>
            </div>
        </div>
        
        <div class="row g-4">
            @if(isset($categories) && $categories->count() > 0)
                @foreach($categories->take(8) as $category)
                <div class="col-6 col-md-3">
                    <a href="{{ route('categories.show', $category->slug) }}" class="text-decoration-none">
                        <div class="card category-card h-100 border-0 shadow-sm hover-scale">
                            <div class="card-img-wrapper">
                                <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/300x200?text=Category+Image' }}" 
                                    class="card-img-top" alt="{{ $category->name }}" loading="lazy">
                                <div class="card-img-overlay d-flex align-items-end">
                                    <h5 class="card-title text-white m-0 p-3 w-100 category-label">{{ $category->name }}</h5>
                                </div>
                            </div>
                        </div>
                    </a>
                </div>
                @endforeach
            @else
                <div class="col-12 text-center py-5">
                    <p>Kategori bulunamadı. Daha sonra tekrar kontrol edin!</p>
                </div>
            @endif
        </div>
    </div>

    <!-- Featured Deals Carousel -->
    @if(isset($sliders) && $sliders->count() > 0)
    <div class="bg-light py-5">
        <div class="container">
            <h2 class="fw-bold with-line mb-4">Öne Çıkan Fırsatlar</h2>
            <div id="featuredDealsCarousel" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    @foreach($sliders as $key => $slider)
                    <div class="carousel-item {{ $key == 0 ? 'active' : '' }}">
                        <div class="card border-0 shadow featured-deal-card">
                            <div class="row g-0">
                                <div class="col-md-6">
                                    <img src="{{ $slider->image ? asset('storage/' . $slider->image) : 'https://via.placeholder.com/600x400?text=Featured+Deal' }}" 
                                        class="img-fluid rounded-start featured-image" alt="{{ $slider->title }}" loading="lazy">
                                </div>
                                <div class="col-md-6">
                                    <div class="card-body d-flex flex-column justify-content-center h-100 p-md-5">
                                        <div class="deal-badge mb-3">FIRSATI KAÇIRMA</div>
                                        <h3 class="card-title fw-bold">{{ $slider->title }}</h3>
                                        <p class="card-text">{{ Str::limit($slider->description ?? 'Bu özel teklifle harika indirimler yakalayın.', 120) }}</p>
                                        <a href="{{ $slider->link ?? '#' }}" class="btn btn-primary mt-3">Fırsatı Yakala</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    @endforeach
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#featuredDealsCarousel" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon rounded-circle" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#featuredDealsCarousel" data-bs-slide="next">
                    <span class="carousel-control-next-icon rounded-circle" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
    @endif

    <!-- Latest Coupons -->
    <div id="featured-coupons" class="container py-5">
        <div class="row mb-4">
            <div class="col-md-8">
                <h2 class="fw-bold with-line">En Yeni Kuponlar</h2>
            </div>
            <div class="col-md-4 text-md-end">
                <a href="{{ route('coupons.index') }}" class="btn btn-outline-primary rounded-pill">Tüm Kuponları Gör</a>
            </div>
        </div>

        <div class="row g-4">
            @if(isset($couponCodes) && $couponCodes->count() > 0)
                @foreach($couponCodes->take(6) as $coupon)
                <div class="col-md-6 col-lg-4">
                    <div class="card coupon-card h-100 border-0 shadow-sm hover-float">
                        <div class="card-header border-0 bg-white pt-4 px-4">
                            <div class="d-flex align-items-center">
                                <div class="brand-logo me-3">
                                    @if($coupon->brand && isset($coupon->brand->logo))
                                        <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" class="img-fluid rounded-circle">
                                    @else
                                        <div class="brand-placeholder rounded-circle d-flex align-items-center justify-content-center">
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
                        </div>
                        <div class="card-footer border-0 bg-white px-4 pb-4">
                            <div class="coupon-code-container d-flex align-items-center">
                                <div class="coupon-code flex-grow-1 text-center py-2 me-2">{{ $coupon->code }}</div>
                                <button class="btn btn-primary copy-btn" data-clipboard-text="{{ $coupon->code }}">
                                    Kopyala
                                </button>
                            </div>
                            <div class="mt-3">
                                <a href="{{ route('coupons.show', $coupon->id) }}" class="btn btn-outline-secondary btn-sm me-2">Detaylar</a>
                                @if($coupon->campaign_url)
                                    <a href="{{ $coupon->campaign_url }}" target="_blank" class="btn btn-success btn-sm">
                                        {{ $coupon->campaign_title ?: 'Kampanyaya Git' }}
                                    </a>
                                @endif
                            </div>
                        </div>
                    </div>
                </div>
                @endforeach
            @else
                <div class="col-12 text-center py-5">
                    <p>Şu anda kupon kodu bulunmuyor. Daha sonra tekrar kontrol edin!</p>
                </div>
            @endif
        </div>
    </div>

    <!-- How It Works -->
    <div class="bg-light py-5">
        <div class="container">
            <h2 class="fw-bold text-center mb-5">Nasıl Çalışır</h2>
            <div class="row g-4">
                <div class="col-md-4 text-center">
                    <div class="how-it-works-card p-4">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-search display-4"></i>
                        </div>
                        <h4>1. Kupon Bul</h4>
                        <p class="text-muted">Geniş doğrulanmış kupon kodları ve fırsatlar koleksiyonumuza göz atın.</p>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div class="how-it-works-card p-4">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-clipboard-check display-4"></i>
                        </div>
                        <h4>2. Kodu Kopyala</h4>
                        <p class="text-muted">Kodu görmek ve tek tıklamayla kopyalamak için kupona tıklayın.</p>
                    </div>
                </div>
                <div class="col-md-4 text-center">
                    <div class="how-it-works-card p-4">
                        <div class="icon-wrapper mb-3">
                            <i class="bi bi-bag-check display-4"></i>
                        </div>
                        <h4>3. Alışveriş Yap & Tasarruf Et</h4>
                        <p class="text-muted">Kodu ödeme sırasında yapıştırın ve anında tasarrufun keyfini çıkarın.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    <!-- Newsletter -->
    <div class="container py-5">
        <div class="card border-0 shadow-sm rounded-4 p-4 p-md-5">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h3 class="fw-bold">Fırsatları Kaçırmayın</h3>
                    <p class="mb-0">Bültenimize abone olun ve en yeni kuponları ve fırsatları doğrudan gelen kutunuza alın.</p>
                </div>
                <div class="col-lg-6">
                    <form class="row g-3">
                        <div class="col-12 col-sm-8">
                            <input type="email" class="form-control form-control-lg" placeholder="E-posta adresiniz" required>
                        </div>
                        <div class="col-12 col-sm-4">
                            <button type="submit" class="btn btn-primary btn-lg w-100">Abone Ol</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection

@push('styles')
<style>
    /* Bootstrap Icons */
    @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css");
    /* Animate.css */
    @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css");
    
    /* Custom Styles */
    body {
        font-family: 'Nunito', sans-serif;
        color: #333;
    }
    
    /* Hero Section */
    .bg-gradient-primary {
        background: linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%);
    }
    
    .custom-shape-divider-bottom {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        overflow: hidden;
        line-height: 0;
    }
    
    .custom-shape-divider-bottom svg {
        position: relative;
        display: block;
        width: calc(100% + 1.3px);
        height: 70px;
    }
    
    .custom-shape-divider-bottom .shape-fill {
        fill: #FFFFFF;
    }
    
    /* Section Headings */
    h2.with-line {
        position: relative;
        padding-bottom: 15px;
    }
    
    h2.with-line::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: 0;
        width: 50px;
        height: 3px;
        background-color: #6366F1;
    }
    
    /* Category Cards */
    .category-card {
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s ease;
    }
    
    .card-img-wrapper {
        position: relative;
        height: 180px;
        overflow: hidden;
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
        background: linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
        border-radius: 0 0 12px 12px;
    }
    
    /* Featured Deal Card */
    .featured-deal-card {
        border-radius: 12px;
        overflow: hidden;
    }
    
    .featured-image {
        height: 100%;
        object-fit: cover;
    }
    
    .deal-badge {
        display: inline-block;
        background-color: #FF6B6B;
        color: white;
        padding: 5px 15px;
        border-radius: 50px;
        font-weight: bold;
        font-size: 0.8rem;
    }
    
    /* Coupon Cards */
    .coupon-card {
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .hover-float:hover {
        transform: translateY(-5px);
    }
    
    .hover-scale:hover {
        transform: scale(1.03);
    }
    
    .brand-logo img {
        width: 40px;
        height: 40px;
        object-fit: cover;
    }
    
    .brand-placeholder {
        width: 40px;
        height: 40px;
        background-color: #6366F1;
        color: white;
        font-weight: bold;
    }
    
    .coupon-code-container {
        background-color: #F3F4F6;
        border-radius: 8px;
        overflow: hidden;
    }
    
    .coupon-code {
        font-family: monospace;
        font-weight: bold;
        letter-spacing: 1px;
        font-size: 1.1rem;
        background-color: #F3F4F6;
    }
    
    .copy-btn {
        border-radius: 0 8px 8px 0;
    }
    
    /* How It Works */
    .how-it-works-card {
        background-color: white;
        border-radius: 12px;
        transition: all 0.3s ease;
    }
    
    .how-it-works-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    
    .icon-wrapper {
        color: #6366F1;
    }
    
    /* Newsletter */
    .rounded-4 {
        border-radius: 1rem;
    }
    
    /* Responsive Adjustments */
    @media (max-width: 767.98px) {
        .custom-shape-divider-bottom svg {
            height: 40px;
        }
        
        .card-img-wrapper {
            height: 140px;
        }
    }
</style>
@endpush

@push('scripts')
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.8/clipboard.min.js"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize Clipboard.js for coupon code copying
        var clipboard = new ClipboardJS('.copy-btn');
        
        clipboard.on('success', function(e) {
            const originalText = e.trigger.innerText;
            e.trigger.innerText = 'Copied!';
            e.trigger.classList.remove('btn-primary');
            e.trigger.classList.add('btn-success');
            
            setTimeout(function() {
                e.trigger.innerText = originalText;
                e.trigger.classList.remove('btn-success');
                e.trigger.classList.add('btn-primary');
            }, 2000);
            
            e.clearSelection();
        });
    });
</script>
@endpush
