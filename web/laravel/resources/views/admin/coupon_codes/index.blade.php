@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Coupon Codes</h1>
        <a href="{{ route('admin.coupon-codes.create') }}" class="btn btn-primary mb-3">Add New Coupon Code</a>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Code</th>
                    <th>Brand</th>
                    <th>Discount</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Campaign URL</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($couponCodes as $couponCode)
                    <tr>
                        <td>{{ $couponCode->id }}</td>
                        <td>{{ $couponCode->code }}</td>
                        <td>{{ $couponCode->brand->name ?? 'N/A' }}</td>
                        <td>
                            @if ($couponCode->discount_type === 'percentage')
                                {{ $couponCode->discount_value }}%
                            @elseif ($couponCode->discount_type === 'fixed')
                                ${{ number_format($couponCode->discount_value, 2) }}
                            @else
                                {{ $couponCode->discount_value }}
                            @endif
                        </td>
                        <td>{{ $couponCode->start_date ? $couponCode->start_date->format('Y-m-d') : 'N/A' }}</td>
                        <td>{{ $couponCode->end_date ? $couponCode->end_date->format('Y-m-d') : 'N/A' }}</td>
                        <td>
                            @if($couponCode->campaign_url)
                                <a href="{{ $couponCode->campaign_url }}" target="_blank" class="btn btn-sm btn-outline-primary" title="{{ $couponCode->campaign_url }}">
                                    <i class="fas fa-external-link-alt"></i>
                                </a>
                            @else
                                <span class="text-muted">-</span>
                            @endif
                        </td>
                        <td>{{ $couponCode->is_active ? 'Yes' : 'No' }}</td>
                        <td>
                            <a href="{{ route('admin.coupon-codes.show', $couponCode) }}" class="btn btn-info btn-sm">View</a>
                            <a href="{{ route('admin.coupon-codes.edit', $couponCode) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('admin.coupon-codes.destroy', $couponCode) }}" method="POST" style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="9" class="text-center">No coupon codes found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        {{ $couponCodes->links() }}
    </div>
@endsection
