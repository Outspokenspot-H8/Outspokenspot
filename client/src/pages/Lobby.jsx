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
  }

  const handleOnChange = (e) => {
    setRoomName(e.target.value)
  }

  useEffect (() => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .then(()=> {
        console.log("permission")
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
          <a onClick={handleLogout} href="/" type="button" className="btn btn-danger mt-4" id="logout">LOG OUT</a>
        </div>
        <div className="banner-lobby">
          <h1 className="mt-4" style={{color: "#FFEF00"}}>Outspoken Room</h1>
          <div className="row justify-content-center">
            {
              rooms?.length === 0 ?
              <div className="text-center">

                <img 
                  src="https://c.tenor.com/BxhPC0sF28sAAAAj/calamardo-squidward.gif" 
                  alt="this slowpoke moves"
                  
                  style={{width:"330px"}}/>
                <h1 className="mt-4" style={{color: "#FFEF00"}}>Belum buat Room</h1>

              </div>
              :
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
