import React, { useState, useEffect, useRef, RefObject } from 'react';
import { RiPlayMiniFill, RiPauseMiniFill } from 'react-icons/ri';

export default function MediaPlayer({ url, type }: { url: string; type: string }) {
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [playerVisible, setPlayerVisible] = useState(false);

  const barRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const onProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const clickOffsetX = e.pageX - progressBar.getBoundingClientRect().left;
    const progressBarWidth = progressBar.offsetWidth;
    const newProgress = (clickOffsetX / progressBarWidth) * 100;

    const media = type === 'audio' ? audioRef.current : videoRef.current;
    if (media) {
      let currentTime = (newProgress / 100) * media.duration;
      media.currentTime = currentTime;
      setCurrentTime(currentTime);
      // setPaused(false);
      // media.play();
    }
    setProgress(newProgress);
  };

  useEffect(() => {
    const media = type === 'audio' ? audioRef.current : videoRef.current;
    const parentDiv = barRef.current;

    if (media && parentDiv) {
      media.addEventListener('timeupdate', () => {
        setCurrentTime(media.currentTime);

        let width = parentDiv.getBoundingClientRect()!.width;
        setProgress(media.currentTime * width);

        const prog = width * (media.currentTime / media.duration);
        setProgress((prog / width) * 100);
      });

      media.addEventListener('ended', () => {
        setCurrentTime(0);
        media.currentTime = 0;
        setPaused(true);
      });
    }

    const onKeyDown = (e: KeyboardEvent) => {
      let tempProgress;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setProgress((prevProgress) => {
          tempProgress = Math.min(prevProgress + 2, 100);
          fn(tempProgress, media);
          return tempProgress;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setProgress((prevProgress) => {
          tempProgress = Math.max(prevProgress - 2, 0);
          fn(tempProgress, media);
          return tempProgress;
        });
      }
      function fn(progress: number, media: HTMLAudioElement | null) {
        if (media) {
          let currentTime = (progress / 100) * media.duration;
          media.currentTime = currentTime;
          setCurrentTime(currentTime);
          //setPaused(false);
          // media.play();
        }
      }
    };

    if (parentDiv) {
      parentDiv.addEventListener('keydown', onKeyDown);
    }

    return () => {
      parentDiv && parentDiv.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  const onPlayMedia = (e: React.MouseEvent<HTMLButtonElement>) => {
    setPaused(!paused);
    const media = type === 'audio' ? audioRef.current : videoRef.current;
    if (paused) media!.play();
    else media!.pause();
  };

  const progressBarStyles = {
    width: '100%',
    height: '5px',
    overflow: 'hidden',
    cursor: 'pointer',
    background: 'teal',
    display: 'flex',
    alignItems: 'center',
  };

  const progressFillStyles = {
    height: '100%',
    backgroundColor: 'wheat',
    width: `${progress}%`,
    transition: 'width 0.3s ease-in-out',
    borderRadius: 'inherit',
    margin: 'auto 0',
  };

  return (
    <div className='p-2 rounded-md min-w-[200px]'>
      {type === 'audio' ? <audio src={url} ref={audioRef} /> : <video className='relative' src={url} ref={videoRef} onMouseOver={() => setPlayerVisible(true)} onMouseOut={() => setPlayerVisible(false)} />}
      <div
        className={`flex items-center gap-xs  ${type === 'video' && 'absolute bottom-5 left-1/2 w-[85%] transform translate-x-[-50%]'}


        `}
      >
        <button
          onClick={onPlayMedia}
          style={{
            display: 'flex',
            padding: '.25rem',
            borderRadius: '100%',
            border: '0',
            borderColor: 'transparent',
            background: 'teal',
            color: 'whitesmoke',
          }}
        >
          {paused ? <RiPlayMiniFill /> : <RiPauseMiniFill />}
        </button>
        <span
          style={{
            fontSize: 'small',
            fontFamily: 'monospace',
            color: type === 'video' ? 'whitesmoke' : 'inherit',
          }}
        >
          {formatTime(currentTime * 1000)}
        </span>
        <div tabIndex={0} ref={barRef} style={progressBarStyles} onClick={onProgressClick}>
          <div style={progressFillStyles}></div>
        </div>
      </div>
    </div>
  );
}

function formatTime(milliseconds: number) {
  const hours = Math.floor(milliseconds / 3600000);
  const minutes = Math.floor((milliseconds % 3600000) / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);

  const formattedHours = hours > 0 ? String(hours).padStart(2, '0') + ':' : '';
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}${formattedMinutes}:${formattedSeconds}`;
}
