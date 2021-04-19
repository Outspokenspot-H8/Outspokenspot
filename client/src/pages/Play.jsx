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
  const [questions, setQuestions] = useState([])
  const [question, setQuestion] = useState({})
  const [isStart, setIsStart] = useState(false)
  // const [initiatePlayers, setInitiatePlayers] = useState([])
  const initiatePlayersRef = useRef([])
  const [playerRemaining, setPlayerRemaining] = useState([])
  const [playerTurn, setPlayerTurn] = useState({})
  const [isShufflingCard, setIsShufflingCard] = useState(true)
  const [isRandomTurnPlayer, setIsRandomTurnPlayer] = useState(false)
  const { name } = useParams()

  useEffect(() => {
    socket.emit('get-room-detail', name)
    socket.on('got-room-detail', (roomDetail) => {
      console.log(roomDetail);
      console.log(roomDetail.users, 'Ini room detail users');
      setRoom(roomDetail)
      setPlayerRemaining(roomDetail.users)
      initiatePlayersRef.current = roomDetail.users
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
        setIsShufflingCard(false)
        setIsRandomTurnPlayer(true)
      })

      // Start game, bawa questions
      socket.on('get-random-questions', (questions) => {
        setQuestions(questions)
        setIsStart(true)
      })

      socket.on('get-random-player', (payload) => {
        console.log(payload.players, 'INI PLAYERS YG MASUK DI SOCKETON');
        if (payload.players.length === 0) {
          console.log(payload.players, 'MASUK KE 0 PLAYER');
          console.log(initiatePlayersRef.current);
          setPlayerRemaining(initiatePlayersRef.current)
          setIsShufflingCard(true)
          setIsRandomTurnPlayer(false)
        } else {
          console.log(payload.players, 'INI PAYLOAD.PLAYERS MASUK KE ELSE');
          if (payload.players.length === 1) {
            console.log(payload.player, 'INI PAYLOAD.PLAYER DI LENGTH === 1');
            console.log(payload.players, 'INI MASUK KE PLAYER REMAINING === 1');
            let index = payload.players.indexOf(payload.player)
            console.log(index, 'INI INDEX PAYLOAD.PLAYER === 1');
            setPlayerTurn(payload.player)
            let result = []
            console.log(result, 'SLICE DI SOCKETON === 1');
            setPlayerRemaining(result)
          } else {
            console.log(payload.player, 'INI PAYLOAD.PLAYER DI LENGTH !== 1');
            console.log(payload.players, 'INI MASUK KE PLAYER REMAINING !== 1');
            setPlayerTurn(payload.player)
            let index = payload.players.indexOf(payload.player)
            let result = [...payload.players.slice(0, payload.index), ...payload.players.slice(payload.index + 1)]
            console.log(payload.index, 'INI INDEX PAYLOAD.PLAYER !== 1');
            console.log(result, 'SLICE DI SOCKETON !== 1');
            setPlayerRemaining(result)
          }
        }
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
      socket.emit('start-gameplay', {name, questions: data})
    })
    .catch(err => {
      console.log(err);
    })
  }

  const shuffleCard = () => {
    let randomQuestion = questions[Math.floor(Math.random() * questions.length)]
    let index = questions.indexOf(randomQuestion)
    let result = [...questions.slice(0, index), ...questions.slice(index + 1)]

    socket.emit('shuffle-card', {name, question: randomQuestion, questions: result, index})
  }

  const shuffleUserTurn = () => {
    console.log(playerRemaining, 'INI AWAL PLAYER REMAINIG');
    let randomPlayer = playerRemaining[Math.floor(Math.random() * playerRemaining.length)]
    let index = playerRemaining.indexOf(randomPlayer)
    let result;
    if (playerRemaining.length > 1) {
      // result = [...playerRemaining.slice(0, index), ...playerRemaining.slice(index + 1)]
      // console.log(playerRemaining, 'INI PLAYERREMANING LENGTH > 1');
      // console.log(result, 'INI RESULT LENGTH > 1');
      console.log(playerRemaining);
      socket.emit('shuffle-user-turn', {name, player: randomPlayer, players: playerRemaining, index})
    } else {
      console.log(playerRemaining, 'INI LENGTH < 1');
      socket.emit('shuffle-user-turn', {name, player: randomPlayer, players: playerRemaining, index})
    }

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
          <h2>{playerTurn?.username}</h2>
          {/* {
            playerRemaining.length === 0 ?
            <></>
            :
          } */}
          <div class="d-flex flex-row">
            {
              isStart ?
              <div>
                {
                  isShufflingCard ?
                  <button onClick={()=> shuffleCard()} class="btn btn-secondary my-1 mx-2">Shuffle Card</button> 
                  :
                  <></>
                }
                {
                  isRandomTurnPlayer ?
                  <button onClick={() => shuffleUserTurn()} class="btn btn-secondary my-1 mx-2">Turn</button>
                  :
                  <></>
                }
              </div>
              :
              <button class="btn btn-secondary my-1 mx-2"
              onClick={()=> getCard()}>Start Game</button>
            }
          </div>
        </div>
      </div>
    </main>
  )
}
