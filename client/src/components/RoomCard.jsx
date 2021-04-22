import React, { useEffect, useState } from 'react'

export default function RoomCard({user}) {
  const [ava, setAva ] = useState('')

  useEffect(() => {
    setAva(`https://avatars.dicebear.com/api/bottts/${user.username}.svg`)
  }, [user.username])

  return (
    <div className="d-flex flex-row m-3 card" style={{width: "23vw"}} id="user">
      <div className="flex-fill d-flex flex-column align-items-center justify-content-center">
        <img className="my-3 rounded-3" src={ava} alt="player avatar" style={{width: "100px"}} />
      </div>
      <div className="flex-fill d-flex justify-content-center align-items-center flex-column text-center">
        <h3>{user.username}</h3>
        <p>Location: {user.location}</p>
      </div>
    </div>
  )
}
