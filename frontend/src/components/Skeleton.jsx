import React from 'react';
import { useTheme } from '../context/ThemeContext';

export const SkeletonBase = ({ className }) => {
  const { isDarkMode } = useTheme();
  return (
    <div 
      className={`animate-pulse ${
        isDarkMode ? 'bg-white/5' : 'bg-gray-200'
      } ${className}`}
    />
  );
};

export const CardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-[2rem] p-8 h-full flex flex-col">
    <SkeletonBase className="w-16 h-16 rounded-2xl mb-6" />
    <SkeletonBase className="h-6 w-3/4 rounded-md mb-4" />
    <div className="space-y-2 mb-8 flex-1">
      <SkeletonBase className="h-4 w-full rounded-md" />
      <SkeletonBase className="h-4 w-5/6 rounded-md" />
      <SkeletonBase className="h-4 w-4/6 rounded-md" />
    </div>
    <div className="flex justify-between items-center mt-auto">
      <SkeletonBase className="h-4 w-1/3 rounded-md" />
      <SkeletonBase className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export const TextSkeleton = ({ lines = 3, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase key={i} className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col items-center">
    <SkeletonBase className="w-48 h-48 rounded-full mb-6" />
    <SkeletonBase className="h-8 w-48 rounded-md mb-2" />
    <SkeletonBase className="h-4 w-32 rounded-md mb-6" />
    <div className="flex gap-4">
      <SkeletonBase className="w-10 h-10 rounded-full" />
      <SkeletonBase className="w-10 h-10 rounded-full" />
      <SkeletonBase className="w-10 h-10 rounded-full" />
    </div>
  </div>
);

export const TableRowSkeleton = ({ columns = 5 }) => (
  <div className="flex items-center gap-4 py-4 border-b border-white/5">
    {Array.from({ length: columns }).map((_, i) => (
      <div key={i} className={`flex-1 ${i === 0 ? 'flex-[2]' : ''}`}>
        <SkeletonBase className="h-4 w-3/4 rounded-md" />
      </div>
    ))}
  </div>
);

export const HeroSkeleton = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center pt-32 pb-20">
    <SkeletonBase className="h-6 w-48 rounded-full mb-8" />
    <SkeletonBase className="h-16 md:h-20 w-3/4 max-w-4xl rounded-2xl mb-6" />
    <SkeletonBase className="h-16 md:h-20 w-2/3 max-w-3xl rounded-2xl mb-8" />
    <SkeletonBase className="h-5 w-full max-w-2xl rounded-md mb-3" />
    <SkeletonBase className="h-5 w-5/6 max-w-xl rounded-md mb-10" />
    <div className="flex gap-4">
      <SkeletonBase className="h-14 w-40 rounded-xl" />
      <SkeletonBase className="h-14 w-40 rounded-xl" />
    </div>
  </div>
);

export const HeroStackSkeleton = () => (
  <>
    <SkeletonBase className="absolute inset-0 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/5 border border-white/10" />
    <div className="absolute inset-0 translate-x-4 translate-y-4 bg-white/5 border border-white/10 rounded-[3.5rem] -z-10 opacity-50"></div>
    <div className="absolute inset-0 translate-x-8 translate-y-8 bg-white/[0.02] border border-white/10 rounded-[3.5rem] -z-20 opacity-30"></div>
  </>
);

export default SkeletonBase;
