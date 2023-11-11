import React, { useRef } from "react";
import { Peer } from "peerjs";
import { io } from "socket.io-client";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@mui/material";

const associateStreamWithVideo = (myVideo, stream) => {
    myVideo.srcObject = stream;
    myVideo.onloadedmetadata = () => {
        myVideo.play();
    };
}

const COMMUNICATION_HOST = process.env.REACT_APP_COMMUNICATION_HOST ? process.env.REACT_APP_COMMUNICATION_HOST : "http://localhost:9001"
console.log(COMMUNICATION_HOST)
const VideoCall = () => {
  const [myPeer, setMyPeer] = useState(null);
  const [myPeerId, setMyPeerId] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [socket, setSocket] = useState(null);
  const [videoElements, setVideoElements] = useState([]);
  const { id: ROOM_ID } = useParams();
  const videoContainerRef = useRef();

  const handleToggleVideo = async () => {
    if (!socket) {
      const peer = new Peer();
      peer.on("open", (id) => {
        setMyPeerId(id);
      })
      setMyPeer(peer)
      setSocket(io(COMMUNICATION_HOST));
      setShowVideo(true);
    } else {
      await socket.disconnect();
      await myPeer.disconnect();
      setSocket(null);
      setMyPeer(null);
      setMyPeerId(null);
      setShowVideo(false);
    }
    
  }
  // useEffect(() => {
  //   const peer = new Peer();
  //   peer.on("open", (id) => {
  //     console.log(id);
  //     setMyPeerId(id);
  //   });
  //   setMyPeer(peer);
  // }, []);

  useEffect(() => {
    if (!socket) return;
    if (!myPeer || !myPeerId) return;
    const myVideo = document.createElement("video");
    myVideo.muted = true;
    const partnerVideo = document.createElement("video");
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        associateStreamWithVideo(myVideo, stream);
        setVideoElements([myVideo]);
        myPeer.on("call", (call) => {
          call.answer(stream);
          call.once("stream", (partnerStream) => {
            associateStreamWithVideo(partnerVideo, partnerStream)
            setVideoElements([myVideo, partnerVideo]);
          });
          socket.on("user-left", () => {
            // first guy that joined the call
            console.log("partner has left")
            call.close()
            partnerVideo.remove()
            setVideoElements([myVideo])
          })

          call.on("close", () => {
            //This is happening for the second guy who entered the call
            console.log("partner has left")
            partnerVideo.srcObject = null;
            partnerVideo.remove()
            setVideoElements([myVideo]);
          });
          
        });

        socket.on("user-joined", (userId) => {
          const call = myPeer.call(userId, stream);
          call.once("stream", (partnerStream) => {
            console.log(partnerStream);
            associateStreamWithVideo(partnerVideo, partnerStream);
            setVideoElements([myVideo, partnerVideo]);
          });
          socket.on("user-left", () => {
            // first guy that joined the call
            console.log("partner has left")
            call.close()
            const tracks = partnerVideo.srcObject.getTracks()
            for (var i = 0; i < tracks.length; i++) {
              tracks[i].stop()
            }
            partnerVideo.remove()
            setVideoElements([myVideo])
          })
        });

        // socket.on("user-left", () => {
        //   console.log("Other user has left")
        //   setVideoElements([myVideo])
        //   window.location.reload(true)
        // })

        

        socket.emit("hello-server", { id: myPeerId, roomId: ROOM_ID });
      }).catch(error => console.log);
    

  }, [socket, myPeer, myPeerId]);

  useEffect(() => {
    if (videoContainerRef.current == null) return;
    videoContainerRef.current.innerHtml = "";
    console.log(videoContainerRef.current.innerHtml)
    for (let videoElem of videoElements) {
      videoElem.style.width = '250px'
      videoElem.style.height = '250px'
      videoElem.style.margin = '10px'
      videoContainerRef.current.appendChild(videoElem);
    }
  }, [videoElements, videoContainerRef]);


  return (
  <div>
    <Button onClick={handleToggleVideo}>Toggle Call</Button>
    {showVideo && <div id="videos" ref={videoContainerRef} style={{margin: '10px'}}></div>}
  </div>
  
  );
};

export default VideoCall;

