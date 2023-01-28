import React from 'react';
import { UseFormMethods } from 'react-hook-form/dist/types';
import { ErrorMessage as OriginalErrorMessage } from '@hookform/error-message';
import cn from 'classnames';

export default function ErrorMessage({
  form,
  name,
  className = 'text-red-600 mt-2',
  addClass,
}: {
  // eslint-disable-next-line
  form: UseFormMethods<any>
  name: string;
  className?: string;
  addClass?: string;
}) {
  return (
    <OriginalErrorMessage
      errors={form.errors}
      name={name}
      render={(error) => (
        <div className={cn(className, addClass)}>{error.message}</div>
      )}
    />
  );
}
