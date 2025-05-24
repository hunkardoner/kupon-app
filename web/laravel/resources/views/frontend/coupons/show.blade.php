@extends('frontend.layouts.app')

@section('title', $coupon->title . ' - ' . ($coupon->brand ? $coupon->brand->name : 'Kupon Detayı'))

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item"><a href="{{ route('coupons.index') }}">Kuponlar</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ Str::limit($coupon->title, 30) }}</li>
        </ol>
    </nav>

    <!-- Coupon Detail -->
    <div class="row mb-4">
        <div class="col-md-8">
            <div class="card shadow-sm">
                <div class="card-header bg-primary text-white">
                    <div class="row align-items-center">
                        <div class="col-md-8">
                            @if($coupon->brand)
                                <div class="d-flex align-items-center">
                                    @if($coupon->brand->logo)
                                        <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" 
                                             class="brand-logo me-3" style="max-height: 40px; background: white; padding: 5px; border-radius: 5px;">
                                    @endif
                                    <div>
                                        <h5 class="mb-0">{{ $coupon->brand->name }}</h5>
                                        <small class="opacity-75">İndirim Kuponu</small>
                                    </div>
                                </div>
                            @else
                                <h5 class="mb-0">İndirim Kuponu</h5>
                            @endif
                        </div>
                        <div class="col-md-4 text-end">
                            @if($coupon->discount_percentage)
                                <span class="badge bg-warning text-dark fs-6">%{{ $coupon->discount_percentage }} İndirim</span>
                            @endif
                        </div>
                    </div>
                </div>
                <div class="card-body">
                    <h2 class="card-title mb-3">{{ $coupon->title }}</h2>
                    
                    @if($coupon->description)
                        <div class="mb-4">
                            <h6 class="text-muted">Açıklama</h6>
                            <p class="text-dark">{{ $coupon->description }}</p>
                        </div>
                    @endif

                    @if($coupon->code)
                        <div class="mb-4">
                            <h6 class="text-muted">Kupon Kodu</h6>
                            <div class="coupon-code-section">
                                <div class="input-group input-group-lg">
                                    <input type="text" class="form-control text-center fw-bold fs-4" 
                                           value="{{ $coupon->code }}" readonly id="couponCode">
                                    <button class="btn btn-primary copy-code-btn" type="button" 
                                            data-code="{{ $coupon->code }}">
                                        <i class="fas fa-copy"></i> Kopyala
                                    </button>
                                </div>
                            </div>
                        </div>
                    @endif

                    @if($coupon->terms_and_conditions)
                        <div class="mb-4">
                            <h6 class="text-muted">Kullanım Şartları</h6>
                            <div class="alert alert-light">
                                <small>{{ $coupon->terms_and_conditions }}</small>
                            </div>
                        </div>
                    @endif

                    <div class="row mb-4">
                        <div class="col-md-6">
                            <h6 class="text-muted">Kupon Bilgileri</h6>
                            <ul class="list-unstyled">
                                @if($coupon->end_date)
                                    <li><i class="fas fa-calendar-alt text-primary"></i> Bitiş: {{ $coupon->end_date->format('d.m.Y H:i') }}</li>
                                @else
                                    <li><i class="fas fa-infinity text-success"></i> Süresiz geçerli</li>
                                @endif
                                <li><i class="fas fa-eye text-primary"></i> {{ $coupon->usage_count ?? 0 }} kez kullanıldı</li>
                                @if($coupon->usage_limit)
                                    <li><i class="fas fa-users text-primary"></i> Maksimum {{ $coupon->usage_limit }} kullanım</li>
                                @endif
                            </ul>
                        </div>
                        @if($coupon->categories->count() > 0)
                            <div class="col-md-6">
                                <h6 class="text-muted">Kategoriler</h6>
                                <div>
                                    @foreach($coupon->categories as $category)
                                        <a href="{{ route('categories.show', $category->slug) }}" 
                                           class="badge bg-light text-dark text-decoration-none me-1 mb-1">
                                            {{ $category->name }}
                                        </a>
                                    @endforeach
                                </div>
                            </div>
                        @endif
                    </div>

                    @if($coupon->link)
                        <div class="text-center">
                            <a href="{{ $coupon->link }}" target="_blank" class="btn btn-success btn-lg">
                                <i class="fas fa-external-link-alt"></i> Kuponu Kullanmak İçin Tıklayın
                            </a>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <!-- Sidebar -->
        <div class="col-md-4">
            <!-- Share -->
            <div class="card mb-4">
                <div class="card-header">
                    <h6 class="mb-0"><i class="fas fa-share-alt"></i> Paylaş</h6>
                </div>
                <div class="card-body">
                    <div class="row g-2">
                        <div class="col-6">
                            <a href="https://www.facebook.com/sharer/sharer.php?u={{ urlencode(request()->fullUrl()) }}" 
                               target="_blank" class="btn btn-outline-primary w-100 btn-sm">
                                <i class="fab fa-facebook-f"></i> Facebook
                            </a>
                        </div>
                        <div class="col-6">
                            <a href="https://twitter.com/intent/tweet?text={{ urlencode($coupon->title) }}&url={{ urlencode(request()->fullUrl()) }}" 
                               target="_blank" class="btn btn-outline-info w-100 btn-sm">
                                <i class="fab fa-twitter"></i> Twitter
                            </a>
                        </div>
                        <div class="col-6">
                            <a href="https://wa.me/?text={{ urlencode($coupon->title . ' - ' . request()->fullUrl()) }}" 
                               target="_blank" class="btn btn-outline-success w-100 btn-sm">
                                <i class="fab fa-whatsapp"></i> WhatsApp
                            </a>
                        </div>
                        <div class="col-6">
                            <button class="btn btn-outline-secondary w-100 btn-sm copy-link-btn" 
                                    data-url="{{ request()->fullUrl() }}">
                                <i class="fas fa-link"></i> Link
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Brand Info -->
            @if($coupon->brand)
                <div class="card mb-4">
                    <div class="card-header">
                        <h6 class="mb-0"><i class="fas fa-store"></i> Marka Bilgisi</h6>
                    </div>
                    <div class="card-body text-center">
                        @if($coupon->brand->logo)
                            <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" 
                                 class="img-fluid mb-3" style="max-height: 80px;">
                        @endif
                        <h6>{{ $coupon->brand->name }}</h6>
                        @if($coupon->brand->description)
                            <p class="text-muted small">{{ Str::limit($coupon->brand->description, 100) }}</p>
                        @endif
                        <div class="d-grid gap-2">
                            <a href="{{ route('brands.show', $coupon->brand->slug) }}" class="btn btn-outline-primary btn-sm">
                                Tüm Kuponları Görüntüle
                            </a>
                            @if($coupon->brand->website)
                                <a href="{{ $coupon->brand->website }}" target="_blank" class="btn btn-outline-secondary btn-sm">
                                    <i class="fas fa-external-link-alt"></i> Web Sitesi
                                </a>
                            @endif
                        </div>
                    </div>
                </div>
            @endif
        </div>
    </div>

    <!-- Related Coupons -->
    @if($relatedCoupons->count() > 0)
        <div class="row">
            <div class="col-md-12">
                <h3 class="mb-4">Benzer Kuponlar</h3>
                <div class="row">
                    @foreach($relatedCoupons as $related)
                        <div class="col-md-6 col-lg-3 mb-4">
                            <div class="card h-100 coupon-card">
                                <div class="card-body">
                                    @if($related->brand)
                                        <div class="d-flex align-items-center mb-2">
                                            @if($related->brand->logo)
                                                <img src="{{ $related->brand->logo_url }}" alt="{{ $related->brand->name }}" 
                                                     class="brand-logo me-2" style="max-height: 25px;">
                                            @endif
                                            <small class="text-muted">{{ $related->brand->name }}</small>
                                        </div>
                                    @endif
                                    <h6 class="card-title">{{ Str::limit($related->title, 50) }}</h6>
                                    @if($related->code)
                                        <code class="small">{{ $related->code }}</code>
                                    @endif
                                </div>
                                <div class="card-footer bg-transparent">
                                    <a href="{{ route('coupons.show', $related->id) }}" class="btn btn-outline-primary w-100 btn-sm">
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
</div>

