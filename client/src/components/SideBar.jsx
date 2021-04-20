import React from 'react'
import Logo from '../assets/outspokenspot-cards.png'

export default function SideBar() {
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
            {/* <nav id="nav">
              <button type="button" className="btn btn-outline-warning btn-lg mx-1 mb-5">Create Room</button>
            </nav> */}
          </div>
        </div>
        <nav id="nav">
          <ul style={{marginRight: "0px"}}>
            <li><button type="button" class="btn btn-outline-warning btn-lg">Create Room</button></li>
          </ul>
        </nav>
    </div>
  )
}
