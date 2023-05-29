import { useRef, useEffect, useContext } from 'react';
import { RiPhoneFill, RiChatVoiceFill, RiVideoChatFill } from 'react-icons/ri';
import { User } from '@/app/ChatContext';
import Draggable from 'react-draggable';
import socket from '@/app/socket.config';
import ChatRoomContext, { RemotePeerVideoCallingStatus } from '@/app/ChatRoomContext';
import { ChatContext } from '@/app/ChatContext';
import Peer from 'peerjs';

const user = JSON.parse(localStorage.getItem('user')!) as User;

export default function Calling() {
  // consume context
  const { setIsCallAnswered, remotePeerCalling, setRemotePeerCalling, setShowVideoCallDisplayer, showVideoCallDisplayer, localPeer, setLocalPeer, setShowVoiceCallDisplayer, showVoiceCallDisplayer } = useContext(ChatRoomContext);
  const { setCurrentOpenChatId } = useContext(ChatContext);
  // ref to audio
  const playAudioRef = useRef<HTMLButtonElement>(null);
  const incomingCallAudioRef = useRef<HTMLAudioElement>(null);
  // const invisibleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (incomingCallAudioRef.current && playAudioRef.current) {
        const btn = playAudioRef.current;

        btn.addEventListener('click', () => {
          incomingCallAudioRef.current!.play();
        });
        btn.click();
      }
      socket.on('RemotePeerCallEnd', (data) => {
        const { roomId } = data;

        // remote peer starts calling & closes
        setRemotePeerCalling({
          isCalling: false,
          peer: {} as User,
          roomId: '',
          flag: null,
        });
      });
    }
  }, []);

  // call accepted
  const onAcceptCall = () => {
    remotePeerCalling.flag === 'video' ? setShowVideoCallDisplayer(true) : setShowVoiceCallDisplayer(true);
    const peer = new Peer(user.userId!, { host: '/', port: 3001 });
    setLocalPeer(peer);
    setCurrentOpenChatId(remotePeerCalling.roomId);

    // // console.log('accepted call');
    // const peer = new Peer(user.userId!, {
    //   host: '/',
    //   port: 3001,
    // });
    // setShowVideoCallDisplayer(true);
    // setLocalPeer(peer);
    // setCurrentOpenChatId(remotePeerCalling.roomId);
    // // setShowVideoCallDisplayer(true);
    // setIsCallAnswered(true);
    // //
    socket.emit('CallAccepted', {
      roomId: remotePeerCalling.roomId,
      caller: remotePeerCalling.peer,
      friend: user,
    });
    setRemotePeerCalling({
      isCalling: false,
      peer: {} as User,
      roomId: '',
      flag: null,
    });
  };

  // call rejected
  const onRejectCall = () => {
    // console.log('rejected call call');
    // setShowVideoCallDisplayer(false);
    // setIsCallAnswered(false);
    // // close the remote peer video stream
    socket.emit('CallRejected', {
      roomId: remotePeerCalling.roomId,
      caller: remotePeerCalling.peer,
      friend: user,
    });
    setRemotePeerCalling({
      isCalling: false,
      peer: {} as User,
      roomId: '',
      flag: null,
    });
  };
  return (
    <Draggable>
      {/* <button className='sr-only' ref={invisibleBtnRef}></button> */}
      <div className='z-50 cursor-auto  flex gap-sm rounded-full items-center bg-black text-skin-muted fixed top-5 right-5 p-lg '>
        <div className='relative'>
          <button className='relative overflow-hidden text-skin-muted w-8 h-8 shadow-default flex items-center justify-center   rounded-full '>
            <img className='object-cover h-12 w-12 ' src={remotePeerCalling.peer.avatarUrl} alt='' />
          </button>
        </div>
        <div className='flex flex-col '>
          <p>{remotePeerCalling.peer.name}</p>
          <p className='text-xs font-mono flex items-center gap-xs '>
            <span>{remotePeerCalling.flag === 'video' ? <RiVideoChatFill size={15} /> : <RiChatVoiceFill size={15} />}</span>
            <span> {remotePeerCalling.flag === 'video' ? 'Video' : 'Voice'} Call </span>
            <span className='relative flex h-3 w-3'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75'></span>
              <span className='relative inline-flex rounded-full h-3 w-3 bg-sky-500'></span>
            </span>
          </p>
        </div>
        <div className='flex gap-sm items-center '>
          <button onClick={onRejectCall} title='close' className='bg-red-500 text-white h-8 w-8 rounded-full flex items-center justify-center p-sm'>
            <span className='transform rotate-[135deg] cursor-pointer'>
              <RiPhoneFill />
            </span>
          </button>
          <button onClick={onAcceptCall} title='answer' className='bg-green-500 text-white h-8 w-8 rounded-full flex items-center justify-center p-sm'>
            <RiPhoneFill className='cursor-pointer' />
          </button>
        </div>
        {/* incoming call audio  */}
        <button ref={playAudioRef} className='sr-only'></button>
        <audio ref={incomingCallAudioRef} loop={true} src='/sound-effects/incoming-call.wav' preload='auto' />
      </div>
    </Draggable>
  );
}
