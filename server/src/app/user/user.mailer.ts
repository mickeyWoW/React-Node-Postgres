import { sendMail } from 'lib/mailer';

export const sendResetPasswordEmail = async ({
  to,
  token,
}: {
  to: string;
  token: string;
}) => {
  sendMail({
    to,
    subject: 'Reset Password',
    html: `
      <h3>Reset Password</h3>
      <br>
      <p>Here is your reset password code: ${token}.</p>
    `,
  });
};
