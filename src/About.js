import React, { useEffect,useState } from 'react';
import ReactPlayer from "react-player";

function About() {

  const [stream , setStream] = useState();

  useEffect(() => {
    async function init() {
      const peer = createPeer();
      peer.addTransceiver('video', { direction: 'recvonly' });
    }

    function createPeer() {
      const peer = new RTCPeerConnection();
      peer.ontrack = handleTrack;
      peer.onnegotiationneeded = () => handleOnNegotiationNeeded(peer);
      return peer;
    }

    async function handleTrack(ev) {
      const videoElement = document.getElementById('remote');
      // videoElement.srcObject = ev.streams[0];
      setStream(ev.streams[0])
      console.log(ev.streams[0]);
    }

    /**
     * @param {RTCPeerConnection} peer
     */
    async function handleOnNegotiationNeeded(peer) {
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const payload = {
        sdp: peer.localDescription,
      };

      const response = await (
        await fetch('http://localhost:8000/consumer', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
            mode: 'no-cors', 
        })
      ).json();

      peer.setRemoteDescription(new RTCSessionDescription(response.sdp));
    }

    init();
  }, []);

  return (
    <div>
      <h1>This is the video</h1>
      <video id="remote" autoPlay />
       {stream && <ReactPlayer
              playing
              height="100px"
              width="200px"
              url={stream}
            />}
    </div>
  );
}

export default About;
