import { useEffect, useRef } from 'react';
import { RiPlayFill } from 'react-icons/ri';
import { Attachment } from '../../../ChatContext';
import { formatFileSize, formatTime } from '../../../util.fns';
import MediaPlayer from '../../MediaPlayer';

export default function VideoFile({ attachment }: { attachment: Attachment }) {
  const vidRef = useRef(null);

  useEffect(() => {}, []);

  return (
    <>
      <div className='w-full relative  flex-col  rounded-md flex gap-xs items-center'>
        {/* <video className='rounded-md' src={attachment.url} width={'100%'} height={'100%'} controls={true}></video> */}
        <MediaPlayer url={attachment.url} type='video' />
      </div>
    </>
  );
}
