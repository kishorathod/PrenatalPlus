'use client';

import { WifiOff, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OfflinePage() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <WifiOff className="w-10 h-10 text-blue-500" />
                </div>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-2">You're Offline</h1>
                    <p className="text-slate-500">
                        Please check your internet connection to access the full features of PrenatalPlus.
                    </p>
                </div>

                <Button
                    onClick={() => window.location.reload()}
                    className="w-full bg-[#4D9FFF] hover:bg-[#3D8FDF] text-white py-6 text-lg"
                >
                    <RotateCw className="w-5 h-5 mr-2" />
                    Try Again
                </Button>
            </div>
        </div>
    );
}
