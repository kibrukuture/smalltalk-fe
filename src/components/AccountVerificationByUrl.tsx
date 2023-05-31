'use client';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { hostedAt } from '../util.fns';

export default function AccountVerificationByUrl() {
  const [notVerified, setNotVerified] = useState(true);

  // router
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/chat');
    if (!localStorage.getItem('user-signup')) navigate('/');

    const queryParams = new URLSearchParams(location.search);

    console.log(queryParams.get('token'), queryParams.get('smsCode'));

    (async () => {
      const res = await fetch(`${hostedAt()}/api/tolbel-account-verification-by-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: queryParams.get('token'),
          smsCode: queryParams.get('smsCode'),
        }),
      });

      const data = await res.json();
      setNotVerified(false);
      console.log(data);

      if (data.status === 'ok') {
        setTimeout(() => {
          navigate('/signin');
          localStorage.removeItem('user-signup');
        }, 2000);
      }
    })();
  }, []);

  return (
    <div className='h-screen gap-md md:gap-lg flex items-center justify-center mx-auto w-[70%] md:w-[50%] lg:w-[35%] '>
      <div className='flex flex-col gap-sm grow items-center justify-center'>
        <h1 className='text-3xl font-bold text-teal-400 font-code'>tolbel</h1>
        <h2 className='text-sm font-bold text-gray-700 font-code'>{notVerified ? 'Verifying...' : 'Account Verified, you can log in.'}</h2>
      </div>
    </div>
  );
}
