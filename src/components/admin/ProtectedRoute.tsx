import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAdmin, isLoading, user } = useAuth();
  const location = useLocation();

  console.log('ProtectedRoute: Current state:', { isAdmin, isLoading, user: user?.email || 'none' });

  if (isLoading) {
    console.log('ProtectedRoute: Still loading auth state');
    return (
      <div className="min-h-screen bg-[#08090B] flex flex-col items-center justify-center text-white">
        <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin mb-4" />
        <p className="text-sm font-mono text-zinc-400">Verifying authorization...</p>
        <p className="text-xs font-mono text-zinc-600 mt-2">Debug: isLoading={isLoading.toString()}</p>
      </div>
    );
  }

  if (!isAdmin) {
    console.log('ProtectedRoute: Not authorized, redirecting to login');
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  console.log('ProtectedRoute: Authorized, showing admin dashboard');
  return <>{children}</>;
};
