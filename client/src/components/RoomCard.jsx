import React from 'react'
import Avatar from '../assets/avatar.png'

export default function RoomCard({user}) {
  return (
    <div class="d-flex flex-row m-3 card" style={{width: "23vw"}}>
      <div class="flex-fill d-flex flex-column align-items-center justify-content-center">
        <img class="my-3" src={Avatar} alt="Card image cap" />
      </div>
      <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
        <h3>{user.username}</h3>
        <p>Location: {user.location}</p>
      </div>
    </div>
  )
}
