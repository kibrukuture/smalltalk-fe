import { useContext } from 'react';
import { ChatContext } from '../ChatContext';
// import { ContextMenu, ContextMenuItem } from 'rctx-contextmenu';
import { Menu, Item, Separator, Submenu, useContextMenu } from 'react-contexify';
import { RiUser6Line, RiEraserLine, RiCloseLine, RiDeleteBinLine } from 'react-icons/ri';

export default function ChatBoxContextMenu() {
  // use context
  const { currentOpenChatId, setCurrentOpenChatId } = useContext(ChatContext);

  // hanlder

  const onChatBoxContextMenu = (flag: string) => {
    switch (flag) {
      case 'contactInfo':
        break;

      case 'clearChat':
        break;

      case 'closeChat':
        setCurrentOpenChatId('');
        break;

      case 'deleteChat':
        break;

      default:
        break;
    }
  };
  return (
    <Menu id={currentOpenChatId} theme='light' animation='scale'>
      <div className='h-43   flex   gap-sm max-w-fit items-start font-mono  text-sm z-50    '>
        <div className='h-full p-lg  flex flex-col   rounded'>
          <Item onClick={() => onChatBoxContextMenu('contactInfo')} className='grow'>
            <button className='flex h-full   w-full items-center grow  gap-md'>
              <RiUser6Line />
              <span>Contact Info</span>
            </button>
          </Item>
          <Item onClick={() => onChatBoxContextMenu('clearChat')} className='grow'>
            <button className='flex h-full  w-full items-center  gap-md'>
              <RiEraserLine />
              <span>Clear Chats</span>
            </button>
          </Item>
          <Item onClick={() => onChatBoxContextMenu('closeChat')} className='grow'>
            <button className='flex h-full  w-full items-center  gap-md'>
              <RiCloseLine />
              <span>Close Chats</span>
            </button>
          </Item>
          <Item onClick={() => onChatBoxContextMenu('deleteChat')} className='grow'>
            <button className='flex h-full   w-full items-center  gap-md'>
              <RiDeleteBinLine />

              <span>Delete Chats</span>
            </button>
          </Item>
        </div>
      </div>
    </Menu>
  );
}
