import React from 'react';
import { useForm } from 'lib/useForm';
import { object, string } from 'yup';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Input from 'components/Common/Form/Input';
import { useLoginQuery } from 'components/Admin/service';
import Error from 'components/Common/Error';

const schema = object({
  email: string().email().required(),
  password: string().min(6).required(),
});

export default function LoginPage() {
  const form = useForm({
    schema,
  });

  const { login, error, notActivated } = useLoginQuery();

  const submit = () => login(form.getValues());

  return (
    <>
      {notActivated && (
        <div className="mb-8 text-lg">
          Please email{' '}
          <a href="mailto:lennon@smoothconversion.com" className="link">
            lennon@smoothconversion.com
          </a>{' '}
          to activate your account
        </div>
      )}
      {!notActivated && <Error error={error} />}
      <form onSubmit={form.handleSubmit(submit)}>
        <Input
          labelClass="w-24"
          form={form}
          name="email"
          label="Email"
          type="email"
        />
        <Input
          labelClass="w-24"
          form={form}
          name="password"
          label="Password"
          type="password"
        />
        <div className="w-full flex justify-end">
          <input className="btn-primary" type="submit" value="Login" />
        </div>
        <div className="mt-10 text-center">
          Don&apos;t have an account?
          <Link to={routes.register} className="link ml-2">
            Create Account
          </Link>
        </div>
        <div className="mt-4 text-center">
          Forgot your password?
          <Link to={routes.resetPassword} className="link ml-2">
            Reset password
          </Link>
        </div>
      </form>
    </>
  );
}
