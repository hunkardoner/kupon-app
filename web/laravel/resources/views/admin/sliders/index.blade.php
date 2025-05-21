@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Sliders</h1>
        <a href="{{ route('admin.sliders.create') }}" class="btn btn-primary mb-3">Create Slider</a>

        @if (session('success'))
            <div class="alert alert-success">
                {{ session('success') }}
            </div>
        @endif

        <table class="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Image</th>
                    <th>Link</th>
                    <th>Active</th>
                    <th>Order</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($sliders as $slider)
                    <tr>
                        <td>{{ $slider->id }}</td>
                        <td>{{ $slider->title }}</td>
                        <td><img src="{{ asset('storage/' . $slider->image) }}" alt="{{ $slider->title }}" width="100"></td>
                        <td><a href="{{ $slider->link }}" target="_blank">{{ $slider->link }}</a></td>
                        <td>{{ $slider->is_active ? 'Yes' : 'No' }}</td>
                        <td>{{ $slider->order }}</td>
                        <td>
                            <a href="{{ route('admin.sliders.show', $slider) }}" class="btn btn-sm btn-info">View</a>
                            <a href="{{ route('admin.sliders.edit', $slider) }}" class="btn btn-sm btn-warning">Edit</a>
                            <form action="{{ route('admin.sliders.destroy', $slider) }}" method="POST" style="display: inline-block;">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="btn btn-sm btn-danger" onclick="return confirm('Are you sure?')">Delete</button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="7">No sliders found.</td>
                    </tr>
                @endforelse
            </tbody>
        </table>
        {{ $sliders->links() }}
    </div>
@endsection
