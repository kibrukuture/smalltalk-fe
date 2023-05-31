'use client';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { User } from '../ChatContext';
import { hostedAt } from '../util.fns';

export default function AccountVerification() {
  const [code, setCode] = useState('');
  const [accountVerified, setAccountVerified] = useState(false);

  // router
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem('user')) navigate('/chat');
    if (!localStorage.getItem('user-signup')) navigate('/');
  }, []);

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.trim() === '') return;

    let formatedCode = code.replace(/\s/g, '');

    const userSignup = JSON.parse(localStorage.getItem('user-signup') as string) as User | null;

    console.log(userSignup);

    if (userSignup) {
      const res = await fetch(`${hostedAt()}/api/tolbel-account-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formatedCode,
          email: userSignup.email,
          userName: userSignup.userName,
        }),
      });

      const data = await res.json();

      console.log(data);

      if (data.status === 'ok') {
        setAccountVerified(true);
        setTimeout(() => {
          navigate('/signin');
          localStorage.removeItem('user-signup');
        }, 4000);
      } else alert('Invalid Code, please try again.');
    }
  };

  return (
    <div className='h-screen gap-md md:gap-lg flex items-center justify-center mx-auto w-[70%] md:w-[50%] lg:w-[35%] '>
      <div className='flex flex-col gap-sm grow'>
        <h1 className='text-3xl font-bold text-teal-400 font-code'>tolbel</h1>
        <form onSubmit={onFormSubmit} className='flex flex-col gap-sm font-mono text-sm '>
          <h2 className='my-md italic'>Please enter the code sent to your email</h2>
          <div className='flex flex-col gap-sm'>
            <label aria-label='sms'>
              <input autoComplete='off' placeholder='864 947' value={code} onChange={(e) => setCode(e.target.value)} id='sms' type='text' className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500' />
            </label>
          </div>
          <div className='flex justify-end'>
            <button className='border-gray-100 border-2 hover:border-teal-400 outline-none   transition duration-500 block text-skin-base px-xl py-md rounded-md bg-skin-fill ' type='submit'>
              Verify
            </button>
          </div>
          <p className=' '>
            <Link to='/' aria-label='Home' className='underline underline-offset-1 hover:text-teal-400 '>
              Visit Home
            </Link>
          </p>
        </form>
      </div>

      {accountVerified && <div className='fixed w-fit p-lg flex items-center text-green-500 bg-green-200 rounded-md justify-center bottom-2 right-2'>Account Verified, you can log in.</div>}
    </div>
  );
}
