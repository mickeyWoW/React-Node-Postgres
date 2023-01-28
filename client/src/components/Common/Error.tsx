import React from 'react';

export default function Error({ error }: { error: unknown }) {
  if (!error) return null;

  return (
    <div className="text-red-600 text-lg text-center mb-5">
      {(error as Error).message}
    </div>
  );
}
