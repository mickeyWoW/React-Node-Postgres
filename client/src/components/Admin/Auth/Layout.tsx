import React from 'react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <h1 className="text-5xl mb-16">Welcome To Community Made</h1>
      {children}
    </div>
  );
}
