@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Blog Posts</h1>
        <a href="{{ route('admin.blogs.create') }}" class="btn btn-primary mb-3">Add New Blog Post</a>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Image</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Published</th>
                    <th>Published At</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($blogs as $blog)
                    <tr>
                        <td>{{ $blog->id }}</td>
                        <td>
                            @if ($blog->image)
                                <img src="{{ asset('storage/' . $blog->image) }}" alt="{{ $blog->title }}" width="100">
                            @else
                                N/A
                            @endif
                        </td>
                        <td>{{ $blog->title }}</td>
                        <td>{{ $blog->slug }}</td>
                        <td>{{ $blog->is_published ? 'Yes' : 'No' }}</td>
                        <td>{{ $blog->published_at ? $blog->published_at->format('Y-m-d H:i') : 'N/A' }}</td>
                        <td>
                            <a href="{{ route('admin.blogs.show', $blog) }}" class="btn btn-info btn-sm">View</a>
                            <a href="{{ route('admin.blogs.edit', $blog) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('admin.blogs.destroy', $blog) }}" method="POST" style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7" class="text-center">No blog posts found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        {{ $blogs->links() }}
    </div>
@endsection
