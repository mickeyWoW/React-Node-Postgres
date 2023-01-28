import ErrorMessage from 'components/Common/Form/ErrorMessage';
import React from 'react';
import { UseFormMethods } from 'react-hook-form';

export default function Input({
  form,
  name,
  label,
  className = 'block mb-5',
  innerClass = 'flex items-center',
  labelClass = 'w-32',
  inputClass = 'input',
  errorAddClass = 'text-right',
  type = 'text',
}: {
  // eslint-disable-next-line
  form: UseFormMethods<any>;
  name: string;
  label?: string;
  className?: string;
  innerClass?: string;
  labelClass?: string;
  inputClass?: string;
  errorAddClass?: string;
  type?: string;
}) {
  return (
    <label className={className}>
      <div className={innerClass}>
        {label && <div className={labelClass}>{label}</div>}
        <input
          ref={form.register}
          name={name}
          className={inputClass}
          type={type}
        />
      </div>
      <ErrorMessage addClass={errorAddClass} form={form} name={name} />
    </label>
  );
}
