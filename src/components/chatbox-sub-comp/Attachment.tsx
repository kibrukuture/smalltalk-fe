import { useEffect, useRef, useState } from 'react';
import BinaryFileModal from './BinaryFileModal';
import { RiFileLine, RiImageLine } from 'react-icons/ri';
import { BinFile } from '@/app/ChatContext';

export default function Attachment({ setShowAttachment, setBinFile, setShowBinaryFileModal, setBinFileLoading }: { setShowAttachment: React.Dispatch<React.SetStateAction<boolean>>; setBinFile: React.Dispatch<React.SetStateAction<BinFile>>; setShowBinaryFileModal: React.Dispatch<React.SetStateAction<boolean>>; setBinFileLoading: React.Dispatch<React.SetStateAction<boolean>> }) {
  // const [showBinaryFileModal, setShowBinaryFileModal] = useState(false);
  // const [binFile, setBinFile] = useState({} as BinFile);

  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;
  const binaryFileFromLocalFs = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    function onClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        setShowAttachment(false);
      }
    }

    document.addEventListener('mousedown', onClickOutside);
    return () => {
      document.removeEventListener('mousedown', onClickOutside);
    };
  }, [ref]);

  const getMimeExtension = (type: string) => type.split('/')[1];

  // file type: 'image' | 'video' | 'audio' | 'document'

  const getFileType = (type: string) => {
    if (['image', 'video', 'audio'].includes(type.split('/')[0])) return type.split('/')[0];
    return 'document';
  };

  // handlers
  const onAttachment = (e: React.MouseEvent<HTMLButtonElement>, type: string) => {
    e.preventDefault();
    //  hanlle photos, videos, or audios

    if (type === 'photovideoaudio') {
      binaryFileFromLocalFs.current.setAttribute('accept', 'image/*,video/*,audio/*');
    } else if (type === 'document') {
      binaryFileFromLocalFs.current.setAttribute('accept', 'text/*, application/*');
    }

    binaryFileFromLocalFs.current.addEventListener('change', (e) => {
      const file = e.target.files[0];
      setBinFileLoading(true);

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.addEventListener('progress', (e) => {
        console.log((e.loaded / e.total) * 100, '% loaded');
      });

      reader.addEventListener('load', async (e) => {
        setBinFile({
          name: file.name,
          type: getFileType(file.type),
          size: file.size,
          data: reader.result as string,
          ext: getMimeExtension(file.type),
          dur: file.type.startsWith('audio') || file.type.startsWith('video') ? await getMediaDuration(file) : 0,
        });
        setShowBinaryFileModal(true);
        setBinFileLoading(false);
        console.log(reader.result);
      });
      console.log(file);
    });
    binaryFileFromLocalFs.current.click();

    setShowAttachment(false);
  };

  return (
    <div ref={ref} className='bg-skin-muted text-skin-base absolute transform -translate-y-full -translate-x-1/2  right-0 rounded-md flex flex-col '>
      <button onClick={(e) => onAttachment(e, 'photovideoaudio')} className='rounded-md flex items-center gap-sm p-md hover:bg-teal-300 w-full'>
        <RiImageLine />
        <p>Photo or video</p>
      </button>
      <button onClick={(e) => onAttachment(e, 'document')} className='rounded-md flex items-center gap-sm p-md hover:bg-teal-300 w-full'>
        <RiFileLine />
        <p>Document</p>
      </button>

      {/* invisible input type of file */}
      <input ref={binaryFileFromLocalFs} type='file' name='file' id='file' className='invisible w-0 h-0' />
    </div>
  );
}

function getMediaDuration(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      const mediaElement = document.createElement(file.type.startsWith('audio') ? 'audio' : 'video');
      mediaElement.preload = 'metadata';

      mediaElement.onloadedmetadata = function () {
        window.URL.revokeObjectURL(mediaElement.src);
        resolve(mediaElement.duration);
      };

      mediaElement.onerror = function () {
        reject(new Error('Error occurred while getting media duration.'));
      };

      mediaElement.src = URL.createObjectURL(file);
    };

    reader.onerror = function () {
      reject(new Error('Error occurred while reading the file.'));
    };

    reader.readAsDataURL(file);
  });
}
