import React, { useEffect, useState } from 'react'
import '../styles/style-play.css'
import LobbyCard from '../components/LobbyCard'
import SideBar from '../components/SideBar'
import { socket } from '../connections/socketio'

export default function Lobby() {

  const [rooms, setRooms] = useState([])

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('id')
    localStorage.removeItem('username')
    localStorage.removeItem('location')
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

  if (rooms?.length === 0){
    return (
      <div>
      <SideBar />
        <main>
          <div className="d-flex justify-content-end mx-4">
            <a onClick={handleLogout} href="/" type="button" className="btn btn-danger mt-4" id="logout">LOG OUT</a>
          </div>
          <div className="banner-lobby" style={{height: "90vh"}}>
            <h1 className="my-4" style={{color: "#FFEF00"}}>Outspoken Room</h1>
            <div className="row justify-content-center" style={{height: "60vh", width: "60vh"}} id="loading-image">
            </div>
            <h3 className="my-4" style={{color: "#FFEF00"}}>Room is Unavailable</h3>
          </div>
        </main>
      </div>
    )
  }

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
              <></>
              :
              rooms?.map((room, i) => {
                return <LobbyCard room={room} key={i} idx={i}/>
              })
            }
          </div>
        </div>
      </main>
    </div>
  )
}
