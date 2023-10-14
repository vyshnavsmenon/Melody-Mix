import React, { useEffect, useRef, useState } from 'react';
import './Home.css';
import { useCookies } from 'react-cookie';
import { database } from './firebase.js';
import { updateDoc, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import Skeleton from '@mui/material/Skeleton';
import AudioPlayer from './AudioPlayer';
import { useAppStore } from './store/appStore.js';

function Home() {
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
  const [setPublicMusic] = useAppStore((state) => {
    return [
      state.setPublicMusic,
    ]
  })

  const currentIndex = useAppStore((state) => state.currentTrackIndex);
  const currentTrack = useAppStore((state) => state.currentTrack);
  const audioTracks = useAppStore((state) => state.audioTracks);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [cookie] = useCookies(["user-id"]);
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [isClicked, setIsClicked] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    console.log(isLoading);
    const userid = cookie['user-id'];

    if (!userid) {
      // If user is not logged in, redirect to the login page
      navigate('/login');
      return;  // Prevent further execution of the code
    }

    async function fetchData() {
      try {
        const response = await getDoc(doc(database, "Music", "dvGhfPODSRgcOYm6tYl7"));
        if (response.exists()) {
          setData(response.data().musicLink || []);
          if(!currentTrack){
            setPublicMusic(true);
            setAudioTracks(response.data().musicLink || []);
            setCurrentTrack(response.data().musicLink[0]);
            setCurrentTrackIndex(0);
          }
          console.log(audioTracks);
          setIsLoading(false);
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
  }, [cookie, navigate]);

  const audioRefArray = useRef([]);

  useEffect(() => {
    data.forEach((music, index) => {
      const audioElement = audioRefArray.current[index];

      if (audioElement) {
        audioElement.addEventListener('ended', () => {
          setCurrentAudioIndex((prevIndex) => (prevIndex + 1) % data.length);
          setCurrentTrackIndex(currentIndex + 1);
          setCurrentTrack(audioTracks[currentIndex]);

        });
      }
    });
  }, [data]);
  
  useEffect(() => {
    console.log(currentTrack);
  },[currentIndex])

  useEffect(() => {
    setIsClicked(new Array(data.length).fill(false));
  }, [data])

  useEffect(() => {
    console.log(audioTracks);
  }, [audioTracks])

  useEffect(() => {
    const audioElement = audioRefArray.current[currentAudioIndex];

    if (audioElement) {
      audioElement.load();
      audioElement.play();
      setCurrentAudio(audioElement);
      console.log(currentAudio);
    }
  }, [currentAudioIndex]);

  async function handleFavorites(music,index){
        const updatedIcons = [...isClicked];
        updatedIcons[index] = !isClicked[index];
        setIsClicked(updatedIcons);

        const userid = cookie['user-id'];
        let userData = await getDoc(doc(database, 'Users', userid));
        console.log(userData.data());
        await updateDoc(doc(database, 'Users', userid), {
        audioFiles: [...userData.data().audioFiles, {link: music.link, name: music.name}] })
        setIsClicked(!isClicked);

        updatedIcons[index] = !isClicked[index];
        setIsClicked(updatedIcons);
  }

  function handleChangeMusic(music, index){
    setCurrentTrack(music);
    setCurrentTrackIndex(index);
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
            <div className='audio' key={music.link}> 
              <div className='audio-left'>
                <div className='image'>
                <img src={music.imageUrl}/>  
                </div>
                <div className='audio-contents' onClick={() => {handleChangeMusic(music,index)}}>
                <h4>{music.name}</h4>
                <p>{music.SingerName}</p>
                </div>
              </div>
            <FavoriteIcon onClick={() => handleFavorites(music,index)} className={`favorite ${isClicked[index] ? 'clicked' : 'notClicked'}`}/>
            </div>
          ))}
        </div>
       {/* <AudioPlayer /> */}
      </div>
    )
}

export default Home;