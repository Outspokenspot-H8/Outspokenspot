import React from 'react'
import LogoNavbar from '../assets/outspokenspot-6.png'
import '../styles/style-play.css'
import { useLocation } from 'react-router-dom'

export default function Navbar() {
  const { pathname } = useLocation()

  return (
    <header>
      <div id="logo">
        <img src={LogoNavbar} alt="outspokenspot logo" />
      </div>
      <nav id="nav">
        <ul className="pt-3">
          {
            pathname !== '/login' && pathname !== '/register' && pathname !== '/' ?
            <li><button type="button" className="btn btn-outline-warning mx-2"><a href="/lobby" style={{textDecoration: "none", color: "inherit"}}>Exit</a></button></li>
            :
            <></>
          }
        </ul>
      </nav>
    </header>
  )
}
