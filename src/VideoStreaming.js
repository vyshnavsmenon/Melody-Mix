import React, { useState } from 'react';
import './VideoStreaming.css'
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import SendIcon from '@mui/icons-material/Send';

const VideoStreaming = () => {
  const videoUrl = 'https://example.com/path/to/video.mp4'; // Replace with your video URL
  const [isClicked, setIsClicked] = useState(false);
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [displayed, setDisplayed] = useState(false);

  function handleFavorite(){
    setIsClicked(!isClicked);
  }
  
  function handleComment(){
    setIsClicked1(!isClicked1);
    setDisplayed(!displayed);
  }

  function handleSend(){
    setIsClicked2(!isClicked2);
  }
  return (
    <div className='videoStreaming'>      
      <div className='video-div'>
        <h1>Channel name or Username</h1>
        <video controls autoPlay>
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className='icons'>
            <FavoriteIcon onClick={() => handleFavorite()} className={`favoriteicon ${isClicked ? 'clicked' : 'notClicked'}`}/>
            <CommentIcon onClick={() => handleComment()} className={`icon ${isClicked1 ? 'clicked' : 'notClicked'}`} />                    
            <SendIcon onClick={() => handleSend()} className={`icon ${isClicked2? 'clicked' : 'notClicked'}`} />
        </div>
        <div className={`comment ${displayed? 'displaying' : 'notDisplaying'}`} />
      </div>
    </div>
  )
}

export default VideoStreaming