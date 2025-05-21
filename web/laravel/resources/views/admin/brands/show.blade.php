@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Brand: {{ $brand->name }}</h1>

        <table class="table">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{{ $brand->id }}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{{ $brand->name }}</td>
                </tr>
                <tr>
                    <th>Slug</th>
                    <td>{{ $brand->slug }}</td>
                </tr>
                <tr>
                    <th>Logo</th>
                    <td>
                        @if ($brand->logo)
                            <img src="{{ asset('storage/' . $brand->logo) }}" alt="{{ $brand->name }}" width="200">
                        @else
                            No Logo
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>Description</th>
                    <td>{{ $brand->description ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Active</th>
                    <td>{{ $brand->is_active ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $brand->created_at }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $brand->updated_at }}</td>
                </tr>
            </tbody>
        </table>

        <a href="{{ route('admin.brands.edit', $brand) }}" class="btn btn-warning">Edit</a>
        <a href="{{ route('admin.brands.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection
