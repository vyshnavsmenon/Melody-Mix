import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { getDoc, doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { database } from './firebase';
import './Playlist.css';
import DeleteIcon from '@mui/icons-material/Delete';
import Skeleton from '@mui/material/Skeleton';
import AudioPlayer from './AudioPlayer';
import { useAppStore } from './store/appStore.js';

function Playlist() {
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
  const currentIndex = useAppStore((state) => state.currentTrackIndex);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const audioTracks = useAppStore((state) => state.audioTracks);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["user-id"]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isClicked, setIsClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef([]);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    const userid = cookie['user-id'];

    if (!userid) {
      // If user is not logged in, redirect to the login page
      navigate('/login');
      return;  // Prevent further execution of the code
    }

    async function fetchDataOfUsers() {
      try {
        const userDocRef = doc(database, "Users", userid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log("User data:", userData);
          setIsLoading(false);
        } else {
          console.log("User document does not exist");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("An error occurred while fetching user data:", error);
        setIsLoading(false);
      }
    }

    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Users", userid));
        if (response.exists()) {
          setData(response.data().audioFiles || []);

        } else {
          console.log("Document not found");
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    fetchDataOfUsers();
  }, [cookie, navigate]);

  const audioRefArray = useRef([]);

  useEffect(() => {
    data.forEach((music, index) => {
      const audioElement = audioRefArray.current[index];

      if (audioElement) {
        audioElement.addEventListener('ended', () => {
          // Play the next audio when the current one ends
          setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % data.length);
        });
      }
    });
  }, [data]);

  useEffect(() => {
    const audioElement = audioRefArray.current[currentAudioIndex];

    if (currentAudioRef.current) {
      currentAudioRef.current.pause(); // Pause the previous audio
      currentAudioRef.current = null; // Reset the reference to the previous audio
    }

    if (audioElement) {
      audioElement.load();
      audioElement.play();
    }
  }, [currentAudioIndex]);

  async function handleDelete(music,index){
    setIsClicked(!isClicked);
    try{
      const userid = cookie['user-id'];

    const userDocRef = doc(database, "Users", userid);
    await updateDoc(userDocRef, {
      audioFiles : arrayRemove(music)
    });

    setData((prev) => prev.filter((_,i) => i != index));    

    if (index === currentAudioIndex) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setCurrentAudioIndex(null);
    }
    
    }
    catch(error) {
      console.error("Error : ", error)
    }
    setIsClicked(!isClicked);
  }

  function handleChangeMusic(music, index){
    setAudioTracks(data.audioFiles || []);
    setCurrentTrackIndex(index);
    setCurrentTrack(music);
  }

  return (
    <div className='home'>
    <div className='inner-div'>
    {isLoading && <>
      <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem',}}
      variant="rectangular"
      width={810}
      height={55}
    />
      <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem' }}
      variant="rectangular"
      width={810}
      height={55}
    />
    <Skeleton
      sx={{ bgcolor: 'grey.900',margin: '1rem' }}
      variant="rectangular"
      width={810}
      height={55}
    />
    <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem' }}
      variant="rectangular"
      width={810}
      height={55}
    />
    <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem' }}
      variant="rectangular"
      width={810}
      height={55}
    />
    <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem'}}
      variant="rectangular"
      width={810}
      height={55}
    />
    <Skeleton
      sx={{ bgcolor: 'grey.900', margin: '1rem' }}
      variant="rectangular"
      width={810}
      height={55}
    />
    </>}

      {data.map((music, index) => (
        <div className='audio' key={index}> 
          <div className='audio-left'>
            <div className='image'>
            <img src='https://imgs.search.brave.com/O_iJ5NPuPrmVtWMWyPOFE2aKXqkP0YXuTAgGGqTtFx8/rs:fit:500:0:0/g:ce/aHR0cHM6Ly9kZWVw/bHlyaWNzLmluL2lt/YWdlcy9hbHRtZWRp/dW0vYW5qaS1tYW5p/a2t1LXB1cHB5XzY3/OC5qcGc'/>  
            </div>
            <div className='audio-contents' onClick={() => {handleChangeMusic(music,index)}}>
            <h4>{music.name}</h4>
            <p>shankar,shreya</p>
            </div>
          </div>
        <DeleteIcon onClick={() => handleDelete(music,index)} className={`delete ${isClicked[index] ? 'clicked' : 'notClicked'}`} />
        </div>
      ))}
    </div>
   {/* <AudioPlayer /> */}
  </div>
  );
}

export default Playlist;
