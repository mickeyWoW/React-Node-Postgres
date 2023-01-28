import { useCallback } from 'react';
import { ObjectSchema } from 'yup';
import { useForm as useFormOriginal } from 'react-hook-form';
import {
  FieldValues,
  UseFormMethods,
  UseFormOptions,
} from 'react-hook-form/dist/types';

/* eslint-disable @typescript-eslint/ban-types */
const useYupValidationResolver = <T extends object | undefined>(
  validationSchema?: ObjectSchema<T>,
) =>
  useCallback(
    async (data) => {
      if (!validationSchema) return { values: data, errors: {} };

      try {
        const values = await validationSchema.validate(data, {
          abortEarly: false,
        });

        return {
          values,
          errors: {},
        };
      } catch (errors) {
        return {
          values: {},
          errors: errors.inner.reduce(
            (
              allErrors: Record<string, unknown>,
              currentError: { path: string; type?: string; message: string },
            ) => ({
              ...allErrors,
              [currentError.path]: {
                type: currentError.type ?? 'validation',
                message: currentError.message,
              },
            }),
            {},
          ),
        };
      }
    },
    [validationSchema],
  );

export function useForm<
  T extends object | undefined,
  TFieldValues extends FieldValues = FieldValues,
  TContext extends Record<string, unknown> = Record<string, unknown>
>({
  schema,
  ...params
}: UseFormOptions<TFieldValues, TContext> & {
  schema?: ObjectSchema<T>;
} = {}): UseFormMethods<Exclude<T, undefined>> {
  const resolver = useYupValidationResolver(schema);
  return useFormOriginal({
    ...params,
    resolver,
  }) as any // eslint-disable-line
}
