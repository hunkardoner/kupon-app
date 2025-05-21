@extends('frontend.layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-12">
            <div class="jumbotron text-center">
                <h1 class="display-4">Welcome to {{ config('app.name', 'KuponSal') }}!</h1>
                <p class="lead">Your one-stop shop for the best deals and coupons.</p>
                <hr class="my-4">
                <p>Explore our categories and find amazing discounts from your favorite brands.</p>
                <a class="btn btn-primary btn-lg" href="#" role="button">Browse Coupons</a>
            </div>
        </div>
    </div>

    {{-- Featured Sliders --}}
    @if(isset($sliders) && $sliders->count() > 0)
    <div class="row mt-5">
        <div class="col-md-12">
            <h2>Featured Deals</h2>
            <div id="sliderControls" class="carousel slide" data-bs-ride="carousel">
                <div class="carousel-inner">
                    @foreach($sliders as $key => $slider)
                        <div class="carousel-item {{ $key == 0 ? 'active' : '' }}">
                            <img src="{{ $slider->image ? asset('storage/' . $slider->image) : 'https://via.placeholder.com/1200x400?text=Slider+Image' }}" class="d-block w-100" alt="{{ $slider->title }}" style="max-height: 400px; object-fit: cover;">
                            <div class="carousel-caption d-none d-md-block">
                                <h5><a href="{{ $slider->link }}" class="text-white text-decoration-none">{{ $slider->title }}</a></h5>
                            </div>
                        </div>
                    @endforeach
                </div>
                <button class="carousel-control-prev" type="button" data-bs-target="#sliderControls" data-bs-slide="prev">
                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Previous</span>
                </button>
                <button class="carousel-control-next" type="button" data-bs-target="#sliderControls" data-bs-slide="next">
                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                    <span class="visually-hidden">Next</span>
                </button>
            </div>
        </div>
    </div>
    @endif

    {{-- Featured Categories --}}
    @if(isset($categories) && $categories->count() > 0)
    <div class="row mt-5">
        <div class="col-md-12">
            <h2>Popular Categories</h2>
        </div>
        @foreach($categories->take(8) as $category) {{-- Show up to 8 categories --}}
        <div class="col-md-3 mb-4">
            <div class="card">
                <a href="#"> {{-- Replace with actual category link --}}
                    <img src="{{ $category->image ? asset('storage/' . $category->image) : 'https://via.placeholder.com/300x200?text=Category+Image' }}" class="card-img-top" alt="{{ $category->name }}" style="height: 200px; object-fit: cover;">
                </a>
                <div class="card-body text-center">
                    <h5 class="card-title"><a href="#" class="text-dark text-decoration-none">{{ $category->name }}</a></h5>
                </div>
            </div>
        </div>
        @endforeach
    </div>
    @endif

    {{-- Latest Coupon Codes --}}
    @if(isset($couponCodes) && $couponCodes->count() > 0)
    <div class="row mt-5">
        <div class="col-md-12">
            <h2>Latest Coupons</h2>
        </div>
        @foreach($couponCodes->take(10) as $coupon) {{-- Show up to 10 coupons --}}
        <div class="col-md-6 mb-4">
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">{{ $coupon->code }} - {{ $coupon->brand ? $coupon->brand->name : 'Generic' }}</h5>
                    <p class="card-text">{{ Str::limit($coupon->description, 100) }}</p>
                    <p class="card-text">
                        <small class="text-muted">
                            Valid until: {{ $coupon->end_date ? $coupon->end_date->format('M d, Y') : 'N/A' }}
                        </small>
                    </p>
                    <a href="#" class="btn btn-primary">Get Coupon</a> {{-- Replace with actual coupon link/modal --}}
                </div>
            </div>
        </div>
        @endforeach
    </div>
    @endif

</div>
@endsection
