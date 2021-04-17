import React from 'react'
import Avatar from '../assets/avatar.png'
import { useHistory, useRouteMatch } from 'react-router-dom'
import { socket } from '../connections/socketio'

export default function LobbyCard({room}) {
  const history = useHistory()

  const handleJoin = () => {
    let payload = {
      "room-name": room.name,
      user: {
        id: +localStorage.id,
        username: localStorage.username,
        location: localStorage.location
      }
    }
    socket.emit('join-room', payload)
    history.push(`/room/${room.name}`)
  }

  return (
    <div className="d-flex flex-row m-3 card" style={{width: "20rem", height: "15rem"}}>
      <div className="flex-fill d-flex flex-column align-items-center justify-content-center" id="content">
        <img className="my-2" src={Avatar} alt="Card image cap" />
        <span>Admin</span>
        <span>{room.admin}</span>
        <button onClick={() => handleJoin()} className="btn btn-outline-warning my-2">Join</button>
      </div>
      <div className="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
        <h3 style={{color: "#8E44AD"}}>{room.name}</h3>
        <ul id="member">
          {
            room?.users?.map(user => {
              return <li>{user.username}</li>
            })
          }
        </ul>
      </div>
    </div>
  )
}