<style>
.coupon-code-section {
    background: #f8f9fc;
    padding: 20px;
    border-radius: 10px;
    border: 3px dashed #007bff;
}

.copy-code-btn:hover {
    background-color: #0056b3;
}

.coupon-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.coupon-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.brand-logo {
    max-height: 40px;
    width: auto;
}
</style>

<script>
document.addEventListener('DOMContentLoaded', function() {
    // Copy code functionality
    document.querySelectorAll('.copy-code-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const code = this.getAttribute('data-code');
            navigator.clipboard.writeText(code).then(function() {
                const originalText = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı!';
                btn.classList.add('btn-success');
                btn.classList.remove('btn-primary');
                
                setTimeout(function() {
                    btn.innerHTML = originalText;
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-primary');
                }, 3000);
            });
        });
    });

    // Copy link functionality
    document.querySelector('.copy-link-btn')?.addEventListener('click', function() {
        const url = this.getAttribute('data-url');
        navigator.clipboard.writeText(url).then(function() {
            const btn = document.querySelector('.copy-link-btn');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Kopyalandı';
            btn.classList.add('btn-success');
            btn.classList.remove('btn-outline-secondary');
            
            setTimeout(function() {
                btn.innerHTML = originalText;
                btn.classList.remove('btn-success');
                btn.classList.add('btn-outline-secondary');
            }, 3000);
        });
    });
});
</script>
@endsection
