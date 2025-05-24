<x-guest-layout>
    <div class="text-center mb-4">
        <h4>İki Faktörlü Kimlik Doğrulama</h4>
        <p class="text-muted">Authenticator uygulamanızdan 6 haneli kodu girin</p>
    </div>

    @if (session('error'))
        <div class="alert alert-danger text-center">
            {{ session('error') }}
        </div>
    @endif

    <form method="POST" action="{{ route('2fa.verify.post') }}">
        @csrf

        <div class="mb-3">
            <x-input-label for="one_time_password" :value="__('Doğrulama Kodu')" />
            <x-text-input id="one_time_password" 
                         class="block mt-1 w-full text-center @error('one_time_password') is-invalid @enderror" 
                         type="text" 
                         name="one_time_password" 
                         placeholder="000000"
                         maxlength="6" 
                         required 
                         autofocus 
                         autocomplete="off" />
            @error('one_time_password')
                <div class="text-danger mt-2">{{ $message }}</div>
            @enderror
        </div>

        <div class="flex items-center justify-between mt-4">
            <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
               href="{{ route('login') }}">
                {{ __('Geri Dön') }}
            </a>

            <x-primary-button class="ms-3">
                {{ __('Doğrula') }}
            </x-primary-button>
        </div>
    </form>

    <script>
        // Auto-submit when 6 digits are entered
        document.getElementById('one_time_password').addEventListener('input', function(e) {
            if (e.target.value.length === 6) {
                // Small delay to ensure user sees the complete code
                setTimeout(() => {
                    e.target.form.submit();
                }, 500);
            }
        });
    </script>
</x-guest-layout>
