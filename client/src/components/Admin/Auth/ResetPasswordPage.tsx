import React from 'react';
import { useForm } from 'lib/useForm';
import { object, string } from 'yup';
import { Link } from 'react-router-dom';
import routes from 'routes';
import Input from 'components/Common/Form/Input';
import {
  useResetPasswordQuery,
  useSendResetPassowrdEmailQuery,
} from 'components/Admin/service';
import Error from 'components/Common/Error';

const emailSchema = object({
  email: string().email().required(),
});

const resetSchema = object({
  code: string().required(),
  password: string().min(6).required(),
});

export default function ResetPasswordPage() {
  const emailForm = useForm({
    schema: emailSchema,
  });

  const resetForm = useForm({
    schema: resetSchema,
  });

  const {
    sendResetPasswordEmail,
    error: sendError,
    isSuccess: isSendSuccess,
  } = useSendResetPassowrdEmailQuery();

  const { resetPassword, error: resetError } = useResetPasswordQuery();

  const sendEmail = () => sendResetPasswordEmail(emailForm.getValues());

  const submitReset = () => resetPassword(resetForm.getValues());

  return (
    <>
      {<Error error={sendError || resetError} />}
      {!isSendSuccess && (
        <form onSubmit={emailForm.handleSubmit(sendEmail)}>
          <Input
            labelClass="w-24"
            form={emailForm}
            name="email"
            label="Email"
            type="email"
          />
          <div className="w-full flex justify-center">
            <input
              className="btn-primary"
              type="submit"
              value="Send Email with Code"
            />
          </div>
        </form>
      )}
      {isSendSuccess && (
        <form onSubmit={resetForm.handleSubmit(submitReset)}>
          <Input
            labelClass="w-36"
            form={resetForm}
            name="code"
            label="Code from email"
          />
          <Input
            labelClass="w-36"
            form={resetForm}
            name="password"
            label="New Password"
          />
          <div className="w-full flex justify-center">
            <input
              className="btn-primary"
              type="submit"
              value="Submit new Password"
            />
          </div>
        </form>
      )}
      <div className="mt-10 text-center">
        Don&apos;t have an account?
        <Link to={routes.register} className="link ml-2">
          Create Account
        </Link>
      </div>
      <div className="mt-4 text-center">
        <Link to={routes.login} className="link ml-2">
          Back to login
        </Link>
      </div>
    </>
  );
}
