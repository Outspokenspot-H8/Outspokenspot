import React from 'react'
import Avatar from '../assets/avatar.png'
import styled from 'styled-components'
import Video from './Video';

export default function PlayerCard({peer}) {
  return (
    <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
      <div class="flex-fill align-items-start d-flex justify-content-center bg-secondary" style={{height: "60%"}}>
        <Video peer={peer.peer} ></Video>
        {/* <img class="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} /> */}
      </div>
      <div class="flex-fill d-flex justify-content-around align-items-center flex-row text-center bg-light" style={{zIndex: "2"}}>
        <h3>{peer.user.username}</h3>
        <p style={{margin: '0px'}}>{localStorage.location}</p>
      </div>
    </div>
  )
}
