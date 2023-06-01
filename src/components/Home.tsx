import { Link } from 'react-router-dom';
import { RiGithubLine } from 'react-icons/ri';
export default function Home() {
  return (
    <div className='container h-screen  font-mono w-9/12 mx-auto p-xl flex flex-col  '>
      <nav className='flex items-center justify-between  '>
        <Link to='/' className='text-teal-500 text-xl'>
          <h1 className='text-2xl relative'>
            tolbel<span className='text-red-300 text-xs absolute transform translate-x-1 -translate-y-1 '>[alpha]</span>
          </h1>
        </Link>

        <Link to='/signin' className='text-teal-500 p-lg bg-teal-100 rounded-md '>
          SignIn
        </Link>
      </nav>

      <main className='w-9/12  mx-auto grow flex flex-col items-center justify-center'>
        <p className='text-xs bg-teal-200 text-teal-500 p-lg rounded-full bg-opacity-50 bg-blur-sm mb-5'>tolbel is still in alpha</p>
        <p className='text-5xl font-bolder flex flex-col'>
          <span className='text-2xl'>tolbel</span> <span className='font-black'>Connect, Communicate, Share</span>{' '}
        </p>
      </main>
      <footer className='w-9/12 text-xs mx-auto flex flex-col md:flex-row  items-center gap-lg'>
        <p> © {new Date().getFullYear()} tolbel. All rights reserved</p>
        <a target='_blank' rel='noopener noreferrer' className=' flex items-center gap-sm ' href='https://github.com/kibrukuture/tolbel-express-server'>
          <RiGithubLine />
          Check out the source code on Github
        </a>
      </footer>
    </div>
  );
}
