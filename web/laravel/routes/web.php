<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\AdminController; // AdminController import edildi
use App\Http\Controllers\Admin\CategoryController; // CategoryController import edildi
use App\Http\Controllers\Admin\SliderController; // SliderController import edildi
use App\Http\Controllers\Admin\BrandController; // BrandController import edildi
use App\Http\Controllers\Admin\CouponCodeController; // CouponCodeController import edildi
use App\Http\Controllers\Admin\BlogController; // BlogController import edildi
use App\Http\Controllers\Admin\PageController; // PageController import edildi

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

Route::get('/', function () {
    return view('welcome');
});

// Breeze's default dashboard route, this can be removed or modified.
// For now, I'm leaving it as is.
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

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

require __DIR__.'/auth.php';
