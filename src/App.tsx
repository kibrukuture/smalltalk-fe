'use client';
import './index.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import { useRouter } from 'next/navigation';
import AlertMessage from './components/AlertMessage';
import { ChatContext, LastSeen, User, Alert, UserProfile, Room, Error, SearchResult, Chats, AllChats, Typing, Tab, Theme } from './ChatContext';
import { RiCloseFill } from 'react-icons/ri';
import AppRoutes from './routes';

export default function RootLayout() {
  // all states
  const [error, setError] = useState<Error>({
      signIn: '',
      signUp: '',
    }), //error
    [alert, setAlert] = useState<Alert>({
      show: false,
      message: '',
      title: '',
      type: 'error',
    }), //alert
    [currentOpenChatId, setCurrentOpenChatId] = useState<string>(''),
    [chatFriends, setChatFriends] = useState([] as SearchResult[]),
    [chats, setChats] = useState([] as Chats[]),
    [allChats, setAllChats] = useState([] as AllChats[]),
    [typing, setTyping] = useState([] as Typing[]),
    [isAllChatsLoading, setIsAllChatsLoading] = useState(false),
    [barCurrentTab, setBarCurrentTab] = useState<Tab>('chat'),
    [wallpaper, setWallpaper] = useState(''),
    [theme, setTheme] = useState('light' as Theme),
    [gallery, setGallery] = useState([] as string[]),
    [friendRequests, setFriendRequests] = useState([] as User[]),
    [isUserNotAbleToSendFriendRequest, setIsUserNotAbleToSendFriendRequest] = useState(false),
    [lastSeen, setLastSeen] = useState({} as LastSeen),
    [userProfile, setUserProfile] = useState({ url: '' } as UserProfile),
    [user, setUser] = useState({} as User),
    [rooms, setRooms] = useState(new Map() as Map<string, Room>),
    [isChatRoomTapped, setIsChatRoomTapped] = useState(false);

  // router
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const onUserSignIn = async (usr: { email: string; password: string }) => {
    const data = await handleFetch('http://localhost:4040/signin', 'POST', usr);

    if (data.status === 'ok') {
      console.log(data);
      //set token
      localStorage.setItem('logInToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      setUser(data.user); // set user
      setAlert({
        show: true,
        message: 'Welcome back!',
        title: 'Logged In',
        type: 'success',
      });
      // after 4 seconds, remove alert
      setTimeout(() => {
        setAlert({
          show: false,
          message: '',
          title: '',
          type: '',
        });
      }, 10000);

      setError({
        signIn: '',
        signUp: '',
      });
      // success sign in
      navigate('/chat');
    } else setError((prev) => ({ ...prev, signIn: data.message })); // could not sign in
  };

  const onUserSignUp = async (usr: User) => {
    //{ email: '', password: '', name: '', userName: '' }
    const data = await handleFetch('http://localhost:4040/signup', 'POST', usr);
    if (data.status === 'ok') {
      setError({
        signIn: '',
        signUp: '',
      });
      // success alert
      setAlert({
        show: true,
        message: 'You have successfully signed up!',
        title: 'Success',
        type: 'success',
      });
      // after 4 seconds, remove alert
      setTimeout(() => {
        setAlert({
          show: false,
          message: '',
          title: '',
          type: '',
        });
      }, 10000);
      // success sign in
      navigate('/');
    } else setError((prev) => ({ ...prev, signUp: data.message })); // could not sign in
  };

  const onAlertClose = () => {
    setAlert({
      show: false,
      message: '',
      title: '',
      type: 'error',
    });
  };

  // console.log('all rooms: ', rooms, currentOpenChatId);
  return (
    <ChatContext.Provider
      value={{
        onUserSignIn,
        onUserSignUp,
        setError,
        setCurrentOpenChatId,
        setChatFriends,
        setChats,
        setAllChats,
        setTyping,
        setIsAllChatsLoading,
        setBarCurrentTab,
        setWallpaper,
        setTheme,
        setGallery,
        setFriendRequests,
        setIsUserNotAbleToSendFriendRequest,
        setLastSeen,
        setUserProfile,
        setUser,
        setAlert,
        setRooms,
        setIsChatRoomTapped,
        isChatRoomTapped,
        rooms,
        alert,
        user,
        userProfile,
        lastSeen,
        isUserNotAbleToSendFriendRequest,
        friendRequests,
        wallpaper,
        theme,
        gallery,
        barCurrentTab,
        isAllChatsLoading,
        typing,
        allChats,
        chatFriends,
        chats,
        error,
        currentOpenChatId,
      }}
    >
      <AppRoutes />
      {alert.show && <AlertMessage alert={alert} onAlertClose={onAlertClose} />}
      {isUserNotAbleToSendFriendRequest && (
        <div className='font-mono fixed p-lg w-fit bottom-2 right-2 z-50 bg-red-200 text-red-400 rounded'>
          <div className='h-full w-2 bg-red-500 '></div>
          <div className='text-sm p-lg'>
            <p>Error</p>
            <p>You can not send friend request to this person.</p>
          </div>
          <button onClick={() => setIsUserNotAbleToSendFriendRequest(false)} className='p-lg absolute top-2 right-2 text-white'>
            <RiCloseFill />
          </button>
        </div>
      )}
    </ChatContext.Provider>
  );
}

const handleFetch = async (
  url: string,
  method: string,
  body: {
    email: string;
    password: string;
  },
) => {
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return data;
};
