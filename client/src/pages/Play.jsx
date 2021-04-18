import React, { useEffect, useState, useRef } from 'react'
import BlankCard from '../assets/blank-cards-3.png'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socketio'
import PlayerCard from '../components/PlayerCard'
import Peer from 'simple-peer'
import styled from 'styled-components'
import axios from 'axios'

const StyledVideo = styled.video`
    height: 140%;
    width: 100%;
    position: absolute;
    bottom: 0;
    z-index: 1
`;

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

// const Video = (props) => {
//   const ref = useRef();

//   useEffect(() => {
//       props.peer.on("stream", stream => {
//           ref.current.srcObject = stream;
//       })
//   }, []);

//   return (
//       <StyledVideo playsInline autoPlay ref={ref} />
//   );
// }

export default function Play() {
  const [peers, setPeers] = useState([])
  const [room, setRoom] = useState({})
  const socketRef = useRef()
  const userVideo = useRef()
  const peersRef = useRef([])
  const { name } = useParams()
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState({})
  const [isStart, setIsStart] = useState(false)

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
          otherUsers?.forEach(otherUser => {
            const peer = createPeer(otherUser.socketId, socketRef.current.id, stream)

            peersRef.current.push({
              peerID: otherUser.socketId,
              peer,
            })

            peers.push({peerID: otherUser.socketId, peer, user: otherUser});
          })
          setPeers(peers)
        })

        socketRef.current.on('user-joined', payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          peersRef.current.push({
            peerID: payload.callerID,
            peer
          })

          // const peerObj = {
          //   peer,
          //   peerID: payload.callerID
          // }

          // Ini bikin double
          // setPeers(users => [...users, peer])
        })

        socketRef.current.on('receiving-returned-signal', payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal)
        })

        socketRef.current.on('user-left', (id) => {
          const peerObj = peersRef.current.find(peer => peer.peerID === id);
          if (peerObj) {
            peerObj.peer.destroy()
          }
          const peers = peersRef.current.filter(peer => peer.peerID !== id);
          peersRef.current = peers
          setPeers(peers)
        })
      })

      // Broadcast random question
      socket.on('get-random-question', (payload) => {
        setQuestions(payload.questions)
        setQuestion(payload.question)
      })

      // Start game, bawa questions
      socket.on('get-random-questions', (questions) => {
        setQuestions(questions)
        setIsStart(true)
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

  const getCard = () => {
    axios({
      method:'GET',
      url:'http://localhost:4000/questions',
      headers:{
        access_token: localStorage.getItem('access_token')
      }
    })
    .then(({data})=>{
      socket.emit('start-game', {name, questions: data})
    })
    .catch(err => {
      console.log(err);
    })
  }

  const shuffleCard = () =>{
    let random = questions[Math.floor(Math.random() * questions.length)]
    let index = questions.indexOf(random)
    let result = [...questions.slice(0, index), ...questions.slice(index + 1)]

    socket.emit('shuffle-card', {name, question: random, questions: result, index})
  }

  return (
    <main>
      <div class="banner-play">
        <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
          <div class="flex-fill align-items-start d-flex justify-content-center bg-secondary" style={{height: "50%"}}>
            <StyledVideo className="img-fluid" muted ref={userVideo} autoPlay playsInline />
            {/* <img class="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} /> */}
          </div>
          <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center bg-light" style={{zIndex: "2"}}>
            <h3>{localStorage.username}</h3>
            <p>Location: {localStorage.location}</p>
          </div>
        </div>
          {
            peers.map(peer => {
              return <PlayerCard key={peer.peerID} peer={peer}/>;
            })
          }
        {/* {
          room?.users?.map((user, i) => {
            if (user.username != localStorage.username) {
              return <PlayerCard user={user} key={i} peer={peers[i]} />
            }
          })
        } */}

        <div id="div-card" style={{zIndex: "5"}}>
          <div class="d-flex text-center justify-content-center align-items-center">
            <h1 id="question-text">{question ? question.question : 'Click Shuffle Card To Play'}</h1>
            <img src={BlankCard} style={{width: "250px", height: "350px"}} alt="outspoketspot-cards" />
          </div>
          <h2>Username</h2>
          <div class="d-flex flex-row">
            {
              isStart ?
              <div>
                <button class="btn btn-secondary my-1 mx-2"
                onClick={()=> shuffleCard()}>Shuffle Card</button> 
                <button class="btn btn-secondary my-1 mx-2">Turn</button>
              </div>
              :
              <button class="btn btn-secondary my-1 mx-2"
              onClick={()=> getCard()}>Start Game</button> 
            }
            <button class="btn btn-secondary my-1 mx-2">Shuffle Card</button>
            <button class="btn btn-secondary my-1 mx-2">Turn</button>
          </div>
        </div>
      </div>
    </main>
  )
}
