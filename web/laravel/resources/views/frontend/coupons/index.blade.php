@extends('frontend.layouts.app')

@section('title', 'Tüm Kuponlar ve İndirim Kodları')

@section('content')
<div class="container mt-4">
    <!-- Breadcrumb -->
    <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item"><a href="{{ route('home') }}">Ana Sayfa</a></li>
            <li class="breadcrumb-item active" aria-current="page">Kuponlar</li>
        </ol>
    </nav>

    <!-- Page Header -->
    <div class="row mb-4">
        <div class="col-md-12">
            <h1 class="mb-2">Tüm Kuponlar ve İndirim Kodları</h1>
            <p class="text-muted">En güncel indirim kuponları ve promosyon kodları burada!</p>
        </div>
    </div>

    <!-- Filters -->
    <div class="row mb-4">
        <div class="col-md-12">
            <div class="card">
                <div class="card-body">
                    <form method="GET" action="{{ route('coupons.index') }}">
                        <div class="row g-3">
                            <div class="col-md-4">
                                <label for="search" class="form-label">Ara</label>
                                <input type="text" class="form-control" id="search" name="search" 
                                       value="{{ request('search') }}" placeholder="Kupon kodu, marka veya açıklama...">
                            </div>
                            <div class="col-md-3">
                                <label for="category" class="form-label">Kategori</label>
                                <select class="form-select" id="category" name="category">
                                    <option value="">Tüm Kategoriler</option>
                                    @foreach($categories as $category)
                                        <option value="{{ $category->slug }}" 
                                                {{ request('category') == $category->slug ? 'selected' : '' }}>
                                            {{ $category->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-3">
                                <label for="brand" class="form-label">Marka</label>
                                <select class="form-select" id="brand" name="brand">
                                    <option value="">Tüm Markalar</option>
                                    @foreach($brands as $brand)
                                        <option value="{{ $brand->slug }}" 
                                                {{ request('brand') == $brand->slug ? 'selected' : '' }}>
                                            {{ $brand->name }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            <div class="col-md-2 d-flex align-items-end">
                                <button type="submit" class="btn btn-primary w-100">
                                    <i class="fas fa-search"></i> Filtrele
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Results Info -->
    <div class="row mb-3">
        <div class="col-md-6">
            <p class="mb-0">
                <strong>{{ $couponCodes->total() }}</strong> kupon bulundu
                @if(request('search'))
                    "<strong>{{ request('search') }}</strong>" araması için
                @endif
            </p>
        </div>
        <div class="col-md-6 text-end">
            @if(request()->hasAny(['search', 'category', 'brand']))
                <a href="{{ route('coupons.index') }}" class="btn btn-outline-secondary btn-sm">
                    <i class="fas fa-times"></i> Filtreleri Temizle
                </a>
            @endif
        </div>
    </div>

    <!-- Coupons Grid -->
    @if($couponCodes->count() > 0)
        <div class="row">
            @foreach($couponCodes as $coupon)
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="card h-100 coupon-card">
                        <div class="card-header bg-white">
                            <div class="d-flex justify-content-between align-items-center">
                                @if($coupon->brand)
                                    <div class="d-flex align-items-center">
                                        @if($coupon->brand->logo)
                                            <img src="{{ $coupon->brand->logo_url }}" alt="{{ $coupon->brand->name }}" 
                                                 class="brand-logo me-2" style="max-height: 30px;">
                                        @endif
                                        <strong>{{ $coupon->brand->name }}</strong>
                                    </div>
                                @endif
                                @if($coupon->discount_percentage)
                                    <span class="badge bg-danger">%{{ $coupon->discount_percentage }} İndirim</span>
                                @endif
                            </div>
                        </div>
                        <div class="card-body">
                            <h5 class="card-title">{{ $coupon->title }}</h5>
                            <p class="card-text text-muted">{{ Str::limit($coupon->description, 100) }}</p>

                            @if($coupon->code)
                                <div class="coupon-code-section mb-3">
                                    <div class="input-group">
                                        <input type="text" class="form-control text-center fw-bold" 
                                               value="{{ $coupon->code }}" readonly>
                                        <button class="btn btn-outline-primary copy-code-btn" type="button" 
                                                data-code="{{ $coupon->code }}">
                                            <i class="fas fa-copy"></i>
                                        </button>
                                    </div>
                                </div>
                            @endif

                            @if($coupon->categories->count() > 0)
                                <div class="mb-3">
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
                        <div class="card-footer bg-transparent">
                            <div class="row g-2">
                                <div class="col-6">
                                    <a href="{{ route('coupons.show', $coupon->id) }}" class="btn btn-outline-primary w-100 btn-sm">
                                        <i class="fas fa-info-circle"></i> Detay
                                    </a>
                                </div>
                                <div class="col-6">
                                    @if($coupon->link)
                                        <a href="{{ $coupon->link }}" target="_blank" class="btn btn-primary w-100 btn-sm">
                                            <i class="fas fa-external-link-alt"></i> Kullan
                                        </a>
                                    @else
                                        <button class="btn btn-success w-100 btn-sm" disabled>
                                            Kod Kopyala
                                        </button>
                                    @endif
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="d-flex justify-content-center mt-4">
            {{ $couponCodes->appends(request()->query())->links() }}
        </div>
    @else
        <div class="text-center py-5">
            <div class="mb-3">
                <i class="fas fa-search fa-3x text-muted"></i>
            </div>
            <h4 class="text-muted">Aradığınız kriterlere uygun kupon bulunamadı</h4>
            <p class="text-muted">Filtreleri değiştirerek tekrar deneyebilirsiniz.</p>
            <a href="{{ route('coupons.index') }}" class="btn btn-primary">
                Tüm Kuponları Görüntüle
            </a>
        </div>
    @endif
</div>

<style>
.coupon-card {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    border: 1px solid #e3e6f0;
}

.coupon-card:hover {
    transform: translateY(-3px);
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
    max-height: 30px;
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

    // Auto-submit form on select change
    document.querySelectorAll('#category, #brand').forEach(function(select) {
        select.addEventListener('change', function() {
            this.form.submit();
        });
    });
});
</script>
@endsection
