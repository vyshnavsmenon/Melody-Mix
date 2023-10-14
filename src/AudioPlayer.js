import React, { useState,useCallback, useRef, useEffect } from 'react';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import FastForwardIcon from '@mui/icons-material/FastForward';
import FastRewindIcon from '@mui/icons-material/FastRewind';
import VolumeDownIcon from '@mui/icons-material/VolumeDown';
import './AudioPlayer.css';
import { useAppStore } from './store/appStore.js';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import Replay10Icon from '@mui/icons-material/Replay10';
import Forward10Icon from '@mui/icons-material/Forward10';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { database } from './firebase.js';
import { updateDoc, doc, getDoc, addDoc, collection, } from 'firebase/firestore';

function AudioPlayer() {

  const [ setAudioTracks] = useAppStore((state) => {
    return [
        state.setAudioTracks,
    ]
  });
  const [ setCurrentTrack ] = useAppStore((state) => {
    return [
      state.setCurrentTrack,
    ]
  })
  const [setCurrentTrackIndex] = useAppStore((state) => {
    return [
      state.setCurrentTrackIndex,
    ]
  })
  const audioTracks = useAppStore((state) => state.audioTracks);
  const currentIndex = useAppStore((state) => state.currentTrackIndex);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const publicMusic = useAppStore((state) => state.publicMusic);
  const [trackIndex, setTrackIndex] = useState(0);
  const [currentTrak, setCurrenttrack] = useState('');
  const [timeProgress, setTimeProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(60);
  const [muteVolume, setMuteVolume] = useState(false);
  const [count, setCount] = useState(0);
  const nextRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const audioRef = useRef();
  const progressBarRef = useRef();
  const progressBarref = useRef();

  const onLoadedMetadata = () => {
    if(audioRef.current){
      const seconds = audioRef.current.duration;
      setDuration(seconds);
      progressBarRef.current.max = seconds;
      progressBarref.current.max = seconds;
    }
  };

  const togglePlayPause = async() => {
    setIsPlaying((prev) => !prev);
    if (publicMusic) {
      console.log(currentTrack);
      let views = currentTrack?.views + 1;
      let updatedTrack = { ...currentTrack };
      updatedTrack.views = views;
      const updatedAudioTracks = [...audioTracks];
      updatedAudioTracks[currentIndex] = updatedTrack;
      setAudioTracks(updatedAudioTracks);
      await updateDoc(doc(database, 'Music', "dvGhfPODSRgcOYm6tYl7"), {
        musicLink: updatedAudioTracks,
      });
  
      console.log("View count is incremented");
    }
  };

  const playAnimationRef = useRef();

  const repeat = useCallback(() => {
    if(audioRef.current){
      const currentTime = audioRef.current.currentTime;
      setTimeProgress(currentTime);
      progressBarref.current.value = currentTime;
      progressBarref.current.style.setProperty(
        '--range-progress',
        `${(progressBarRef.current.value / duration) * 100}%`
      );
      progressBarRef.current.value = currentTime;
      progressBarRef.current.style.setProperty(
        '--range-progress',
        `${(progressBarRef.current.value / duration) * 100}%`
      );

      playAnimationRef.current = requestAnimationFrame(repeat);
    }
  }, [audioRef, duration, progressBarRef, setTimeProgress]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, audioRef, repeat]);
  
  const skipForward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime += 10;
    }
  };
  
  const skipBackward = () => {
    if (audioRef.current) {
      audioRef.current.currentTime -= 10;
    }
  };
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = muteVolume;
    }
  }, [volume, audioRef, muteVolume]);
  
  const handleProgressChange = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = progressBarRef.current.value;
      // progressBarref.current.value = progressBarRef.current.value;
    }
  };

  const handleProgresschange = () => {
    if(audioRef.current) {
      audioRef.current.currentTime = progressBarref.current.value;
    }
  }

  const formatTime = (time) => {
    if (time && !isNaN(time)) {
      const minutes = Math.floor(time / 60);
      const formatMinutes =
        minutes < 10 ? `0${minutes}` : `${minutes}`;
      const seconds = Math.floor(time % 60);
      const formatSeconds =
        seconds < 10 ? `0${seconds}` : `${seconds}`;
      return `${formatMinutes}:${formatSeconds}`;
    }
    return '00:00';
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', () => {
        console.log("button Clicked");
        nextRef.current.click();
      });
    }
  }, [audioRef]);

  useEffect(() => {
    console.log(currentTrack);
  },[currentIndex, currentTrack]);

  function handlePreviousMusic(){
    if(currentIndex < 0){
      return;
    }

    else {
      if((currentIndex + 1) === audioTracks.length){
        setCurrentTrackIndex(0);
      }
      setCurrentTrackIndex(currentIndex - 1);
      setCurrentTrack(audioTracks[currentIndex]);
    }
  }

  function handleNextMusic() {
    if(currentIndex >= audioTracks.length - 1){
      setCurrentTrackIndex(audioTracks.length - 1);
      setCurrentTrack(audioTracks[currentIndex]);
    }

    else {
      setCurrentTrackIndex(currentIndex + 1);
      setCurrentTrack(audioTracks[currentIndex]);
    }
  }


  return (
    <div className={`audioPlayer ${isOpen ? 'open' : ''}`} > 
     <audio ref={audioRef} src={currentTrack?.link}
       preload="metadata"
      onLoadedMetadata={onLoadedMetadata}
      ></audio>
      <div className='leftside'>
        
        <div className='image'><img src={currentTrack?.imageUrl}/></div>
        <div className='contents'>
          <h4>{currentTrack?.name}</h4>
          <p>{currentTrack?.SingerName}</p>
        </div>
        <div className='Contents'>
          <h4>{currentTrack?.name}</h4>
          <p>{currentTrack?.SingerName}</p>
          
        </div>
        <div className='close-icon' onClick={() => {setIsOpen(prev => !prev)}}>
          <KeyboardArrowDownIcon/>
        </div>
      </div>
      <div className='center'>
        <div className='center-top'>
            <span className='skipPrevious' onClick={() => {handlePreviousMusic()}}><SkipPreviousIcon/></span>
            <span className="Backward" onClick={skipBackward}><Replay10Icon/></span>
            <span onClick={togglePlayPause} className="playPause">
              {isPlaying ? <PauseIcon /> : <PlayArrowIcon className="play" />}
            </span>
            <span className="forward" onClick={skipForward}><Forward10Icon/></span>
            <span className='skipNext' ref={nextRef} onClick={() => {handleNextMusic()}} ><SkipNextIcon/></span>
        </div>
        <div className='center-bottom'>
          <div className="currentTime">{formatTime(timeProgress)}</div>
         
          <div className='progressBar-container'>
          <input
           className='progressBar'
            type="range"
            ref={progressBarRef}
            defaultValue="0"
            onChange={handleProgressChange}
          />
          </div>

          <div className="duration">{formatTime(duration)}</div>
        </div>
      </div>

      <div className='Center'>
        <div className='Center-top'>
            <span className='SkipPrevious' onClick={() => {handlePreviousMusic()}}><SkipPreviousIcon style={{ fontSize: '2.4rem' }}/></span>
            <span className="backward" onClick={skipBackward}><Replay10Icon /></span>
            <span onClick={togglePlayPause} className="PlayPause">
              {isPlaying ? <PauseIcon style={{ fontSize: '2rem' }}/> : <PlayArrowIcon style={{ fontSize: '2rem' }} />}
            </span>
            <span className="Forward" onClick={skipForward}><Forward10Icon/></span>
            <span className='SkipNext' ref={nextRef} onClick={() => {handleNextMusic()}} ><SkipNextIcon style={{ fontSize: '2.4rem' }}/></span>
            <div className='Close-icon' onClick={() => {setIsOpen(prev => !prev)}}>
          <KeyboardArrowDownIcon style={{ fontSize: '2rem' }}/>

        </div>
        </div>
        <div className='Center-bottom'>         
          <div className='ProgressBar-container'>
          <input
           className='progressBar'
            type="range"
            ref={progressBarref}
            defaultValue="0"
            onChange={handleProgresschange}
          />
          </div>
          <div className='durationTime'>
          <div className="CurrentTime">{formatTime(timeProgress)}</div>
          <div className="Duration">{formatTime(duration)}</div>
          </div>
        </div>
      </div>

      <div className='rightside'>
      <VolumeDownIcon/>
        <input
            className='progressBar-audio'
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(e.target.value)}
            style={{
              background: `linear-gradient(to right, #f50 ${volume}%, #ccc ${volume}%)`,
            }}
          />
      </div>

    </div>
  );
}

export default AudioPlayer;