import { createContext } from 'react';
import { User } from './ChatContext';
//import Peer from 'peerjs';

export type RemotePeerVideoCallingStatus = {
  isCalling: boolean;
  peer: User;
  roomId: string;
  flag: 'video' | 'voice' | null;
};
const ChatRoomContext = createContext({
  // start;

  // remote video calling status
  remotePeerCalling: {} as RemotePeerVideoCallingStatus,
  setRemotePeerCalling: (value: RemotePeerVideoCallingStatus) => {},

  //   show or hide video displayer
  showVideoCallDisplayer: false,
  setShowVideoCallDisplayer: (value: boolean) => {},

  // show or hide audio displayer
  showVoiceCallDisplayer: false,
  setShowVoiceCallDisplayer: (value: boolean) => {},

  //   local user video stream
  localUserVideoStream: {} as MediaStream | null,
  setLocalUserVideoStream: (value: MediaStream | null) => {},

  // caller
  caller: {} as User,
  setCaller: (value: User) => {},

  //   has the local user answered the call
  isCallAnswered: false,
  setIsCallAnswered: (value: boolean) => {},

  // set local peer
  localPeer: null,
  setLocalPeer: (value: any) => {},

  // end;
});
export default ChatRoomContext;
/*
  const [localPeer, setLocalPeer] = useState<Peer | null>(null);


*/
