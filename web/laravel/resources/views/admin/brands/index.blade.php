@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Brands</h1>
        <a href="{{ route('admin.brands.create') }}" class="btn btn-primary mb-3">Create Brand</a>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Logo</th>
                    <th>Active</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($brands as $brand)
                    <tr>
                        <td>{{ $brand->id }}</td>
                        <td>{{ $brand->name }}</td>
                        <td>
                            @if ($brand->logo)
                                <img src="{{ asset('storage/' . $brand->logo) }}" alt="{{ $brand->name }}" width="100">
                            @else
                                No Logo
                            @endif
                        </td>
                        <td>{{ $brand->is_active ? 'Yes' : 'No' }}</td>
                        <td>
                            <a href="{{ route('admin.brands.show', $brand) }}" class="btn btn-sm btn-info">View</a>
                            <a href="{{ route('admin.brands.edit', $brand) }}" class="btn btn-sm btn-warning">Edit</a>
                            <form action="{{ route('admin.brands.destroy', $brand) }}" method="POST" style="display: inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5">No brands found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        {{ $brands->links() }}
    </div>
@endsection
