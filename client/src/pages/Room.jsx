import React, { useEffect, useState } from 'react'
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
        <div className="banner">
          <div className="d-flex flex-row all-content">
            <div className="box-admin">
              <h1 className="banner-title">Room Name:</h1>
              <h3 className="banner-title">{room.name?.toUpperCase()}</h3>
              <div className="d-flex flex-row m-3 card" style={{width: "20rem"}}>
                <div className="flex-fill d-flex flex-column align-items-center justify-content-center">
                  <img className="my-3 border rounded-3" src={ava} alt="admin avatar room" style={{width: "120px"}}/>
                  <h4>Admin</h4>
                </div>
                <div className="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
                  <h3>{room.admin}</h3>
                </div>
              </div>

              {
                room.admin === user ?
                <div className="d-flex justify-content-center my-2">
                  <button onClick={() => handleStartGame()} type="button" className="btn-lg btn-danger" id="logout">Start</button>
                </div>
                :
                <div className="d-flex flex-row mx-3 p-2 card" style={{width: "20rem"}}>
                  <div className="text-center">
                    <div>
                      <img className="mx-1" src={Loading} alt="loading" style={{height: "50px"}} width="50px" />
                      <span className="my-auto">Your Admin will start the game</span>
                    </div>
                  </div>
                </div>
              }
            </div>

            <div className="box-user">
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
