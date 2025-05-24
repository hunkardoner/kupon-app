@extends('frontend.layouts.app')

@section('title', $brand->name . ' Kuponları ve İndirim Kodları')

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item"><a href="{{ route('brands.index') }}">Markalar</a></li>
            <li class="breadcrumb-item active" aria-current="page">{{ $brand->name }}</li>
        </ol>
    </nav>

    <!-- Brand Header -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card shadow-sm">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2 text-center">
                            @if($brand->logo)
                                <img src="{{ $brand->logo_url }}" alt="{{ $brand->name }}" class="img-fluid rounded" style="max-height: 80px;">
                            @else
                                <div class="bg-light rounded d-flex align-items-center justify-content-center" style="width: 80px; height: 80px; margin: 0 auto;">
                                    <i class="fas fa-store fa-2x text-muted"></i>
                                </div>
                            @endif
                        </div>
                        <div class="col-md-8">
                            <h1 class="mb-2">{{ $brand->name }}</h1>
                            @if($brand->description)
                                <p class="text-muted mb-0">{{ $brand->description }}</p>
                            @endif
                            <div class="mt-2">
                                <span class="badge bg-primary">{{ $couponCodes->total() }} Aktif Kupon</span>
                                @if($brand->website)
                                    <a href="{{ $brand->website }}" target="_blank" class="btn btn-outline-primary btn-sm ms-2">
                                        <i class="fas fa-external-link-alt"></i> Web Sitesi
                                    </a>
                                @endif
                            </div>
                        </div>
                        <div class="col-md-2 text-end">
                            <div class="text-muted small">
                                <i class="fas fa-clock"></i> Son güncelleme<br>
                                {{ $brand->updated_at->format('d.m.Y') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Coupons Section -->
    <div class="row">
        <div class="col-md-12">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h2 class="mb-0">{{ $brand->name }} Kuponları</h2>
                <div class="text-muted">
                    {{ $couponCodes->total() }} kupon bulundu
                </div>
            </div>

            @if($couponCodes->count() > 0)
                <div class="row">
                    @foreach($couponCodes as $coupon)
                        <div class="col-md-6 col-lg-4 mb-4">
                            <div class="card h-100 coupon-card">
                                <div class="card-body">
                                    <div class="d-flex justify-content-between align-items-start mb-3">
                                        <div class="flex-grow-1">
                                            <h5 class="card-title">{{ $coupon->title }}</h5>
                                            <p class="card-text text-muted small">{{ Str::limit($coupon->description, 100) }}</p>
                                        </div>
                                        @if($coupon->discount_percentage)
                                            <span class="badge bg-danger">%{{ $coupon->discount_percentage }} İndirim</span>
                                        @endif
                                    </div>

                                    @if($coupon->code)
                                        <div class="coupon-code-section mb-3">
                                            <div class="input-group">
                                                <input type="text" class="form-control text-center fw-bold" value="{{ $coupon->code }}" readonly>
                                                <button class="btn btn-outline-primary copy-code-btn" type="button" data-code="{{ $coupon->code }}">
                                                    <i class="fas fa-copy"></i>
                                                </button>
                                            </div>
                                        </div>
                                    @endif

                                    <div class="coupon-meta">
                                        @if($coupon->categories->count() > 0)
                                            <div class="mb-2">
                                                @foreach($coupon->categories as $category)
                                                    <span class="badge bg-light text-dark me-1">{{ $category->name }}</span>
                                                @endforeach
                                            </div>
                                        @endif

                                        <div class="row text-center small text-muted">
                                            @if($coupon->end_date)
                                                <div class="col-6">
                                                    <i class="fas fa-calendar-alt"></i>
                                                    {{ $coupon->end_date->format('d.m.Y') }} bitiş
                                                </div>
                                            @endif
                                            <div class="col-6">
                                                <i class="fas fa-eye"></i>
                                                {{ $coupon->usage_count ?? 0 }} kullanım
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="card-footer bg-transparent">
                                    @if($coupon->link)
                                        <a href="{{ $coupon->link }}" target="_blank" class="btn btn-primary w-100">
                                            <i class="fas fa-external-link-alt"></i> Kuponu Kullan
                                        </a>
                                    @else
                                        <button class="btn btn-outline-primary w-100" disabled>
                                            Kupon Kodu: {{ $coupon->code }}
                                        </button>
                                    @endif
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4">
                    {{ $couponCodes->links() }}
                </div>
            @else
                <div class="text-center py-5">
                    <div class="mb-3">
                        <i class="fas fa-ticket-alt fa-3x text-muted"></i>
                    </div>
                    <h4 class="text-muted">Bu marka için aktif kupon bulunmuyor</h4>
                    <p class="text-muted">Yakında yeni kuponlar eklenebilir. Takipte kalın!</p>
                    <a href="{{ route('coupons.index') }}" class="btn btn-primary">
                        Diğer Kuponları İncele
                    </a>
                </div>
            @endif
        </div>
    </div>
</div>

<style>
.coupon-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e3e6f0;
}

.coupon-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
}

.coupon-code-section {
    background: #f8f9fc;
    padding: 10px;
    border-radius: 5px;
    border: 2px dashed #dee2e6;
}

.copy-code-btn:hover {
    background-color: #007bff;
    color: white;
}

.brand-logo {
    max-height: 80px;
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
                const originalIcon = btn.querySelector('i');
                originalIcon.className = 'fas fa-check';
                btn.classList.add('btn-success');
                btn.classList.remove('btn-outline-primary');
                
                setTimeout(function() {
                    originalIcon.className = 'fas fa-copy';
                    btn.classList.remove('btn-success');
                    btn.classList.add('btn-outline-primary');
                }, 2000);
            });
        });
    });
});
</script>
@endsection
