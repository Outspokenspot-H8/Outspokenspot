import React, { useEffect, useState, useRef } from 'react'
import BlankCard from '../assets/blank-cards-3.png'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socketio'
import PlayerCard from '../components/PlayerCard'
import Peer from 'simple-peer'
import styled from 'styled-components'

const StyledVideo = styled.video`
    height: 20%;
    width: 20%;
`;

const videoConstraints = {
  height: window.innerHeight / 1,
  width: window.innerWidth / 1
};

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
      props.peer.on("stream", stream => {
          ref.current.srcObject = stream;
      })
  }, []);

  return (
      <StyledVideo playsInline autoPlay ref={ref} />
  );
}

export default function Play() {
  const [peers, setPeers] = useState([])
  const [room, setRoom] = useState({})
  const socketRef = useRef()
  const userVideo = useRef()
  const peersRef = useRef([])
  const { name } = useParams()


  useEffect(() => {
    socket.emit('get-room-detail', name)
    socket.on('got-room-detail', (roomDetail) => {
      setRoom(roomDetail)
    })
    socketRef.current = socket
    navigator.mediaDevices.getUserMedia({video: videoConstraints, audio: true})
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join-play', name)
        socketRef.current.on('other-users', (otherUsers) => {
          const peers = []
          otherUsers?.forEach(otherUserID => {
            console.log(otherUserID, );
            console.log(socketRef.current.id, 'SsocketREf');
            const peer = createPeer(otherUserID, socketRef.current.id, stream)

            peersRef.current.push({
              peerID: otherUserID,
              peer,
            })

            peers.push(peer);
          })
          setPeers(peers)
        })

        socketRef.current.on('user-joined', payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer
          })

          setPeers(users => [...users, peer])
        })

        socketRef.current.on('receiving-returned-signal', payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal)
        })
      })

  }, [])

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      socketRef.current.emit("sending-signal", { userToSignal, callerID, signal })
    })

    return peer;
  }

  const addPeer = (incomingSignal, callerID, stream) => {
    const peer = new Peer({
        initiator: false,
        trickle: false,
        stream,
    })

    peer.on("signal", signal => {
        socketRef.current.emit("returning-signal", { signal, callerID })
    })

    peer.signal(incomingSignal);

    return peer;
  }
  
  return (
    <main>
      <div class="banner-play">
        <StyledVideo muted ref={userVideo} autoPlay playsInline />
              {
                peers.map((peer, index) => {
                return (
                      <Video key={index} peer={peer} />
                  );
                })
              }
        {
          room?.users?.map(user => {
            return <PlayerCard />
          })
        }

        <div id="div-card">
          <div class="d-flex text-center justify-content-center align-items-center">
            <h1 id="question-text">ASDJNDWPIFPIJOASKFV</h1>
            <img src={BlankCard} style={{width: "250px", height: "350px"}} alt="outspoketspot-cards" />
          </div>
          <h2>Username</h2>
          <div class="d-flex flex-row">
            <button class="btn btn-secondary my-1 mx-2">Shuffle Card</button> 
            <button class="btn btn-secondary my-1 mx-2">Turn</button>
          </div>
        </div>
      </div>
    </main>
  )
}
