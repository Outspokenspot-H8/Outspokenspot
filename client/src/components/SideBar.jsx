import React from 'react'
import Logo from '../assets/outspokenspot-cards.png'
import Swal from 'sweetalert2'
import { socket } from '../connections/socketio'


export default function SideBar() {
  const createRoom = () => {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3', '4'],
      customClass: 'stepSwalCustom'
    }).queue([
      {
        title: 'Room Name',
        text: 'Create Your Outspoken Room'
      },
      {
        title: "Player's Room",
        text: 'Maximum players in your Room',
        input: 'select',
        inputOptions: {1:1, 2:2, 3:3, 4:4} 
      },
      {
        title: "Question's Quantity",
        text: 'Maximum questions in Game',
        input: 'select',
        inputOptions: {10:10, 20:20, 30:30, 40:40} 
      }
    ]).then((result) => {
      if (result.value) {
        let payload = {
          'room-name': result.value[0],
          max: Number(result.value[1]),
          queQuantity: Number(result.value[2]),
          admin: localStorage.username,
        }
        socket.emit('create-room', payload)
        socket.on('updated-room', (data) => {
          if(data){
            Swal.fire({
              icon: 'success',
              title: 'Success Create Room!',
              text: `You are an admin in ${result.value[0]} Room`,
              confirmButtonText: 'Done',
              customClass: 'stepSwalCustom'
            })
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Failed Create Room!',
              text: `Room has been exist!`,
              confirmButtonText: 'Done',
              customClass: 'stepSwalCustom'
            })
          }
        })
      }
    })
  }
  return (
    <div className="sidebar text-center">
      <div className="logo">
        <img src={Logo} alt="outspoketspot-cards" />
      </div>
      <div className="about-us">
        <div className="about-us-content">
            <h3>Cara Bermain:</h3>
            <ol>
                <li>Cari teman bermain, bisa sahabat, keluarga, partner, bahkan dengan orang yang tidak anda kenal.</li>
                <li>Buat Room baru dengan menekan tombol Create Room, masukan nama room dan jumlah pemain.</li>
                <li>Kamu juga bisa masuk ke dalam Room player lain dengan menekan tombol 'Join'.</li>
                <li>Jika pemain sudah berkumpul, pembuat room dapat menekan tombol 'Start' untuk memulai permainan.</li>
            </ol>
          </div>
        </div>
        <nav id="nav">
          <ul style={{marginRight: "0px"}}>
            <li><button type="button" className="btn btn-outline-warning btn-lg" onClick={createRoom}>Create Room</button></li>
          </ul>
        </nav>
    </div>
  )
}
