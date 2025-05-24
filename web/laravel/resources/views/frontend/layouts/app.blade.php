<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'KuponSal - En İyi İndirim Kuponları ve Fırsatlar')</title>
    
    <!-- SEO Meta Tags -->
    <meta name="description" content="@yield('description', 'Türkiye\'nin en büyük kupon ve indirim sitesi. Binlerce marka için geçerli kupon kodları, indirim fırsatları ve promosyon kodları.')">
    <meta name="keywords" content="kupon, indirim, promosyon kodu, fırsat, alışveriş, tasarruf">
    <meta name="author" content="KuponSal">
    
    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="@yield('title', 'KuponSal - En İyi İndirim Kuponları')">
    <meta property="og:description" content="@yield('description', 'Türkiye\'nin en büyük kupon ve indirim sitesi.')">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ request()->url() }}">
    <meta property="og:site_name" content="KuponSal">
    
    <!-- Twitter Meta Tags -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="@yield('title', 'KuponSal - En İyi İndirim Kuponları')">
    <meta name="twitter:description" content="@yield('description', 'Türkiye\'nin en büyük kupon ve indirim sitesi.')">
    
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <!-- Canonical URL -->
    <link rel="canonical" href="{{ request()->url() }}">
    
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=Nunito:400,600,700" rel="stylesheet">
    
    <!-- Font Awesome -->
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom Styles -->
    <style>
        .navbar-brand {
            font-weight: 700;
            font-size: 1.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
            transform: translateY(-1px);
        }
        
        .card {
            transition: all 0.3s ease;
        }
        
        .navbar-nav .nav-link {
            font-weight: 500;
            transition: color 0.3s ease;
        }
        
        .navbar-nav .nav-link:hover {
            color: #667eea !important;
        }
        
        .navbar-nav .nav-link.active {
            color: #667eea !important;
            font-weight: 600;
        }
        
        /* Mobile Search */
        @media (max-width: 768px) {
            #searchForm {
                width: 100%;
                margin: 10px 0;
            }
            
            #searchInput {
                flex: 1;
            }
        }
        
        /* Sticky Footer */
        html, body {
            height: 100%;
        }
        
        #app {
            min-height: 100vh;
        }
        
        .flex-grow-1 {
            flex: 1 0 auto;
        }
        
        footer {
            flex-shrink: 0;
        }
    </style>
    
    @stack('styles')
    
    <!-- Scripts -->
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body>
    <div id="app" class="d-flex flex-column min-vh-100">
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
                            <a class="nav-link {{ request()->routeIs('home') ? 'active' : '' }}" href="{{ route('home') }}">Anasayfa</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('categories.*') ? 'active' : '' }}" href="{{ route('categories.index') }}">Kategoriler</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('brands.*') ? 'active' : '' }}" href="{{ route('brands.index') }}">Markalar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('coupons.*') ? 'active' : '' }}" href="{{ route('coupons.index') }}">Tüm Kuponlar</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link {{ request()->routeIs('blog.*') ? 'active' : '' }}" href="{{ route('blog.index') }}">Blog</a>
                        </li>
                        {{-- Add more navigation links here --}}
                    </ul>

                 

                    <!-- Right Side Of Navbar -->
                    <ul class="navbar-nav ms-auto">
                        <div class="d-flex me-3">
                            <form class="d-flex position-relative" method="GET" action="{{ route('search') }}" id="searchForm">
                                <input class="form-control me-2" type="search" name="q" placeholder="Kupon, marka ara..." 
                                    aria-label="Search" id="searchInput" autocomplete="off" 
                                    value="{{ request('q') }}">
                                <button class="btn btn-outline-primary" type="submit">
                                    <i class="fas fa-search"></i>
                                </button>
                                <!-- Search Suggestions Dropdown -->
                                <div id="searchSuggestions" class="position-absolute bg-white border rounded shadow-sm" 
                                    style="top: 100%; left: 0; right: 40px; z-index: 1000; display: none; max-height: 300px; overflow-y: auto;">
                                </div>
                            </form>
                        </div>
                        <!-- Authentication Links -->
                        @guest
                            <!-- @if (Route::has('login'))
                                <li class="nav-item">
                                    <a class="nav-link" href="{{ route('login') }}">{{ __('Giriş') }}</a>
                                </li>
                            @endif -->
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

        <main class="flex-grow-1">
            @yield('content')
        </main>
        
        <footer class="bg-dark text-white pt-5 pb-4 mt-auto">
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
                            <li class="mb-2"><a href="{{ route('categories.index') }}" class="text-white-50 text-decoration-none">Tüm Kategoriler</a></li>
                            <li class="mb-2"><a href="{{ route('brands.index') }}" class="text-white-50 text-decoration-none">Markalar</a></li>
                            <li class="mb-2"><a href="{{ route('coupons.index') }}" class="text-white-50 text-decoration-none">Tüm Kuponlar</a></li>
                            <li class="mb-2"><a href="{{ route('blog.index') }}" class="text-white-50 text-decoration-none">Blog</a></li>
                            <li><a href="{{ route('search') }}" class="text-white-50 text-decoration-none">Arama</a></li>
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
    
    <!-- Search Suggestions Script -->
    <script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('searchInput');
        const searchSuggestions = document.getElementById('searchSuggestions');
        let timeout = null;

        if (searchInput && searchSuggestions) {
            searchInput.addEventListener('input', function() {
                clearTimeout(timeout);
                const query = this.value.trim();

                if (query.length < 2) {
                    searchSuggestions.style.display = 'none';
                    return;
                }

                timeout = setTimeout(function() {
                    fetch('{{ route("search.suggestions") }}?q=' + encodeURIComponent(query))
                        .then(response => response.json())
                        .then(data => {
                            if (data.length > 0) {
                                let html = '';
                                data.forEach(function(item) {
                                    html += `
                                        <a href="${item.url}" class="d-block p-2 text-decoration-none text-dark border-bottom suggestion-item">
                                            <div class="d-flex align-items-center">
                                                <i class="${item.icon} me-2 text-primary"></i>
                                                <div>
                                                    <div class="fw-bold">${item.title}</div>
                                                    ${item.subtitle ? `<small class="text-muted">${item.subtitle}</small>` : ''}
                                                </div>
                                            </div>
                                        </a>
                                    `;
                                });
                                searchSuggestions.innerHTML = html;
                                searchSuggestions.style.display = 'block';
                            } else {
                                searchSuggestions.style.display = 'none';
                            }
                        })
                        .catch(function() {
                            searchSuggestions.style.display = 'none';
                        });
                }, 300);
            });

            // Hide suggestions when clicking outside
            document.addEventListener('click', function(e) {
                if (!searchInput.contains(e.target) && !searchSuggestions.contains(e.target)) {
                    searchSuggestions.style.display = 'none';
                }
            });

            // Show suggestions when focusing on input if there's content
            searchInput.addEventListener('focus', function() {
                if (this.value.length >= 2 && searchSuggestions.innerHTML.trim() !== '') {
                    searchSuggestions.style.display = 'block';
                }
            });
        }
    });
    </script>

    <style>
    .suggestion-item:hover {
        background-color: #f8f9fa;
    }
    </style>
    
    @stack('scripts')
</body>
</html>
