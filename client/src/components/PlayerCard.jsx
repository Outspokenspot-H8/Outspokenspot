import React from 'react'
import Avatar from '../assets/avatar.png'
import styled from 'styled-components'

const StyledVideo = styled.video`
    height: 20%;
    width: 20%;
`;

export default function PlayerCard() {
  return (
    <div class="d-flex flex-column m-3 card" style={{width: "21rem", height: "40%"}}>
      <div class="flex-fill d-flex flex-column align-items-center justify-content-center bg-secondary">
        <img class="my-3" src={Avatar} alt="Card image cap" style={{height: "100px"}} />
      </div>
      <div class="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
        <h3>Hilman</h3>
        <p>Location: Padang</p>
      </div>
    </div>
  )
}
