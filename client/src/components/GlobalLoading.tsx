import React from 'react';
import { useLoading } from '../context/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const GlobalLoading: React.FC = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <LoadingSpinner />
    </div>
  );
};

export default GlobalLoading;
