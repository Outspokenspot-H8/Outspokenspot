import React, { useEffect, useState, useRef } from 'react'
import Avatar from '../assets/avatar.png'
import Loading from '../assets/loading.gif'
import RoomCard from '../components/RoomCard'
import { socket } from '../connections/socketio'
import { useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'

export default function Room() {
  const [room, setRoom] = useState({})
  const [user, setUser] = useState('')
  const [ava, setAva]  = useState('')
  const { name } = useParams()
  const history = useHistory()

  useEffect(() => {
    socket.on('room-detail', (roomDetail) => {
      setRoom(roomDetail)
      setAva(`https://avatars.dicebear.com/api/bottts/${roomDetail.admin}.svg`)
    })
    setUser(localStorage.username)

    socket.emit('fetch-room-detail', name)
    socket.on('fetched-room-detail', (roomDetail) => {
      setRoom(roomDetail)
    })
    setUser(localStorage.username)
    
    socket.on('started-game', (data) => {
      history.push(`/play/${data}`)
    })
  }, [])

  const handleStartGame = () => {
    history.push(`/play/${room.name}`)
    socket.emit('start-game', room.name)
  }

  return (
    <div>
      <main>
        <div class="banner">
          <div class="d-flex flex-row all-content">
            <div class="box-admin">
              <h1 class="banner-title">Room Name:</h1>
              <h3 class="banner-title">{room.name?.toUpperCase()}</h3>
              <div class="d-flex flex-row m-3 card" style={{width: "20rem"}}>
                <div class="flex-fill d-flex flex-column align-items-center justify-content-center">
                  <img class="my-3 border rounded-3" src={ava} alt="Card image cap" style={{width: "120px"}}/>
                  <h4>Admin</h4>
                </div>
                <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
                  <h3>{room.admin}</h3>
                </div>
              </div>

              {
                room.admin === user ?
                <div className="d-flex justify-content-center my-3">
                  <button onClick={() => handleStartGame()} type="button" className="btn-lg btn-danger" id="logout">Start</button>
                </div>
                :
                <div class="d-flex flex-row mx-3 p-2 card" style={{width: "20rem"}}>
                  <div class="text-center">
                    <div>
                      <img class="mx-1" src={Loading} alt="Card image cap" style={{height: "50px"}} width="50px" />
                      <span class="my-auto">Your Admin will start the game</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div class="box-user">
              {
                room?.users?.map(user => {
                  return <RoomCard user={user} key={user.id} />
                })
              }

            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
