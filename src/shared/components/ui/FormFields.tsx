import {
  PasswordInput,
  type PasswordInputProps,
  TextInput,
  type TextInputProps,
} from '@mantine/core';
import { get, useFormContext } from 'react-hook-form';

/**
 * Form fields for react-hook-form
 *
 * Every field reads the form from <FormProvider>, so a field only needs a `name`:
 *
 *   <FormTextInput name="email" label="Email" />
 *
 * They use `register`, so typing doesn't re-render the form.
 * All other props go to the Mantine component.
 */

type Named<P> = Omit<
  P,
  'name' | 'value' | 'defaultValue' | 'onChange' | 'error'
> & {
  name: string;
};

const useRegistered = (name: string) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return {
    ...register(name),
    error: (get(errors, name) as { message?: string } | undefined)?.message,
  };
};

export const FormTextInput = ({ name, ...props }: Named<TextInputProps>) => {
  return <TextInput {...props} {...useRegistered(name)} />;
};

export const FormPasswordInput = ({
  name,
  ...props
}: Named<PasswordInputProps>) => {
  return <PasswordInput {...props} {...useRegistered(name)} />;
};
