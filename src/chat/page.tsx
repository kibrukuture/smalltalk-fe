'use client';
import { useEffect, useContext, useRef, useState } from 'react';
import { ChatContext } from '../ChatContext';
import ChatRoomContext, { RemotePeerVideoCallingStatus } from '../ChatRoomContext';
import ChatBox from '../components/ChatBox';
import Bar from '../components/Bar';
import ConversationBox from '../components/ConversationBox';
import UserDetail from '../components/UserDetail';
import socket from '../socket.config';
import Profile from '../components/Profile';
import Notificstion from '../components/Notification';
import Settings from '../components/Settings';
// import { useRouter } from 'next/navigation';
import { useNavigate } from 'react-router-dom';
import { addNewMessage, deleteConversation } from '../util.fns';
import { User } from '../ChatContext';
import Calling from '../components/Calling';
// import Peer from 'peerjs';

// select tab
const tab: any = {
  chat: <ConversationBox />,
  profile: <Profile />,
  notification: <Notificstion />,
  setting: <Settings />,
};

export default function Chat() {
  // local storage
  const user = JSON.parse(localStorage.getItem('user') as string) as User;

  // state
  const [currentInnerWidth, setCurrentInnerWidth] = useState<number>(0);
  const [remotePeerCalling, setRemotePeerCalling] = useState({} as RemotePeerVideoCallingStatus);
  const [showVideoCallDisplayer, setShowVideoCallDisplayer] = useState(false);
  const [showVoiceCallDisplayer, setShowVoiceCallDisplayer] = useState(false);
  const [localUserVideoStream, setLocalUserVideoStream] = useState<MediaStream | null>(null);
  const [remoteUserVideoStream, setRemoteUserVideoStream] = useState<MediaStream | null>(null);
  const [caller, setCaller] = useState({} as User);
  const [isCallAnswered, setIsCallAnswered] = useState(false);
  const [localPeer, setLocalPeer] = useState(null);

  //consume context
  const { rooms, isChatRoomTapped, setRooms, currentOpenChatId, setCurrentOpenChatId, typing, setTyping, setIsAllChatsLoading, isAllChatsLoading, setUser, barCurrentTab, setFriendRequests, friendRequests, setIsUserNotAbleToSendFriendRequest } = useContext(ChatContext);

  // router
  const navigate = useNavigate();

  // ref
  const notificationRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // on reload set user data.
    setUser(user);

    // only run in browser.
    // listen to window resize.
    let onResize = () => {
      setCurrentInnerWidth(typeof window !== 'undefined' ? window.innerWidth : 0);
    };
    if (typeof window !== 'undefined') {
      setCurrentInnerWidth(window.innerWidth); // set current inner width.

      window.addEventListener('resize', onResize);
    }
    // load all chats.
    setIsAllChatsLoading(true);
    fetch(`http://localhost:4040/api/loadchats/${JSON.parse(localStorage.getItem('user') as string).userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIsAllChatsLoading(false);
        if (data.status === 'ok') {
          inititateRoom(data, setRooms);
        } else {
        }
      });

    // fetch all friend request.
    fetch(`http://localhost:4040/api/user/friend-requests/${JSON.parse(localStorage.getItem('user') as string).userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // "Authorization": `Bearer ${token}`
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFriendRequests(data.user); // users wanting requst.
      });

    // on socket connect
    socket.on('connect', () => {
      const token = localStorage.getItem('logInToken');
      if (!token) return navigate('/');

      const user = JSON.parse(localStorage.getItem('user') as string);

      // authenticate user( emit)
      socket.emit('AuthenticateUser', {
        token,
        user,
      });

      // set up user or redirect to login page.
      socket.on('AuthenticateUser', (data) => {
        if (data.status === 'ok') {
          // user is authenticated & set up
          socket.emit('SetupUser', data.user);
        } else {
          // user is not authenticated
          navigate('/');
        }
      });

      // when a user joins online
      socket.on('JoinUserOnline', (data) => console.log('JoinUserOnline', data));

      // listen for friend request
      socket.on('FriendRequestAccepted', (data) => {
        inititateRoom(data, setRooms);
        setCurrentOpenChatId(data.roomId);
      });

      // listen for a new message
      socket.on('ExchangeChatMessage', (data) => {
        console.log('a new message...', data);
        const { message, roomId } = data;
        //update rooms with new message
        addNewMessage(roomId, message, setRooms);
      });

      // user is online, push notification.
      socket.on('PushFriendRequestNotification', (data) => {
        setFriendRequests([...friendRequests, data]);
        if (notificationRef.current) notificationRef.current.play();
      });
    });

    // on socket disconnect try to reconnect
    socket.on('disconnect', () => {
      socket.connect();
    });

    // incoming video call
    socket.on('IncomingCall', (data) => {
      const { caller, roomId, friend, flag } = data;
      // const peer = new Peer(user.userId!, { host: '/', port: 3001 });
      // setLocalPeer(peer);
      // setShowVideoCallDisplayer(true);

      setRemotePeerCalling({
        isCalling: true,
        peer: caller,
        roomId,
        flag,
      });
    });

    // video call rejected
    socket.on('CallRejected', (data) => {
      const { caller, roomId, friend } = data;

      console.log('Video call rejected,', localUserVideoStream);
      setShowVideoCallDisplayer(false);
      // localUserVideoStream && localUserVideoStream.getTracks().forEach((track) => track.stop());
      // setLocalUserVideoStream(undefined);

      console.log('local video stream: ', localUserVideoStream && localUserVideoStream.getTracks());
    });

    socket.on('onDeleteConversation', (data) => {
      const { messageId, roomId, deletedBy, friend } = data;
      // roomId: string, messageId: string, setRooms: (rooms: Map<string, Room>) => void
      console.log('onDeleteConversation', data);

      deleteConversation(roomId, messageId, setRooms);
    });

    // remote peer video call ended
    // socket.on('RemotePeerCallEnd', (data) => {
    //   const { callEndedBy, roomId, peer } = data;

    //   localPeer!.destroy(); // distory localPeer.
    //   console.log(localPeer?.destroyed, 'local peer destroyed');
    //   // setLocalPeer(null);
    //   setShowVideoCallDisplayer(false);
    // });

    // console.log('In chat page: localPeer', localPeer);
    return () => {
      // socket.off('connect');
      window.removeEventListener('resize', onResize);

      // unmount socket listeners
      // console.log('I am being unmounted');
    };
  }, []);

  // console.log(':Component Rendered:', '# of rooms are: ', rooms.get(currentOpenChatId)?.messages.length);
  if (!rooms.size && isAllChatsLoading) return <div className='h-screen w-full bg-black flex items-center justify-center text-skin-base text-2xl font-bold text-center  '>loading</div>;

  // console.log(rooms);
  return (
    <ChatRoomContext.Provider value={{ remotePeerCalling, setRemotePeerCalling, showVideoCallDisplayer, setShowVideoCallDisplayer, localUserVideoStream, setLocalUserVideoStream, caller, setCaller, isCallAnswered, setIsCallAnswered, localPeer, setLocalPeer, showVoiceCallDisplayer, setShowVoiceCallDisplayer }}>
      <div className='max-h-screen h-screen w-full flex flex-col-reverse md:flex md:flex-row'>
        {/* medium and large screen */}
        {currentInnerWidth > 768 && <Bar />}
        {currentInnerWidth > 768 && <div className=' h-screen max-h-screen flex flex-col gap-xs bg-skin-muted md:min-w-[30%] lg:min-w-[20%]'>{tab[barCurrentTab]}</div>}
        {currentInnerWidth > 768 && <ChatBox />}

        {/* on smalll screen */}
        {currentInnerWidth <= 768 && !isChatRoomTapped && <Bar />}
        {currentInnerWidth <= 768 && !isChatRoomTapped && <div className=' h-screen max-h-screen flex flex-col gap-xs bg-skin-muted md:min-w-[30%] lg:min-w-[20%]'>{tab[barCurrentTab]}</div>}
        {currentInnerWidth <= 768 && isChatRoomTapped && <ChatBox />}
        {false && <UserDetail />}
        <audio ref={notificationRef} src='/sound-effects/notification.wav' />

        {/* remote peer is video-calling */}
        {remotePeerCalling.isCalling && <Calling />}
      </div>
    </ChatRoomContext.Provider>
  );
}
//
function inititateRoom(data: any, setRooms: any) {
  const map = new Map();
  data.rooms.forEach((room: any) => {
    map.set(room.roomId, {
      roomId: room.roomId,
      userOneId: room.userOneId,
      userTwoId: room.userTwoId,
      createdAt: room.createdAt,
      friend: room.user,
      messages: room.message,
    });
  });
  setRooms(map);
}
