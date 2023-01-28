import React from 'react';
import { useForm } from 'lib/useForm';
import { object, string, ref } from 'yup';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Input from 'components/Common/Form/Input';
import { useRegisterQuery } from 'components/Admin/service';
import Error from 'components/Common/Error';

const schema = object({
  firstName: string().required(),
  lastName: string().required(),
  email: string().email().required(),
  password: string().min(6).required(),
  passwordConfirmation: string().oneOf(
    [ref('password'), undefined],
    'Passwords must match',
  ),
});

export default function LoginPage() {
  const form = useForm({
    schema,
  });

  const { register, error } = useRegisterQuery();

  const submit = async () => {
    register(form.getValues());
  };

  return (
    <form onSubmit={form.handleSubmit(submit)}>
      <Error error={error} />
      <Input
        labelClass="w-40"
        form={form}
        name="firstName"
        label="First name"
      />
      <Input labelClass="w-40" form={form} name="lastName" label="Last name" />
      <Input
        labelClass="w-40"
        form={form}
        name="email"
        label="Email"
        type="email"
      />
      <Input
        labelClass="w-40"
        form={form}
        name="password"
        label="Password"
        type="password"
      />
      <Input
        labelClass="w-40"
        form={form}
        name="passwordConfirmation"
        label="Confirm Password"
        type="password"
      />
      <div className="w-full flex justify-end">
        <input className="btn-primary" type="submit" value="Register" />
      </div>
      <div className="mt-10 text-center">
        Already have an account?{' '}
        <Link to={routes.login} className="link ml-2">
          Login
        </Link>
      </div>
    </form>
  );
}
