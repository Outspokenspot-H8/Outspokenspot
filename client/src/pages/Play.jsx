import React, { useEffect, useState, useRef } from 'react'
import BlankCard from '../assets/blank-cards-3.png'
import PressStart from '../assets/press-start.gif'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socketio'
import PlayerCard from '../components/PlayerCard'
import Peer from 'simple-peer'
import styled from 'styled-components'
import axios from 'axios'
import notif from '../assets/notif2.webp'
import _ from 'lodash'
import Swal from 'sweetalert2'
import done from '../assets/done.webp'

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
  const [questions, setQuestions] = useState(null)
  const [question, setQuestion] = useState({})
  const [isStart, setIsStart] = useState(false)
  // const [initiatePlayers, setInitiatePlayers] = useState([])
  const initiatePlayersRef = useRef([])
  const initiateAdmin = useRef([])
  const [playerRemaining, setPlayerRemaining] = useState([])
  const [playerTurn, setPlayerTurn] = useState({})
  const [isShufflingCard, setIsShufflingCard] = useState(true)
  const [randomTurnButton, setRandomTurnButton] = useState(false)
  const [isRandomTurnPlayer, setIsRandomTurnPlayer] = useState(false)
  const [shuffleDone, setShuffleDone] = useState(false)
  const { name } = useParams()
  const [isForm, setIsForm] = useState("close")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [isNotif, setIsNotif] = useState(false)
  const [turnFlipCard, setTurnFlipCard] = useState('')
  const player = useRef('')
  const questionLength = useRef([])
  const detail = useRef({})

  useEffect(() => {
    if(messages.length !== 0){
      setIsNotif(true)
    }
  }, [messages])

  useEffect(() => {
    socket.emit('get-room-detail', name)
    socket.on('got-room-detail', (roomDetail) => {
      setRoom(roomDetail)
      setPlayerRemaining(roomDetail.users)
      initiatePlayersRef.current = roomDetail.users
      initiateAdmin.current = roomDetail.admin
      detail.current = roomDetail
    })
    socketRef.current = socket
    navigator.mediaDevices.getUserMedia({video: true, audio: true})
      .then((stream) => {
        userVideo.current.srcObject = stream;
        socketRef.current.emit('join-play', {name, username: localStorage.username})
        console.log(socket.id, "INI PLAY")
        socketRef.current.on('other-users', (otherUsers) => {
          const peers = []
          otherUsers?.forEach(otherUser => {
            const peer = createPeer(otherUser.socketId, socketRef.current.id, stream, otherUser)
            peersRef.current.push({
              peerID: otherUser.socketId,
              peer,
            })
            console.log(peer, "ini create")

            peers.push({peerID: otherUser.socketId, peer, user: otherUser});
          })
          setPeers(peers)
        })

        socketRef.current.on('user-joined', payload => {
          const peer = addPeer(payload.signal, payload.callerID, stream);
          const peerObj = {
            peerID: payload.callerID,
            peer,
            otherUser: payload.otherUser
          }
          peersRef.current.push({
            peerID: payload.callerID,
            peer,
          })
          console.log(peerObj, "INI ADD")
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
        setIsShufflingCard(false)
        setRandomTurnButton(true)
      })

      // Start game, bawa questions
      socket.on('get-random-questions', (questions) => {
        setQuestions(questions)
        console.log(isStart, "sebelum di start");
        setIsStart(true)
        Swal.fire({
          icon: 'question',
          title: 'Rules',
          html: '<pre style="font-family: Chakra Petch, sans-serif; color: #8E44AD; text-align: justify; word-wrap: break-word">' + 
          '1. Gunakan tombol Shuffle Card untuk mengacak\n    pertanyaan.\n2. Tombol Turn untuk mendapatkan giliran menjawab.\n3. Jawab sejujur mungkin di setiap pertanyaan dan \n    dapatkan percakapan mendalam.'
          + '</pre>',
          customClass: 'stepSwalCustom'
        })
        questionLength.current = questions;
        const admin = initiatePlayersRef.current.filter(user => user.username === initiateAdmin.current )
        initiateAdmin.current = admin[0];
        setTurnFlipCard(admin[0])
      })

      socket.on('get-random-player', (payload) => {
        if (payload.players.length === 0) {
          setTurnFlipCard(player.current)
          setPlayerRemaining(initiatePlayersRef.current)
          setPlayerTurn({})
          setQuestion({question: 'Shuffle Next Question'})
          setRandomTurnButton(false)
          setIsRandomTurnPlayer(false)
          setShuffleDone(false)
        } else {
          setIsRandomTurnPlayer(true)
          if (payload.players.length === 1) {
            player.current = payload.players[0];
            setPlayerTurn(payload.player)
            let result = []
            setPlayerRemaining(result)
            shufflePlayerAnimation(payload.player, payload.players)
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

      socket.on('swap-questions', (payload) => {
        swap(payload)
      })
  }, [])

  const createPeer = (userToSignal, callerID, stream, otherUser) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    console.log(otherUser, "INI OTHERUSER")
  
    peer.on("signal", signal => {
      socketRef.current.emit("sending-signal", { userToSignal, callerID, signal, name, otherUser })
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
      url:'https://outspokenspot-h8.herokuapp.com/questions',
      headers:{
        access_token: localStorage.getItem('access_token')
      }
    })
    .then(({data})=>{
      const filterAndRandomData = _.sampleSize(data, detail.current.queQuantity);
      const cover = {
        question: "Your Admin must click the Question Card to Initiate The Game"
      };
      filterAndRandomData.push(cover);
      socket.emit('start-gameplay', {name, questions: filterAndRandomData})
    })
    .catch(err => {
      console.log(err);
    })
  }

  // const shuffleCard = () => {
  //   let randomQuestion = questions[Math.floor(Math.random() * questions.length)]
  //   let index = questions.indexOf(randomQuestion)
  //   let result = [...questions.slice(0, index), ...questions.slice(index + 1)]
  //   socket.emit('shuffle-card', {name, question: randomQuestion, questions: result, index})
  // }

  // const shuffleCardAnimation = (question, questions) => {
  //   let i = 0;
  //   const mulai = new Date().getTime();

  //   setInterval(function () {
  //     if (new Date().getTime() - mulai > 2180) {
  //       return;
  //     }
  //     setQuestion(questions[Math.round(Math.random() * (questions.length - 1))])
  //   }, 5);

  //   setTimeout(function () {
  //     setQuestion(question)
  //   }, 2180)
  // }

  const shufflePlayerAnimation = (player, players) => {
    setShuffleDone(false)
    const mulai = new Date().getTime();
    
    setInterval(function () {
      if (new Date().getTime() - mulai > 2000) {
        return;
      }
      setPlayerTurn(players[Math.round(Math.random() * (players.length - 1))])
    }, 100);
    console.log("SHUFFLE PLAYER")
    setTimeout(function () {
      setPlayerTurn(player)
      setShuffleDone(true)
    }, 2000)
  }

  const shuffleUserTurn = () => {
    let randomPlayer = playerRemaining[Math.floor(Math.random() * playerRemaining.length)]
    let index = playerRemaining.indexOf(randomPlayer)

    socket.emit('shuffle-user-turn', {name, player: randomPlayer, players: playerRemaining, index})
  }

  const openChat = () => {
    setIsNotif(false)
    setIsForm("open");
  }

  const closeChat = () => {
    setIsForm("close")
  }

  const sendMessage = () => {
    socket.emit('send-message', {name, player: localStorage.username, message})
    setMessage("")
    setIsNotif(false)
  }

  const handleKeyPress = (e) => {
    if(e.charCode === 13){
      socket.emit('send-message', {name, player: localStorage.username, message})
      setMessage("")
      setIsNotif(false)
    }
  }

  const swap = (questionRemaining) => {
    setRandomTurnButton(true)
    setTurnFlipCard('')
    if(questionRemaining.length === questionLength.current.length){
      setTurnFlipCard(initiateAdmin.current)
    }
    if(questionRemaining.length === 1) {
      setRandomTurnButton(false)
      setShuffleDone(false)
    }
    let questionCard = document.querySelector('.questionCard:last-child');
    questionCard.style.animation = "swap 700ms forwards";
    setTimeout(() => {
      questionCard.style.animation = "";
      questionRemaining.pop()
      setQuestions([...questionRemaining])
    }, 700);
  }

  const getSwap = (e) => {
    let questionCard = document.querySelector('.questionCard:last-child');
    if(e.target !== questionCard) return;
    socket.emit('swap', {name, questions})
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
          {
            !questions ?
            <div className="d-flex text-center justify-content-center align-items-center">
              <img src={PressStart} className="my-5" style={{width: "250px"}} alt="outspoketspot-cards" />
            </div>
            : questions.length !== 0 ?
            <div className={localStorage.username !== turnFlipCard?.username ? "questionStack disabled" : "questionStack"}>
              <div className={localStorage.username !== turnFlipCard?.username ? "stack disabled" : "stack"} onClick={(e) => getSwap(e)}>
                {
                  questions.map(question => {
                    return <div className="questionCard text-center"><h1 style={{color: "#8E44AD"}} id="questionStack">{question.question}</h1></div>
                  }) 
                }
              </div>
            </div>
            : 
            <div className="d-flex text-center justify-content-center align-items-center">
              <img src={done} className="my-5" style={{width: "250px"}} alt="outspoketspot-cards" />
            </div>
          }
         
          {
            isRandomTurnPlayer ?
            <h2 style={{color: "#FFEF00"}}>{playerTurn?.username}</h2>
            :
            <></>
          }
          <div className="d-flex flex-row">
            {
              isStart ?
              <div>
                {
                  randomTurnButton && !playerTurn.username ?
                  <div className="d-flex justify-content-center">
                    <button style={{backgroundColor: "#FFEF00", color: "#8E44AD"}} onClick={() => shuffleUserTurn()} className="btn btn-secondary btn-lg my-1 mx-2">Turn</button>
                  </div>
                  :
                  <></> 
                }
                {
                  randomTurnButton && localStorage.username === playerTurn.username && shuffleDone ?
                  <div className="d-flex justify-content-center">
                    <button style={{backgroundColor: "#FFEF00", color: "#8E44AD"}} onClick={() => shuffleUserTurn()} className="btn btn-secondary my-1 mx-2">Turn</button>
                  </div>
                  : questions.length === 0 ?
                    <> </>
                  : shuffleDone ?
                  <div className="d-flex justify-content-center">
                    <p style={{color: "#FFEF00"}}>Waiting player to click Turn button...</p>
                  </div>
                  : !playerTurn.username && !randomTurnButton ?
                    <div className="d-flex justify-content-center">
                      <p style={{color: "#FFEF00"}}>Shuffle to Next Question</p>
                    </div>
                  :
                  <></>
                }
              </div>
              :
              <button style={{backgroundColor: "#FFEF00", color: "#8E44AD"}} className="btn btn-secondary my-1 mx-2"
              onClick={()=> getCard()}>Start Game</button>
            }
          </div>
        </div>
        <button className="open-button" style={isForm == "open" ? {display: "none"}: {display: "inline-block"}} onClick={openChat}>CHAT{isNotif ? <img src={notif} alt="Notif" id="notif"></img> : ""}</button>

        <div className={isForm === "open" ? "chat-popup rounded-top" : "chat-popup close rounded-top"} id="myForm">
          <div className="form-container">
          <div className="d-flex flex-row justify-content-between">
          <h2>Chat</h2>
          <button className="btn btn-outline-warning py-1 " id="minimize" onClick={closeChat}>-</button>
          </div>
            <div className="box-body overflow-auto">
              {
                messages.map(message => {
                  if(message.player === localStorage.username){
                    return (
                      <div className="d-flex flex-row justify-content-end align-items-center" style={{width: "100%"}} id="messagePlayer">
                        <div className="w-50 rounded my-1 mx-2 text-center p-1" style={{backgroundColor: "#FFEF00"}}>
                          <p className="m-0" style={{fontSize: "10px", position: "absolute", top: "0"}}>{message.player}</p>
                          <span style={{maxWidth: "50%", wordWrap: "break-word", fontSize: "13px"}}>{message.message}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div className="d-flex flex-row justify-content-start align-items-center" style={{width: "100%"}} id="messageOther">
                        <div className="w-50 rounded my-1 mx-2 text-center p-1" style={{backgroundColor: "#8E44AD"}}>
                          <p className="m-0" style={{fontSize: "10px", position: "absolute", top: "0", color: "white"}}>{message.player}</p>
                          <span style={{maxWidth: "50%", wordWrap: "break-word", fontSize: "13px", color: "white"}}>{message.message}</span>
                        </div>
                      </div>
                    )
                  }
                })
              }
            </div>
            <div className="row">
              <div className="col-8">
                <input type="text" onChange={(e) => setMessage(e.target.value)} value={message} placeholder="Type message.." name="msg" onKeyPress={handleKeyPress}/>
              </div>
              <div className="col-4 align-items-center justify-content-center d-flex">
                <button type="submit" className="btn btn-secondary" onClick={sendMessage}>Send</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
