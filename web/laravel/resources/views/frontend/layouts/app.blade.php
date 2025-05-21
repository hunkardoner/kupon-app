<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Laravel') }}</title>
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito" rel="stylesheet">
    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    @stack('styles')
</head>
<body>
    <div id="app">
        <nav class="navbar navbar-expand-md navbar-light bg-white shadow-sm sticky-top">
            <div class="container">
                <a class="navbar-brand d-flex align-items-center" href="{{ url('/') }}">
                    <span class="me-2 text-primary">
                        <i class="bi bi-ticket-perforated-fill"></i>
                    </span>
                    <span class="fw-bold">{{ config('app.name', 'KuponSal') }}</span>
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <!-- Left Side Of Navbar -->
                    <ul class="navbar-nav me-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('frontend.home') }}">Anasayfa</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Kategoriler</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Popüler Markalar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#">Son Fırsatlar</a>
                        </li>
                        {{-- Add more navigation links here --}}
                    </ul>

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <!-- Authentication Links -->
                        @guest
                            @if (Route::has('login'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('login') }}">{{ __('Giriş') }}</a>
                                </li>
                            @endif
                        @else
                            <li class="nav-item dropdown">
                                <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                                    {{ Auth::user()->name }}
                                </a>

                                <div class="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{ route('logout') }}"
                                       onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                                        {{ __('Çıkış') }}
                                    </a>
                                    @if(Auth::user())
                                        <a class="dropdown-item" href="{{ route('admin.dashboard') }}">
                                            Yönetim Paneli
                                        </a>
                                    @endif
                                    <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                                        @csrf
                                    </form>
                                </div>
                            </li>
                        @endguest
                    </ul>
                </div>
            </div>
        </nav>

        <main>
            @yield('content')
        </main>
        
        <footer class="bg-dark text-white pt-5 pb-4">
            <div class="container">
                <div class="row g-4">
                    <div class="col-lg-4 mb-4 mb-lg-0">
                        <h5 class="fw-bold mb-3">{{ config('app.name', 'KuponSal') }}</h5>
                        <p class="mb-3">En iyi fırsatlar, indirimler ve kupon kodları için nihai adresiniz.</p>
                        <div class="social-icons">
                            <a href="#" class="text-white me-3"><i class="bi bi-facebook"></i></a>
                            <a href="#" class="text-white me-3"><i class="bi bi-twitter"></i></a>
                            <a href="#" class="text-white me-3"><i class="bi bi-instagram"></i></a>
                            <a href="#" class="text-white"><i class="bi bi-linkedin"></i></a>
                        </div>
                    </div>
                    <div class="col-6 col-md-4 col-lg-2">
                        <h6 class="fw-bold mb-3">Kategoriler</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Moda</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Elektronik</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Seyahat</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Yemek</a></li>
                            <li><a href="#" class="text-white-50 text-decoration-none">Daha Fazla</a></li>
                        </ul>
                    </div>
                    <div class="col-6 col-md-4 col-lg-2">
                        <h6 class="fw-bold mb-3">Hızlı Bağlantılar</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Hakkımızda</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">İletişim</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">SSS</a></li>
                            <li class="mb-2"><a href="#" class="text-white-50 text-decoration-none">Gizlilik Politikası</a></li>
                            <li><a href="#" class="text-white-50 text-decoration-none">Kullanım Şartları</a></li>
                        </ul>
                    </div>
                    <div class="col-md-4 col-lg-4">
                        <h6 class="fw-bold mb-3">İletişim</h6>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="bi bi-envelope me-2"></i> info@kuponsal.com</li>
                            <li class="mb-2"><i class="bi bi-geo-alt me-2"></i> İstanbul, Türkiye</li>
                            <li><i class="bi bi-telephone me-2"></i> +90 123 456 7890</li>
                        </ul>
                    </div>
                </div>
                <hr class="my-4">
                <div class="row">
                    <div class="col-md-6 mb-3 mb-md-0">
                        <p class="mb-0">&copy; {{ date('Y') }} {{ config('app.name', 'KuponSal') }}. Tüm hakları saklıdır.</p>
                    </div>
                    <div class="col-md-6 text-md-end">
                        <p class="mb-0">İstanbul'da <i class="bi bi-heart-fill text-danger"></i> ile yapılmıştır</p>
                    </div>
                </div>
            </div>
        </footer>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js"></script>
    @stack('scripts')
</body>
</html>
