@extends('admin.layouts.app')

@section('content')
<div class="container mt-5">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">
                    <h4 class="mb-0">İki Faktörlü Kimlik Doğrulama (2FA)</h4>
                </div>
                <div class="card-body">
                    @if (session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @endif

                    @if (session('error'))
                        <div class="alert alert-danger">
                            {{ session('error') }}
                        </div>
                    @endif

                    @if (!$user->google2fa_enabled)
                        <div class="alert alert-info">
                            <strong>2FA Devre Dışı:</strong> Hesabınızın güvenliği için iki faktörlü kimlik doğrulamayı etkinleştirmenizi öneriyoruz.
                        </div>

                        <h5>2FA Kurulumu</h5>
                        <p class="text-muted">Google Authenticator veya benzeri bir uygulama kullanarak aşağıdaki QR kodunu tarayın:</p>

                        <div class="text-center mb-4">
                            <img src="{{ $qrCodeDataUri }}" alt="QR Code" class="img-fluid" style="max-width: 200px;">
                        </div>

                        <div class="mb-3">
                            <label class="form-label"><strong>Manuel Giriş Kodu:</strong></label>
                            <div class="input-group">
                                <input type="text" class="form-control" value="{{ $secret }}" readonly>
                                <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('{{ $secret }}')">
                                    Kopyala
                                </button>
                            </div>
                            <small class="form-text text-muted">QR kod çalışmıyorsa bu kodu manuel olarak girebilirsiniz.</small>
                        </div>

                        <form method="POST" action="{{ route('2fa.enable') }}">
                            @csrf
                            <div class="mb-3">
                                <label for="one_time_password" class="form-label">Doğrulama Kodu</label>
                                <input type="text" class="form-control @error('one_time_password') is-invalid @enderror" 
                                       id="one_time_password" name="one_time_password" 
                                       placeholder="6 haneli kod girin" maxlength="6" required>
                                @error('one_time_password')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                                <small class="form-text text-muted">Authenticator uygulamanızdan 6 haneli kodu girin.</small>
                            </div>
                            <button type="submit" class="btn btn-success">2FA'yı Etkinleştir</button>
                        </form>
                    @else
                        <div class="alert alert-success">
                            <strong>2FA Etkin:</strong> Hesabınız iki faktörlü kimlik doğrulama ile korunuyor.
                            <br><small>Etkinleştirme tarihi: {{ $user->google2fa_enabled_at->format('d.m.Y H:i') }}</small>
                        </div>

                        <h5>2FA'yı Devre Dışı Bırak</h5>
                        <p class="text-muted">2FA'yı devre dışı bırakmak hesap güvenliğinizi azaltacaktır.</p>

                        <form method="POST" action="{{ route('2fa.disable') }}">
                            @csrf
                            <div class="mb-3">
                                <label for="one_time_password" class="form-label">Doğrulama Kodu</label>
                                <input type="text" class="form-control @error('one_time_password') is-invalid @enderror" 
                                       id="one_time_password" name="one_time_password" 
                                       placeholder="6 haneli kod girin" maxlength="6" required>
                                @error('one_time_password')
                                    <div class="invalid-feedback">{{ $message }}</div>
                                @enderror
                                <small class="form-text text-muted">Authenticator uygulamanızdan 6 haneli kodu girin.</small>
                            </div>
                            <button type="submit" class="btn btn-danger" 
                                    onclick="return confirm('2FA\'yı devre dışı bırakmak istediğinizden emin misiniz?')">
                                2FA'yı Devre Dışı Bırak
                            </button>
                        </form>
                    @endif

                    <hr class="my-4">
                    <div class="text-center">
                        <a href="{{ route('admin.dashboard') }}" class="btn btn-secondary">Geri Dön</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<script>
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(function() {
        alert('Kod kopyalandı!');
    }, function(err) {
        console.error('Kopyalama hatası: ', err);
    });
}
</script>
@endsection
