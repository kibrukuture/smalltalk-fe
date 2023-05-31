'use client';
import { useState, useContext } from 'react';
import { ChatContext, User } from '../ChatContext';
// import { isLoggedIn } from '../util.fns';
// import { checkUsernameValidity, checkPasswordValidity } from '../util.fns';
import { RiCloseLine, RiCheckLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';

export default function SignUp() {
  //state
  const [user, setUser] = useState<User>({ email: '', password: '', name: '', userName: '' }),
    [passwordFocused, setPasswordFocused] = useState(false);

  const { onUserSignUp, error } = useContext(ChatContext); // consume context

  const onFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (user.email.trim() === '' || user.password.trim() === '' || user.name.trim() === '' || user.userName === '') return;

    // if (!checkuserNameValidity(userName)) {
    //   setError({
    //     signIn: '',
    //     signUp: 'userName must be at least 3 characters long and can only contain letters, numbers, and underscores.',
    //   });
    //   return;
    // }
    // if (!checkPasswordValidity(password)) {
    //   setError({
    //     signIn: '',
    //     signUp: 'The password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and may contain special characters.',
    //   });
    //   return;
    // }
    localStorage.setItem('user-signup', JSON.stringify(user));
    onUserSignUp(user);
    // reset form
  };

  return (
    <div className='h-screen gap-md md:gap-lg flex items-center justify-center mx-auto w-[70%] md:w-[50%] lg:w-[35%]'>
      <div className='flex flex-col gap-sm grow'>
        <h1 className='text-3xl font-bold text-teal-400 font-code'>tolbel</h1>
        <form onSubmit={onFormSubmit} className='flex flex-col gap-sm font-mono text-sm '>
          <h2 className='my-md italic'>Sign Up</h2>
          <div className='flex flex-col gap-sm'>
            <label aria-label='Name'>
              <input
                autoComplete='on'
                placeholder='Name'
                value={user.name}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                id='name'
                type='text'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
          </div>
          <div className='flex flex-col gap-sm'>
            <label aria-label='userName'>
              <input
                autoComplete='on'
                placeholder='userName'
                value={user.userName}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
                id='userName'
                type='text'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
          </div>
          <div className='flex flex-col gap-sm'>
            <label aria-label='Email'>
              <input
                autoComplete='on'
                placeholder='Email'
                value={user.email}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                id='email'
                type='email'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
          </div>
          <div className='flex flex-col gap-sm relative'>
            <label aria-label='Password' className='relative'>
              <input
                type='password'
                autoComplete='on'
                onFocus={() => setPasswordFocused(true)}
                onBlur={() => setPasswordFocused(false)}
                placeholder='Password'
                value={user.password}
                onChange={(e) =>
                  setUser((prev) => ({
                    ...prev,
                    password: e.target.value,
                  }))
                }
                id='password'
                className='w-full  p-lg rounded-md bg-skin-fill text-skin-base border-2 border-gray-100 outline-none focus:border-teal-400 focus:outline-none transition duration-500'
              />
            </label>
            {passwordFocused && (
              <div className={` ${passwordFocused ? '' : 'hidden'} ${passwordFocused ? 'animate-slideIn' : 'animate-slideOut'}   absolulte -bottom-1 left-0 z-20  rounded-md  p-lg font-mono text-skin-muted text-xs flex flex-col gap-xs  shadow-liftup`}>
                <p className='flex items-center gap-xs'>
                  {user.password.length >= 8 ? <RiCheckLine className='text-teal-400' /> : <RiCloseLine className='text-red-400' />}
                  The password must be at least 8 characters long.
                </p>
                <p className='flex items-center gap-xs'>
                  {/[A-Z]/.test(user.password) ? <RiCheckLine className='text-teal-400' /> : <RiCloseLine className='text-red-400' />}
                  The password must contain at least one uppercase letter
                </p>
                <p className='flex items-center gap-xs'>
                  {/[a-z]/.test(user.password) ? <RiCheckLine className='text-teal-400' /> : <RiCloseLine className='text-red-400' />}
                  The password must contain at least one lowercase letter
                </p>
                <p className='flex items-center gap-xs'>
                  {/[0-9]/.test(user.password) ? <RiCheckLine className='text-teal-400' /> : <RiCloseLine className='text-red-400' />}
                  The password must contain at least one number
                </p>
                <p className='flex items-center gap-xs'>
                  {/[$@#!%*?&]/.test(user.password) ? <RiCheckLine className='text-teal-400' /> : <RiCloseLine className='text-red-400' />}
                  The password must contain special characters :@$#!%*?&
                </p>
              </div>
            )}
          </div>
          <div className='flex justify-end'>
            <button className=' border-gray-100 border-2 hover:border-teal-400 outline-none   transition duration-500 block text-skin-base px-xl py-md rounded-md bg-skin-fill ' type='submit'>
              Sign Up
            </button>
          </div>
          {
            // error
            error.signUp && (
              <div className='bg-red-200 text-skin-base p-xl rounded-md break-all'>
                <p className='text-red-400'>{error.signUp}</p>
              </div>
            )
          }
          <p>
            Already have a
            <strong className='px-md'>
              <i>tolbel</i>
            </strong>
            account?
            <br />
            <Link to='/signin' className='underline underline-offset-1 hover:text-teal-400 '>
              Sign In
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
