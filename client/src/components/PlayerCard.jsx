import React from 'react'
import Avatar from '../assets/avatar.png'
import styled from 'styled-components'
import Video from './Video';

export default function PlayerCard({peer}) {

  return (
    <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
      <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary" style={{height: "60%"}}>
        <Video peer={peer.peer} ></Video>
        {/* <img class="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} /> */}
      </div>
      <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center pt-3" style={{zIndex: "2"}}>
        <h3>{peer.user.username}</h3>
        <p>Location: {peer.user.location}</p>
      </div>
    </div>
  )
}
