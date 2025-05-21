<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('category_coupon_code', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('coupon_code_id')->constrained('coupon_codes')->onDelete('cascade');
            $table->timestamps();

            // İsteğe bağlı: Aynı kategori ve kupon kodu kombinasyonunun tekrar etmesini engellemek için
            // $table->unique(['category_id', 'coupon_code_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('category_coupon_code');
    }
};
