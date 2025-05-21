@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Edit Coupon Code: {{ $couponCode->code }}</h1>

        <form action="{{ route('admin.coupon-codes.update', $couponCode) }}" method="POST">
            @csrf
            @method('PUT')

            <div class="mb-3">
                <label for="code" class="form-label">Code</label>
                <input type="text" class="form-control @error('code') is-invalid @enderror" id="code" name="code" value="{{ old('code', $couponCode->code) }}" required>
                @error('code')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="brand_id" class="form-label">Brand</label>
                <select class="form-select @error('brand_id') is-invalid @enderror" id="brand_id" name="brand_id">
                    <option value="">Select Brand</option>
                    @foreach ($brands as $brand)
                        <option value="{{ $brand->id }}" {{ old('brand_id', $couponCode->brand_id) == $brand->id ? 'selected' : '' }}>{{ $brand->name }}</option>
                    @endforeach
                </select>
                @error('brand_id')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="categories" class="form-label">Categories</label>
                <select class="form-select @error('categories') is-invalid @enderror" id="categories" name="categories[]" multiple>
                    @foreach ($categories as $category)
                        <option value="{{ $category->id }}" {{ in_array($category->id, old('categories', $couponCode->categories->pluck('id')->toArray())) ? 'selected' : '' }}>{{ $category->name }}</option>
                    @endforeach
                </select>
                @error('categories')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea class="form-control @error('description') is-invalid @enderror" id="description" name="description" rows="3">{{ old('description', $couponCode->description) }}</textarea>
                @error('description')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="discount_type" class="form-label">Discount Type</label>
                    <select class="form-select @error('discount_type') is-invalid @enderror" id="discount_type" name="discount_type" required>
                        <option value="percentage" {{ old('discount_type', $couponCode->discount_type) == 'percentage' ? 'selected' : '' }}>Percentage</option>
                        <option value="fixed" {{ old('discount_type', $couponCode->discount_type) == 'fixed' ? 'selected' : '' }}>Fixed Amount</option>
                    </select>
                    @error('discount_type')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <div class="col-md-6 mb-3">
                    <label for="discount_value" class="form-label">Discount Value</label>
                    <input type="number" step="0.01" class="form-control @error('discount_value') is-invalid @enderror" id="discount_value" name="discount_value" value="{{ old('discount_value', $couponCode->discount_value) }}" required>
                    @error('discount_value')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="start_date" class="form-label">Valid From</label>
                    <input type="date" class="form-control @error('start_date') is-invalid @enderror" id="start_date" name="start_date" value="{{ old('start_date', $couponCode->start_date ? $couponCode->start_date->format('Y-m-d') : '') }}">
                    @error('start_date')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <div class="col-md-6 mb-3">
                    <label for="end_date" class="form-label">Valid To</label>
                    <input type="date" class="form-control @error('end_date') is-invalid @enderror" id="end_date" name="end_date" value="{{ old('end_date', $couponCode->end_date ? $couponCode->end_date->format('Y-m-d') : '') }}">
                    @error('end_date')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
            </div>

            <div class="row">
                <div class="col-md-6 mb-3">
                    <label for="max_uses" class="form-label">Max Uses (Overall)</label>
                    <input type="number" class="form-control @error('max_uses') is-invalid @enderror" id="max_uses" name="max_uses" value="{{ old('max_uses', $couponCode->max_uses) }}">
                    @error('max_uses')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
                <div class="col-md-6 mb-3">
                    <label for="max_uses_user" class="form-label">Max Uses Per User</label>
                    <input type="number" class="form-control @error('max_uses_user') is-invalid @enderror" id="max_uses_user" name="max_uses_user" value="{{ old('max_uses_user', $couponCode->max_uses_user) }}">
                    @error('max_uses_user')
                        <div class="invalid-feedback">{{ $message }}</div>
                    @enderror
                </div>
            </div>
            <div class="mb-3">
                <label for="min_purchase_amount" class="form-label">Minimum Purchase Amount</label>
                <input type="number" step="0.01" class="form-control @error('min_purchase_amount') is-invalid @enderror" id="min_purchase_amount" name="min_purchase_amount" value="{{ old('min_purchase_amount', $couponCode->min_purchase_amount) }}">
                @error('min_purchase_amount')
                    <div class="invalid-feedback">{{ $message }}</div>
                @enderror
            </div>

            <div class="mb-3 form-check">
                <input type="checkbox" class="form-check-input" id="is_active" name="is_active" value="1" {{ old('is_active', $couponCode->is_active) ? 'checked' : '' }}>
                <label class="form-check-label" for="is_active">Active</label>
            </div>

            <button type="submit" class="btn btn-primary">Update Coupon Code</button>
            <a href="{{ route('admin.coupon-codes.index') }}" class="btn btn-secondary">Cancel</a>
        </form>
    </div>
@endsection
