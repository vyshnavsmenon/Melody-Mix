import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {useParams,useNavigate,Link} from 'react-router-dom';

function VideoReceiving() {

    const [streamURL, setStreamURL] = useState(null);
    const {id} = useParams();

    useEffect(() => {
      console.log(streamURL); // This will log the updated streamURL when it changes.
    }, [streamURL]);

    useEffect(() => {
        let peer;
    
        const init = async () => {
          peer = createPeer();
          peer.addTransceiver('video', { direction: 'recvonly' });
        };
    
        const createPeer = () => {
          const peer = new RTCPeerConnection();
          peer.ontrack = handleTrack;
          peer.onnegotiationneeded = () => handleonnegotiationneeded(peer);
          return peer;
        };
    
        const handleTrack = (ev) => {
          console.log(ev);
          if (ev && ev.streams && ev.streams.length > 0) {
            console.log(ev.streams[0]);
            document.getElementById('my-video').srcObject = ev.streams[0];
            setStreamURL(ev.streams[0]);
            setStreamURL(ev.streams[0]);
            console.log(streamURL);
          }
        };
    
        const handleonnegotiationneeded = async (peer) => {
          const offer = await peer.createOffer();
          let broadcasterId = 1;
          await peer.setLocalDescription(offer);
          const payload = {
            id: id,
            sdp: peer.localDescription,
          };
          try {
            const response = await (await fetch('http://localhost:9000/consumer', { 
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            })).json();
            peer.setRemoteDescription(new RTCSessionDescription(response.sdp));
          } catch (error) {
            console.error('Error handling negotiation:', error);
          }
        };
    
        init();
    
        // Cleanup function: Close the peer connection when the component unmounts
        return () => {
          if (peer) {
            peer.close();
          }
        };
      }, []);
    
      
    
      return (
        <>
        {console.log(streamURL)}
           <ReactPlayer
          url={streamURL}
          playing
          controls
          width="100%"
          height="100%"
        />
        <video id="my-video" autoPlay></video>
        </>
       
        
      );
}

export default VideoReceiving;