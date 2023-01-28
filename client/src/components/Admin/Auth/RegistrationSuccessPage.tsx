import React from 'react';

export default function RegistrationSuccessPage() {
  return (
    <div className="text-xl text-center">
      <p>Registration Successful!</p>
      <br />
      <p>
        Please email{' '}
        <a href="mailto:lennon@smoothconversion.com" className="link">
          lennon@smoothconversion.com
        </a>{' '}
        to activate your account
      </p>
    </div>
  );
}
