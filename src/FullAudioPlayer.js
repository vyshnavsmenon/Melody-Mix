import React from 'react'

function FullAudioPlayer() {

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
      const [trackIndex, setTrackIndex] = useState(0);
      const [currentTrak, setCurrenttrack] = useState('');
      const [timeProgress, setTimeProgress] = useState(0);
      const [duration, setDuration] = useState(0);
      const [isPlaying, setIsPlaying] = useState(false);
      const [volume, setVolume] = useState(60);
      const [muteVolume, setMuteVolume] = useState(false);
      const [count, setCount] = useState(0);
      const nextRef = useRef(null);
    
      const audioRef = useRef();
      const progressBarRef = useRef();
    
    
      const onLoadedMetadata = () => {
        if(audioRef.current){
          const seconds = audioRef.current.duration;
          setDuration(seconds);
          progressBarRef.current.max = seconds;
        }
      };
    
      const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
      };
    
      const playAnimationRef = useRef();
    
      const repeat = useCallback(() => {
        if(audioRef.current){
          const currentTime = audioRef.current.currentTime;
          setTimeProgress(currentTime);
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
        }
      };
    
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
    <>
        <div className='audio-full-container'>
            <div className='audio-container-top'>
            <img src='https://imgs.search.brave.com/O_iJ5NPuPrmVtWMWyPOFE2aKXqkP0YXuTAgGGqTtFx8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9kZWVw/bHlyaWNzLmluL2lt/YWdlcy9hbHRtZWRp/dW0vYW5qaS1tYW5p/a2t1LXB1cHB5XzY3/OC5qcGc'/>
            </div>
            <div className='audio-container-bottom'>

            </div>
            <div className='audio-container-bottom'></div>
        </div>
    </>
  )
}

export default FullAudioPlayer;