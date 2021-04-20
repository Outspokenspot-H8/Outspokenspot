import React, { useEffect, useState, useRef } from 'react'
import BlankCard from '../assets/blank-cards-3.png'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socketio'
import PlayerCard from '../components/PlayerCard'
import Peer from 'simple-peer'
import styled from 'styled-components'
import axios from 'axios'

const StyledVideo = styled.video`
  height: auto;
  position: absolute;
  top: 0;
  z-index: 1;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`;

const videoConstraints = {
  height: window.innerHeight,
  width: window.innerWidth
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
  const [randomTurnButton, setRandomTurnButton] = useState(false)
  const [isRandomTurnPlayer, setIsRandomTurnPlayer] = useState(false)
  const { name } = useParams()
  const [isForm, setIsForm] = useState("close")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])

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
        socketRef.current.emit('join-play', {name, username: localStorage.username})
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

          // // Ini bikin double
          // setPeers(users => [...users, peerObj])
        })

        socketRef.current.on('receiving-returned-signal', payload => {
          const item = peersRef.current.find(p => p.peerID === payload.id);
          item.peer.signal(payload.signal)
        })

        socketRef.current.on('user-left', (payload) => {
          const peerObj = peersRef.current.find(peer => peer.peerID === payload.id);
          if (peerObj) {
            peerObj.peer.destroy()
          }
          const peers = peersRef.current.filter(peer => peer.peerID !== payload.id);
          peersRef.current = peers
          setPeers(peers)
          initiatePlayersRef.current = payload.leavedRoom.users
        })
      })

      // Broadcast random question
      socket.on('get-random-question', (payload) => {
        shuffleCardAnimation(payload.question, payload.questions)
        setIsShufflingCard(false)
        setRandomTurnButton(true)
      })

      // Start game, bawa questions
      socket.on('get-random-questions', (questions) => {
        setQuestions(questions)
        setIsStart(true)
      })

      socket.on('get-random-player', (payload) => {
        if (payload.players.length === 0) {
          setPlayerRemaining(initiatePlayersRef.current)
          setPlayerTurn({})
          setIsShufflingCard(true)
          setQuestion({question: 'Shuffle next question'})
          setRandomTurnButton(false)
          setIsRandomTurnPlayer(false)
        } else {
          setIsRandomTurnPlayer(true)
          if (payload.players.length === 1) {
            setPlayerTurn(payload.player)
            let result = []
            setPlayerRemaining(result)
          } else {
            shufflePlayerAnimation(payload.player, payload.players)
            let result = [...payload.players.slice(0, payload.index), ...payload.players.slice(payload.index + 1)]
            setPlayerRemaining(result)
          }
        }
      })

      socket.on('fetch-all-message', (payload) => {
        setMessages(payload)
      })
  }, [])

  const createPeer = (userToSignal, callerID, stream) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      socketRef.current.emit("sending-signal", { userToSignal, callerID, signal, name })
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

  const shuffleCardAnimation = (question, questions) => {
    let i = 0;
    const mulai = new Date().getTime();

    setInterval(function () {
      if (new Date().getTime() - mulai > 2180) {
        return;
      }
      setQuestion(questions[Math.round(Math.random() * (questions.length - 1))])
    }, 5);

    setTimeout(function () {
      setQuestion(question)
    }, 2180)
  }

  const shufflePlayerAnimation = (player, players) => {
    const mulai = new Date().getTime();

    setInterval(function () {
      if (new Date().getTime() - mulai > 2000) {
        return;
      }
      setPlayerTurn(players[Math.round(Math.random() * (players.length - 1))])
    }, 100);
    setTimeout(function () {
      setPlayerTurn(player)
    }, 2000)
  }

  const shuffleUserTurn = () => {
    let randomPlayer = playerRemaining[Math.floor(Math.random() * playerRemaining.length)]
    let index = playerRemaining.indexOf(randomPlayer)

    if (playerRemaining.length > 1) {
      socket.emit('shuffle-user-turn', {name, player: randomPlayer, players: playerRemaining, index})
    } else {
      console.log(playerRemaining, 'INI LENGTH < 1');
      socket.emit('shuffle-user-turn', {name, player: randomPlayer, players: playerRemaining, index})
    }
  }

  const openChat = () => {
    setIsForm("open");
  }

  const closeChat = () => {
    setIsForm("close")
  }

  const sendMessage = () => {
    setMessage("")
    socket.emit('send-message', {name, player: localStorage.username, message})
  }

  return (
    <main>
      <div className="banner-play">
        <div className="d-flex flex-column m-3 card card-1" style={{width: "21rem", height: "40%"}} id={playerTurn.username === localStorage.username ? "border-active" : ""}>
          <div className="flex-fill align-items-start d-flex justify-content-center bg-secondary" style={{height: "60%"}}>
            <StyledVideo className="img-fluid" muted ref={userVideo} autoPlay playsInline />
            {/* <img className="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} /> */}
          </div>
          <div className="flex-fill d-flex justify-content-around align-items-center flex-row text-center bg-light" style={{zIndex: "2"}}>
            <h3>{localStorage.username}</h3>
            <p style={{margin: '0px'}}>{localStorage.location}</p>
          </div>
        </div>
          {
            peers?.map((peer, idx) => {
              return <PlayerCard key={peer.peerID} peer={peer} turn={playerTurn.username} idx={idx+2}/>;
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
          <div className="d-flex text-center justify-content-center align-items-center">
            <h1 id="question-text">{question ? question.question : 'Click Shuffle Card To Play'}</h1>
            <img src={BlankCard} style={{width: "250px", height: "350px"}} alt="outspoketspot-cards" />
          </div>
          {
            isRandomTurnPlayer && !isShufflingCard ?
            <h2>{playerTurn?.username}</h2>
            :
            <></>
          }
          <div className="d-flex flex-row">
            {
              isStart ?
              <div>
                {
                  isShufflingCard ?
                  <button onClick={()=> shuffleCard()} className="btn btn-secondary my-1 mx-2">Shuffle Card</button> 
                  :
                  <></>
                }
                {
                  randomTurnButton ?
                  <button onClick={() => shuffleUserTurn()} className="btn btn-secondary my-1 mx-2">Turn</button>
                  :
                  <></>
                }
              </div>
              :
              <button className="btn btn-secondary my-1 mx-2"
              onClick={()=> getCard()}>Start Game</button>
            }
          </div>
        </div>
        <button className="open-button" style={isForm == "open" ? {display: "none"}: {display: "inline-block"}} onClick={openChat}>Chat</button>

        <div className={isForm === "open" ? "chat-popup" : "chat-popup close"} id="myForm">
          <form className="form-container" onSubmit={(e) => e.preventDefault()}>
          <div className="d-flex flex-row justify-content-between">
          <h2>Chat</h2>
          <button className="btn btn-outline-warning py-1" id="minimize" onclick="closeForm()" onClick={closeChat}>-</button>
          </div>
            <div className="box-body overflow-auto">
              {
                messages.map(message => {
                  if(message.player === localStorage.username){
                    return (
                      <div className="d-flex flex-row justify-content-end align-items-center" style={{width: "100%"}} id="messagePlayer">
                        <div>
                          <p className="m-0" style={{fontSize: "12px"}}>{message.player}</p>
                        </div>
                        <div className="bg-danger w-50 rounded my-1 mx-2 text-center p-1">
                          <span style={{maxWidth: "50%", wordWrap: "break-word", fontSize: "13px"}}>{message.message}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="d-flex flex-row justify-content-start align-items-center" style={{width: "100%"}} id="messageOther">
                        <div className="bg-primary w-50 rounded my-1 mx-2 text-center p-1">
                          <span style={{maxWidth: "50%", wordWrap: "break-word", fontSize: "13px"}}>{message.message}</span>
                        </div>
                        <div>
                          <p className="m-0" style={{fontSize: "12px"}}>{message.player}</p>
                        </div>
                      </div>
                    )
                  }
                })
              }
            </div>
            <div className="row">
              <div className="col-8">
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Type message.." name="msg"/>
              </div>
              <div className="col-4 align-items-center justify-content-center d-flex">
                <button type="submit" className="btn btn-secondary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  )
}
