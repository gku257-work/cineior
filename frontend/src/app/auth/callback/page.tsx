'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function AuthCallbackContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { loginWithToken } = useAuth();

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            loginWithToken(token).then(() => {
                router.push('/discover');
            }).catch(() => {
                router.push('/login?error=OAuth failed');
            });
        } else {
            router.push('/login');
        }
    }, [searchParams, router, loginWithToken]);

    return (
        <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" style={{ borderColor: 'var(--accent) transparent var(--accent) var(--accent)' }} />
            <h2 className="text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Perfecting your experience...</h2>
            <p style={{ color: 'var(--muted)' }}>Setting up your cinematic journal</p>
        </div>
    );
}

export default function AuthCallbackPage() {
    return (
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
            <Suspense fallback={
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <h2 className="text-xl font-semibold">Loading...</h2>
                </div>
            }>
                <AuthCallbackContent />
            </Suspense>
        </div>
    );
}
