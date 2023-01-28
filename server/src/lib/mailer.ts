import previewEmail from 'preview-email';
import sgMail from '@sendgrid/mail';
import config from 'config';

if (config.env.production) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
}

const defaultFrom = process.env.EMAIL_FROM as string;

type Email = {
  from?: string;
  to: string;
  subject: string;
  text?: string;
  html: string;
};

type EmailWithId = Email & { id: number };

let emailId = 1;
export const sentEmailsForTests: EmailWithId[] = [];

const sendingPromises: Promise<void>[] = [];

export const waitForEmails = async () => {
  await Promise.all(sendingPromises);
  return sentEmailsForTests;
};

export const sendMail = config.env.production
  ? ({ from = defaultFrom, to, subject, text, html }: Email) => {
      const email = { from, to, subject, text, html };
      sgMail
        .send(email)
        .then(() => console.log('Email sent', email))
        .catch(console.error);
    }
  : (params: Email) => {
      const email: EmailWithId = {
        ...params,
        from: params.from || defaultFrom,
        id: emailId++,
      };

      sentEmailsForTests.push(email);

      sendingPromises.push(
        previewEmail(email, { open: config.openEmailsInDev })
          .then((url) => {
            if (config.env.development) {
              console.log(`Email "${email.subject} was sent to ${email.to}"`);
              console.log(url);
            }
          })
          .catch(console.error),
      );
    };
