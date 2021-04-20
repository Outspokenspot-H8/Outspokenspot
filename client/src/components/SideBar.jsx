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
            <h3>Peraturan & Cara bermain:</h3>
            <ol>
                <li>Cari teman bermain, bisa sahabat, keluarga atau partner anda.</li>  
                <li>Jika kamu tidak punya teman, kamu juga bisa bermain sendiri.</li>
                <li>Buat Room baru dengan memasukan nama room dan tekan submit.</li>
                <li>Pilih berapa banyak orang dalam satu room atau kamu juga bisa masuk ke dalam Room orang lain dengan menekan tombol 'join'.</li>
                <li>Jika pemain sudah berkumpul, pembuat room dapat menekan tombol 'start' untuk memulai permainan.</li>
                <li>Tekan tombol 'start game' untuk memulai permainan.</li>
                <li>Tekan shuffle card untuk mengeluarkan random pertanyaan, dan turn untuk mendapatkan giliran menjawab.</li>
                <li>Jawab dengan jujur setiap pertanyaan dan dapatkan percakapan mendalam dengan partnermu.</li>
            </ol>
          </div>
        </div>
        <nav id="nav">
          <ul style={{marginRight: "0px"}}>
            <li><button type="button" class="btn btn-outline-warning btn-lg" onClick={createRoom}>Create Room</button></li>
          </ul>
        </nav>
    </div>
  )
}
