@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Coupon Code: {{ $couponCode->code }}</h1>

        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{{ $couponCode->id }}</td>
                </tr>
                <tr>
                    <th>Code</th>
                    <td>{{ $couponCode->code }}</td>
                </tr>
                <tr>
                    <th>Brand</th>
                    <td>{{ $couponCode->brand->name ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Categories</th>
                    <td>
                        @forelse ($couponCode->categories as $category)
                            <span class="badge bg-secondary">{{ $category->name }}</span>
                        @empty
                            N/A
                        @endforelse
                    </td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>{{ $couponCode->description ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Discount Type</th>
                    <td>{{ ucfirst($couponCode->discount_type) }}</td>
                </tr>
                <tr>
                    <th>Discount Value</th>
                    <td>
                        @if ($couponCode->discount_type === 'percentage')
                            {{ $couponCode->discount_value }}%
                        @elseif ($couponCode->discount_type === 'fixed')
                            ${{ number_format($couponCode->discount_value, 2) }}
                        @else
                            {{ $couponCode->discount_value }}
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>Valid From</th>
                    <td>{{ $couponCode->start_date ? $couponCode->start_date->format('Y-m-d H:i:s') : 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Valid To</th>
                    <td>{{ $couponCode->end_date ? $couponCode->end_date->format('Y-m-d H:i:s') : 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Max Uses (Overall)</th>
                    <td>{{ $couponCode->max_uses ?? 'Unlimited' }}</td>
                </tr>
                <tr>
                    <th>Times Used (Overall)</th>
                    <td>{{ $couponCode->times_used ?? 0 }}</td>
                </tr>
                <tr>
                    <th>Max Uses Per User</th>
                    <td>{{ $couponCode->max_uses_user ?? 'Unlimited' }}</td>
                </tr>
                 <tr>
                    <th>Minimum Purchase Amount</th>
                    <td>{{ $couponCode->min_purchase_amount ? '$' . number_format($couponCode->min_purchase_amount, 2) : 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Active</th>
                    <td>{{ $couponCode->is_active ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $couponCode->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $couponCode->updated_at->format('Y-m-d H:i:s') }}</td>
                </tr>
            </tbody>
        </table>

        <a href="{{ route('admin.coupon-codes.edit', $couponCode) }}" class="btn btn-warning">Edit</a>
        <a href="{{ route('admin.coupon-codes.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection
