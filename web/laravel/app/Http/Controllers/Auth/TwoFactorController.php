<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;
use Endroid\QrCode\QrCode;
use Endroid\QrCode\Writer\PngWriter;
use Illuminate\Support\Facades\Auth;

class TwoFactorController extends Controller
{
    /**
     * Show 2FA setup page
     */
    public function show()
    {
        $user = Auth::user();
        $google2fa = new Google2FA();
        
        if (!$user->google2fa_secret) {
            $secret = $google2fa->generateSecretKey();
            $user->google2fa_secret = $secret;
            $user->save();
        } else {
            $secret = $user->google2fa_secret;
        }

        $qrCodeUrl = $google2fa->getQRCodeUrl(
            config('app.name'),
            $user->email,
            $secret
        );

        // Generate QR Code
        $qrCode = new QrCode($qrCodeUrl);
        $writer = new PngWriter();
        $qrCodeImage = $writer->write($qrCode);
        $qrCodeDataUri = 'data:image/png;base64,' . base64_encode($qrCodeImage->getString());

        return view('auth.two-factor', compact('secret', 'qrCodeDataUri', 'user'));
    }

    /**
     * Enable 2FA
     */
    public function enable(Request $request)
    {
        $request->validate([
            'one_time_password' => 'required|digits:6',
        ]);

        $user = Auth::user();
        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->one_time_password);

        if ($valid) {
            $user->google2fa_enabled = true;
            $user->google2fa_enabled_at = now();
            $user->save();

            return redirect()->back()->with('success', '2FA başarıyla etkinleştirildi!');
        }

        return redirect()->back()->with('error', 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
    }

    /**
     * Disable 2FA
     */
    public function disable(Request $request)
    {
        $request->validate([
            'one_time_password' => 'required|digits:6',
        ]);

        $user = Auth::user();
        $google2fa = new Google2FA();

        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->one_time_password);

        if ($valid) {
            $user->google2fa_enabled = false;
            $user->google2fa_enabled_at = null;
            $user->google2fa_secret = null;
            $user->save();

            return redirect()->back()->with('success', '2FA başarıyla devre dışı bırakıldı!');
        }

        return redirect()->back()->with('error', 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
    }

    /**
     * Show 2FA verify page during login
     */
    public function showVerify()
    {
        return view('auth.two-factor-verify');
    }

    /**
     * Verify 2FA code during login
     */
    public function verify(Request $request)
    {
        $request->validate([
            'one_time_password' => 'required|digits:6',
        ]);

        $user = $request->session()->get('2fa_user');
        
        if (!$user) {
            return redirect()->route('login')->with('error', 'Oturum süresi doldu. Lütfen tekrar giriş yapın.');
        }

        $google2fa = new Google2FA();
        $valid = $google2fa->verifyKey($user->google2fa_secret, $request->one_time_password);

        if ($valid) {
            Auth::login($user);
            $request->session()->forget('2fa_user');
            return redirect()->intended(route('admin.dashboard'));
        }

        return redirect()->back()->with('error', 'Geçersiz doğrulama kodu. Lütfen tekrar deneyin.');
    }
}
