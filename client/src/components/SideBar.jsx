import React from 'react'
import Logo from '../assets/outspokenspot-cards.png'
import Swal from 'sweetalert2'


export default function SideBar() {
  const createRoom = () => {
    Swal.mixin({
      input: 'text',
      confirmButtonText: 'Next &rarr;',
      showCancelButton: true,
      progressSteps: ['1', '2', '3']
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
      }
    ]).then((result) => {
      if (result.value) {
        const answers = JSON.stringify(result.value)
        Swal.fire({
          title: 'All done!',
          html: `
            Your answers:
            <pre><code>${answers}</code></pre>
          `,
          confirmButtonText: 'Lovely!'
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
            <h3>How to Play & the Rules:</h3>
            <ol>
                <li>Find someone to play with, could be your family, friend, or your significant other.</li>
                <li>It's okay if you don't have one. You could ask yourself anyway.</li>
                <li>Shuffle the outspokenspot cards by click the Pick Random Card button.</li>
                <li>Once it stops, answer the questions on the card.</li>
                <li>Make sure you answer the question outspokenly.</li>
                <li>You could do this over and over and you won't get same question at one go.</li>
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
