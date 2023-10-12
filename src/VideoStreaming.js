import React, { useState, useEffect } from 'react';
// import './VideoStreaming.css';
// import { useCookies } from 'react-cookie';
// import FavoriteIcon from '@mui/icons-material/Favorite';
// import CommentIcon from '@mui/icons-material/Comment';
// import SendIcon from '@mui/icons-material/Send';
// import io from 'socket.io-client';
// const socket = io.connect('http://localhost:9000');

const VideoStreaming = () => {
//   const videoUrl = 'https://example.com/path/to/video.mp4'; // Replace with your video URL
//   const [isClicked, setIsClicked] = useState(false);
//   const [cookie] = useCookies(["user-id"]);
//   const [isClicked1, setIsClicked1] = useState(false);
//   const [isClicked2, setIsClicked2] = useState(false);
//   const [displayed, setDisplayed] = useState(false);
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');

//   useEffect(() => {
//     // Listen for 'chat message' events from the server
//     socket.on('message', (msg) => {
//       console.log(msg);
//     });

//     // Clean up the event listener when the component unmounts
//     return () => {
//       socket.off('message');
//     };
//   }, []);

// useEffect(async() => {
//         try {
//           const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
//           document.getElementById('my-video').srcObject = stream;
//           const peer = createPeer();
//           stream.getTracks().forEach(track => peer.addTrack(track, stream));
//         } catch (error) {
//           console.error('Error accessing media devices:', error);
//         }

//         const createPeer = () => {
//               const peer = new RTCPeerConnection();
//               peer.onnegotiationneeded = () => handleonnegotiationneeded(peer);
//               return peer;
//         };
// },[])

// const handleClick = () => {
//     const userid = cookie['user-id'];

//     socket.on('broadcastSdp', async(sdp) => {
      
          
//     })

//   }

//   // useEffect(() => {
   
//   //   const userid = cookie['user-id'];
//   //   const init = async () => {
//   //     console.log("function called.....");
//   //     try {
//   //       const stream = await navigator.mediaDevices.getUserMedia({ audio: false, video: true });
//   //       document.getElementById('my-video').srcObject = stream;
//   //       const peer = createPeer();
//   //       stream.getTracks().forEach(track => peer.addTrack(track, stream));
//   //     } catch (error) {
//   //       console.error('Error accessing media devices:', error);
//   //     }
//   //   };

//   //   const createPeer = () => {
//   //     const peer = new RTCPeerConnection();
//   //     peer.onnegotiationneeded = () => handleonnegotiationneeded(peer);
//   //     return peer;
//   //   };

//   //   const handleonnegotiationneeded = async (peer) => {
//   //     try {
//   //       const offer = await peer.createOffer();
//   //       await peer.setLocalDescription(offer);
//   //       const payload = {
//   //         id: userid,
//   //         sdp: peer.localDescription
//   //       };
//   //       const response = await(await fetch('http://localhost:9000/broadcast', { 
//   //         method: 'POST',
//   //         headers: {
//   //           'Content-Type': 'application/json',
//   //         },
//   //         body: JSON.stringify(payload),
//   //       })).json();

//   //       peer.setRemoteDescription(new RTCSessionDescription(response.sdp));
//   //     } catch (error) {
//   //       console.error('Error handling negotiation:', error);
//   //     }
//   //   };

//   //   init();
//   // }, []);

//   function handleFavorite(){
//     setIsClicked(!isClicked);
//   }
  
//   function handleComment(){
//     setIsClicked1(!isClicked1);
//     setDisplayed(!displayed);
//   }

//   function handleSend(){
//     setIsClicked2(!isClicked2);
//   }

  

  return (
    <div>
      HI there
    </div>
//     <div className='videoStreaming'>      
//       <div className='video-div'>
//         <h1>Channel name or Username</h1>
//         <video id="my-video" autoPlay></video>
//         <div className='icons'>
//             <FavoriteIcon onClick={() => handleFavorite()} className={`favoriteicon ${isClicked ? 'clicked' : 'notClicked'}`}/>
//             <CommentIcon onClick={() => handleComment()} className={`icon ${isClicked1 ? 'clicked' : 'notClicked'}`} />                    
//             <SendIcon onClick={() => handleSend()} className={`icon ${isClicked2? 'clicked' : 'notClicked'}`} />
//         </div>
//         <div className={`comment ${displayed? 'displaying' : 'notDisplaying'}`} />
//         <button onClick={handleClick}>Click Me....</button>
//       </div>
//     </div>
  );
}

export default VideoStreaming