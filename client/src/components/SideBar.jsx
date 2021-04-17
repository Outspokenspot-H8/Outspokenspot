import React from 'react'
import Logo from '../assets/outspokenspot-cards.png'

export default function SideBar() {
  return (
    <div className="sidebar text-center overflow-auto">
      <div className="logo mt-4">
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
            <nav id="nav">
              <button type="button" className="btn btn-outline-warning btn-lg mx-1 mb-5">Create Room</button>
            </nav>
          </div>
        </div>
    </div>
  )
}
