<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class TwoFactorMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = Auth::user();

        // If user is authenticated and has 2FA enabled but hasn't verified it in this session
        if ($user && $user->google2fa_enabled && !$request->session()->has('2fa_verified')) {
            // Allow access to 2FA routes and logout
            if ($request->routeIs(['2fa.*', 'logout'])) {
                return $next($request);
            }
            
            // Redirect to 2FA verification
            return redirect()->route('2fa.show')->with('info', 'Lütfen güvenlik ayarlarınızı kontrol edin.');
        }

        return $next($request);
    }
}
