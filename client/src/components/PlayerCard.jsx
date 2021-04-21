import React from 'react'
import Video from './Video';

export default function PlayerCard({peer, turn, idx}) {
  return (
    <div className={`d-flex flex-column m-3 card card-${idx}`} style={{width: "21rem", height: "40%"}} id={turn === peer?.user?.username ? "border-active" : ""}>
      <div className="flex-fill align-items-start d-flex justify-content-center bg-secondary" style={{height: "60%"}}>
        <Video peer={peer?.peer} ></Video>
      </div>
      <div className="flex-fill d-flex justify-content-around align-items-center flex-row text-center bg-light" style={{zIndex: "2"}}>
        <h3>{peer.user.username}</h3>
        <p style={{margin: '0px'}}>{peer?.user?.location}</p>
      </div>
    </div>
  )
}
