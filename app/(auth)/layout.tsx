import React from 'react';

const AuthLayout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='min-h-screen flex items-center justify-center relative px-4'>
      {/* Gradient background overlay */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-[#fffcfa] to-[#ffecda]" />
      {children}
    </div>
  );
};

export default AuthLayout;