import { Link } from 'react-router-dom';
export default function Home() {
  return (
    <div className='flex h-screen items-center justify-center font-mono flex-col gap-md'>
      <h1 className='text-xl'>Welcome to tolbel</h1>
      <p>To continue messaging please login or register</p>
      <p>
        <Link to='/signin'>SignIn</Link> | <Link to='/signup'>Signup</Link>
      </p>
    </div>
  );
}
