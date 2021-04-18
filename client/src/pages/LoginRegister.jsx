import React, { useState } from 'react'
import '../styles/logress.css'
import OutspokenspotCard from '../assets/outspokenspot-cards.png'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { socket } from '../connections/socketio'

export default function LoginRegister() {
  const [slide, setSlide] = useState('login')
  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: ""
  })
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    location: ""
  })
  const history = useHistory()

  const login = () => {
    axios({
      method: "POST",
      url: 'http://localhost:4000/login',
      data: {
        email: dataLogin.email,
        password: dataLogin.password
      }
    })
      .then(response => {
        localStorage.setItem('id', response.data.id)
        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('username', response.data.username)
        localStorage.setItem('location', response.data.location)
        socket.emit('login', response.data.username)
        history.push('/lobby')
      })
      .catch(err => {
        console.log(err);
      })
  }

  const changeDataLogin = (e) => {
    setDataLogin({
      ...dataLogin,
      [e.target.name]: e.target.value
    })
  }

  const register = () => {

    axios.post('http://localhost:4000/register', {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      location: newUser.location,
    })
    .then(res => {
      // Swal success
      handleSlideLogIn()
    })
    .catch(err => {
      console.log(err);
    })
  }

  const changeDataRegister = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name] : e.target.value
    })
  }

  const handleSlideSignUp = () => {
    setSlide('login')

  }

  const handleSlideLogIn = () => {
    setSlide('signup')
  }

  return (
    <div class="banner">
      <div class="banner-content text-center">
        <img src={OutspokenspotCard} alt="outspoketspot-cards" />
        <h4>This is not a game, more like an intimate session with your friend, family, or your partner. Be honest, be outspoken.</h4>
      </div>
      <div class="form-structor">

          <div class={ slide === 'signup' ? "signup slide-up" : "signup" }>
              <h2 onClick={() => handleSlideSignUp()} class="form-title" id="signup"><span>or</span>Sign up</h2>
              <div class="form-holder">
                  <input onChange={changeDataRegister} value={newUser.username} name="username" type="text" class="input" placeholder="Username" />
                  <input onChange={changeDataRegister} value={newUser.email} name="email" type="email" class="input" placeholder="Email" />
                  <input onChange={changeDataRegister} value={newUser.password} name="password" type="password" class="input" placeholder="Password" />
                  <input onChange={changeDataRegister} value={newUser.location} name="location" type="location" class="input" placeholder="Location" />
              </div>
              <button onClick={() => register()} class="submit-btn">Submit</button>
          </div>

          <div class={ slide === 'login' ? "login slide-up" : "login" }>
              <div class="center">
                  <h2 onClick={() => handleSlideLogIn()} class="form-title" id="login"><span>or</span>Log in</h2>
                  <div class="form-holder">
                      <input onChange={changeDataLogin} value={dataLogin.email} name="email" type="email" class="input" placeholder="Email" />
                      <input onChange={changeDataLogin} value={dataLogin.password} name="password" type="password" class="input" placeholder="Password" />
                  </div>
                  <button onClick={login} class="submit-btn">Let's Go</button>
              </div>
          </div>

      </div>
    </div>
  )
}
