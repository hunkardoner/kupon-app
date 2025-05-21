@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Pages</h1>
        <a href="{{ route('admin.pages.create') }}" class="btn btn-primary mb-3">Add New Page</a>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Published</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($pages as $page)
                    <tr>
                        <td>{{ $page->id }}</td>
                        <td>{{ $page->title }}</td>
                        <td>{{ $page->slug }}</td>
                        <td>{{ $page->is_published ? 'Yes' : 'No' }}</td>
                        <td>
                            <a href="{{ route('admin.pages.show', $page) }}" class="btn btn-info btn-sm">View</a>
                            <a href="{{ route('admin.pages.edit', $page) }}" class="btn btn-warning btn-sm">Edit</a>
                            <form action="{{ route('admin.pages.destroy', $page) }}" method="POST" style="display:inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="5" class="text-center">No pages found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        {{ $pages->links() }}
    </div>
@endsection
