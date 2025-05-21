@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>{{ $blog->title }}</h1>

        @if ($blog->image)
            <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }}" class="img-fluid mb-3" style="max-width: 400px;">
        @endif

        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{{ $blog->id }}</td>
                </tr>
                <tr>
                    <th>Slug</th>
                    <td>{{ $blog->slug }}</td>
                </tr>
                <tr>
                    <th>Content</th>
                    <td>{!! nl2br(e($blog->content)) !!}</td>
                </tr>
                <tr>
                    <th>Meta Title</th>
                    <td>{{ $blog->meta_title ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Meta Description</th>
                    <td>{{ $blog->meta_description ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Published</th>
                    <td>{{ $blog->is_published ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th>Published At</th>
                    <td>{{ $blog->published_at ? $blog->published_at->format('Y-m-d H:i:s') : 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $blog->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $blog->updated_at->format('Y-m-d H:i:s') }}</td>
                </tr>
            </tbody>
        </table>

        <a href="{{ route('admin.blogs.edit', $blog) }}" class="btn btn-warning">Edit</a>
        <a href="{{ route('admin.blogs.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection
