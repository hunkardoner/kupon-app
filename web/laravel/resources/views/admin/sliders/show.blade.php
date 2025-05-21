@extends('admin.layouts.app')

@section('content')
    <div class="container">
        <h1>Slider: {{ $slider->title }}</h1>

        <table class="table">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{{ $slider->id }}</td>
                </tr>
                <tr>
                    <th>Title</th>
                    <td>{{ $slider->title }}</td>
                </tr>
                <tr>
                    <th>Image</th>
                    <td>
                        @if ($slider->image)
                            <img src="{{ asset('storage/' . $slider->image) }}" alt="{{ $slider->title }}" width="200">
                        @else
                            No Image
                        @endif
                    </td>
                </tr>
                <tr>
                    <th>Link</th>
                    <td><a href="{{ $slider->link }}" target="_blank">{{ $slider->link }}</a></td>
                </tr>
                <tr>
                    <th>Active</th>
                    <td>{{ $slider->is_active ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                    <th>Order</th>
                    <td>{{ $slider->order }}</td>
                </tr>
                <tr>
                    <th>Created At</th>
                    <td>{{ $slider->created_at }}</td>
                </tr>
                <tr>
                    <th>Updated At</th>
                    <td>{{ $slider->updated_at }}</td>
                </tr>
            </tbody>
        </table>

        <a href="{{ route('admin.sliders.edit', $slider) }}" class="btn btn-warning">Edit</a>
        <a href="{{ route('admin.sliders.index') }}" class="btn btn-secondary">Back to List</a>
    </div>
@endsection
