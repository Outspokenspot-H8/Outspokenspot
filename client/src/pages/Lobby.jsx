import React, { useRef, useEffect, useState } from 'react'
import '../styles/style-play.css'
import LobbyCard from '../components/LobbyCard'
import SideBar from '../components/SideBar'
import { socket } from '../connections/socketio'
import {useHistory} from 'react-router-dom'

export default function Lobby() {
  const history = useHistory()

  const [rooms, setRooms] = useState([])
  const [roomName, setRoomName] = useState('')

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id')
    localStorage.removeItem('username')
    localStorage.removeItem('location')
    history.push('/')
  }

  const handleOnChange = (e) => {
    setRoomName(e.target.value)
  }

  const handleCreateRoom = () => {
    let payload = {
      'room-name': roomName,
      admin: localStorage.username,
    }
    socket.emit('create-room', payload)
    setRoomName('')
  }

  useEffect (() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(()=> {
        console.log("permission")
      })
    socket.on('exist-room', () => {
      console.log("EXIST")
    })
  }, [])

  useEffect(() => {
    socket.on('get-rooms', (roomsServer) => {
      setRooms(roomsServer)
    })
    socket.on('updated-room', (roomsServer) => {
      setRooms(roomsServer)
    })
    socket.emit('fetch-room')
    socket.on('fetched-room', (roomsSever) => {
      setRooms(roomsSever)
    })
  }, [rooms])

  return (
    <div>
      <SideBar />
      <main>
        <div className="d-flex justify-content-end mx-4">
          <button onClick={() => handleLogout()} type="button" className="btn btn-danger mt-4" id="logout">LOG OUT</button>
        </div>
        <div className="banner-lobby">
          <h1 className="mt-4" style={{color: "#FFEF00"}}>Outspoken Room</h1>
          <div class="mb-3">
            <label for="exampleFormControlInput1" class="form-label">Create Room</label>
            <input onChange={handleOnChange} value={roomName} type="text" class="form-control" id="exampleFormControlInput1" placeholder="Room Name" />
          </div>
          <div className="d-flex justify-content-end mx-4">
            <button onClick={() => handleCreateRoom()} type="button" className="btn btn-danger" id="logout">Submit</button>
          </div>
          <div className="row justify-content-center">

            {
              rooms?.map((room, i) => {
                return <LobbyCard room={room} key={i}/>
              })
            }

          </div>
          
        </div>
      </main>
    </div>
  )
}
