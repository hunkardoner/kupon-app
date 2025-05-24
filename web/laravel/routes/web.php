<?php

use Illuminate\Support\Facades\Log;
use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController; // AdminController import edildi
use App\Http\Controllers\Admin\CategoryController; // CategoryController import edildi
use App\Http\Controllers\Admin\SliderController; // SliderController import edildi
use App\Http\Controllers\Admin\BrandController; // BrandController import edildi
use App\Http\Controllers\Admin\CouponCodeController; // CouponCodeController import edildi
use App\Http\Controllers\Admin\BlogController; // BlogController import edildi
use App\Http\Controllers\Admin\PageController; // PageController import edildi
use App\Http\Controllers\Frontend\HomeController; // HomeController import edildi
use App\Http\Controllers\Frontend\CategoryController as FrontendCategoryController; // Frontend CategoryController import edildi
use App\Http\Controllers\Frontend\BrandController as FrontendBrandController; // Frontend BrandController import edildi
use App\Http\Controllers\Frontend\CouponController as FrontendCouponController; // Frontend CouponController import edildi
use App\Http\Controllers\Frontend\BlogController as FrontendBlogController; // Frontend BlogController import edildi
use App\Http\Controllers\Frontend\SearchController; // Frontend SearchController import edildi

Log::info('Routes web.php loaded'); // Moved this line after all use statements

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Frontend Routes
Route::get('/', [HomeController::class, 'index'])->name('home');

// Search Routes
Route::get('/ara', [SearchController::class, 'index'])->name('search');
Route::get('/api/search/suggestions', [SearchController::class, 'suggestions'])->name('search.suggestions');

// Categories Routes
Route::get('/kategoriler', [FrontendCategoryController::class, 'index'])->name('categories.index');
Route::get('/kategori/{slug}', [FrontendCategoryController::class, 'show'])->name('categories.show');

// Brands Routes
Route::get('/markalar', [FrontendBrandController::class, 'index'])->name('brands.index');
Route::get('/marka/{slug}', [FrontendBrandController::class, 'show'])->name('brands.show');

// Coupons Routes
Route::get('/kuponlar', [FrontendCouponController::class, 'index'])->name('coupons.index');
Route::get('/kupon/{id}', [FrontendCouponController::class, 'show'])->name('coupons.show');

// Blog Routes
Route::get('/blog', [FrontendBlogController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [FrontendBlogController::class, 'show'])->name('blog.show');

// Breeze's default dashboard route, this can be removed or modified.
// For now, I'm leaving it as is.
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // 2FA Routes
    Route::get('/two-factor', [\App\Http\Controllers\Auth\TwoFactorController::class, 'show'])->name('2fa.show');
    Route::post('/two-factor/enable', [\App\Http\Controllers\Auth\TwoFactorController::class, 'enable'])->name('2fa.enable');
    Route::post('/two-factor/disable', [\App\Http\Controllers\Auth\TwoFactorController::class, 'disable'])->name('2fa.disable');

    Route::prefix('quponsal')->name('admin.')->group(function () {
        Route::get('/', [AdminController::class, 'index'])->name('dashboard');
        Route::resource('categories', CategoryController::class);
        Route::resource('sliders', SliderController::class); // Slider için resourceful route eklendi
        Route::resource('brands', BrandController::class); // Brand için resourceful route eklendi
        Route::resource('coupon-codes', CouponCodeController::class); // CouponCode için resourceful route eklendi (coupon-codes olarak)
        Route::resource('blogs', BlogController::class); // Blog için resourceful route eklendi
        Route::resource('pages', PageController::class); // Page için resourceful route eklendi
    });
});

// 2FA Verification Routes (accessible without full auth)
Route::middleware('guest')->group(function () {
    Route::get('/two-factor/verify', [\App\Http\Controllers\Auth\TwoFactorController::class, 'showVerify'])->name('2fa.verify');
    Route::post('/two-factor/verify', [\App\Http\Controllers\Auth\TwoFactorController::class, 'verify'])->name('2fa.verify.post');
});

require __DIR__.'/auth.php';
