import React, {useEffect, useState} from 'react'
import Avatar from '../assets/avatar.png'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { socket } from '../connections/socketio'
import Swal from 'sweetalert2'

export default function LobbyCard({room, idx}) {
  const history = useHistory()

  const [lobbyCount, setLobbyCount] = useState(null)

  useEffect(() => {
    if(idx % 2 ===  1){
      setLobbyCount(1)
    } else {
      setLobbyCount(0)
    }
  }, [room])
  
  const [ava, setAva] = useState('')

  useEffect(() => {
    setAva(`https://avatars.dicebear.com/api/bottts/${room.admin}.svg`)
  }, [])

  const handleJoin = (e) => {
    let payload = {
      "room-name": room.name,
      user: {
        id: +localStorage.id,
        username: localStorage.username,
        location: localStorage.location,
        socketId: socket.id
      }
    }

    if (room.users.length < room.max ) {
      socket.emit('join-room', payload)
      history.push(`/room/${room.name}`)

    } else {
      console.log(room.users.length);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Room sudah penuh!',
        customClass: 'stepSwalCustom'
      })
      history.push('/lobby')
    }
  }

  const userLobby = () => {
    let slot = [];
    for(let i = 0; i < room.max; i++){
      if (room.users[i]){
        slot.push(<li>{room.users[i].username}</li>)
      } else {
        slot.push(<li>--------</li>)
      }
    }
    return slot;
  }

  return (
    <div className={`d-flex flex-row m-3 card lobbyCard-${lobbyCount}`} style={{width: "20rem", height: "15rem"}}>
      <div className="flex-fill d-flex flex-column align-items-center justify-content-center" id="content">
        <span>ADMIN</span>
        <img className="my-2 p-2 border rounded-3" src={ava} alt="Card image cap" style={{width: "100px"}} />
        <span>{room.admin}</span>
        <button onClick={() => handleJoin()} className="btn btn-outline-warning my-2">Join</button>
      </div>
      <div className="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
        <h3 style={{color: "#8E44AD"}}>{room.name}</h3>
        <ul id="member">
          {
            userLobby()
          }
        </ul>
      </div>
    </div>
  )
}
