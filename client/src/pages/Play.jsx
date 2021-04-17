import React, { useEffect, useState } from 'react'
import Avatar from '../assets/avatar.png'
import BlankCard from '../assets/blank-cards-3.png'
import { useParams } from 'react-router-dom'
import { socket } from '../connections/socketio'

export default function Play() {
  const [room, setRoom] = useState({})
  const { name } = useParams()

  useEffect(() => {
    socket.emit('get-room-detail', name)
    socket.on('got-room-detail', (roomDetail) => {
      setRoom(roomDetail)
    })
  }, [])

  return (
    <main>
      <div class="banner-play">
        
        <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
          <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary">
            <img class="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} />
          </div>
          <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
            <h3>Hilman</h3>
            <p>Location: Padang</p>
          </div>
        </div>
        
        <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
          <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary">
            <img class="my-3" src={Avatar} alt="Card image cap" />
          </div>
          <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
            <h3>Hilman</h3>
            <p>Location: Padang</p>
          </div>
        </div>

        <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
          <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary">
            <img class="my-3" src={Avatar} alt="Card image cap" />
          </div>
          <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
            <h3>Hilman</h3>
            <p>Location: Padang</p>
          </div>
        </div>

        <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
          <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary">
            <img class="my-3" src={Avatar} alt="Card image cap" />
          </div>
          <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
            <h3>Hilman</h3>
            <p>Location: Padang</p>
          </div>
        </div>

        <div id="div-card">
          <div class="d-flex text-center justify-content-center align-items-center">
            <h1 id="question-text">ASDJNDWPIFPIJOASKFV</h1>
            <img src={BlankCard} style={{width: "250px", height: "350px"}} alt="outspoketspot-cards" />
          </div>
          <h2>Username</h2>
          <div class="d-flex flex-row">
            <button class="btn btn-secondary my-1 mx-2">Shuffle Card</button> 
            <button class="btn btn-secondary my-1 mx-2">Turn</button>
          </div>
        </div>
      </div>
    </main>
  )
}
