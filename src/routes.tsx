import { Routes, Route } from 'react-router-dom';
import EndToEnd from './components/doc/EndToEnd';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Chat from './chat/page';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<SignIn />} />
      <Route path='/signup' element={<SignUp />} />
      <Route path='/chat' element={<Chat />} />
      <Route path='/doc/end-to-end' element={<EndToEnd />} />
      {/* <Route path='/*' element={<div className='flex hover h-screen items-center justify-center'>404 | We couldn't find that page</div>} /> */}
    </Routes>
  );
}
