@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>{{ $page->title }}</h1>

        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{{ $page->id }}</td>
                </tr>
                <tr>
                    <th>Slug</th>
                    <td>{{ $page->slug }}</td>
                </tr>
                <tr>
                    <th>Content</th>
                    <td>{!! nl2br(e($page->content)) !!}</td>
                </tr>
                <tr>
                    <th>Meta Title</th>
                    <td>{{ $page->meta_title ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Meta Description</th>
                    <td>{{ $page->meta_description ?? 'N/A' }}</td>
                </tr>
                <tr>
                    <th>Published</th>
                    <td>{{ $page->is_published ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $page->created_at->format('Y-m-d H:i:s') }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $page->updated_at->format('Y-m-d H:i:s') }}</td>
                </tr>
            </tbody>
        </table>

        <a href="{{ route('admin.pages.edit', $page) }}" class="btn btn-warning">Edit</a>
        <a href="{{ route('admin.pages.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection
