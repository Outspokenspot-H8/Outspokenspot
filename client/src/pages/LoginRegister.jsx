import React, { useState } from 'react'
import '../styles/logres.css'
import OutspokenspotCard from '../assets/outspokenspot-cards.png'
import { useHistory } from 'react-router-dom'
import axios from 'axios'
import { socket } from '../connections/socketio'
import Swal from 'sweetalert2'

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
      url: 'https://outspokenspot-h8.herokuapp.com/login',
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
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.response.data.message,
          customClass: 'stepSwalCustom'
        })
      })
  }

  const changeDataLogin = (e) => {
    setDataLogin({
      ...dataLogin,
      [e.target.name]: e.target.value
    })
  }

  const register = () => {

    axios.post('https://outspokenspot-h8.herokuapp.com/register', {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      location: newUser.location,
    })
    .then(res => {
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })
      
      Toast.fire({
        icon: 'success',
        title: 'Register success!'
      })
      handleSlideLogIn()
    })
    .catch(error => {
      let str = error.response.data.errors.join('\n')
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        html: '<pre style="font-family: Chakra Petch, sans-serif; color: #8E44AD">' + str + '</pre>',
        customClass: 'stepSwalCustom'
      })
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
    <div className="banner">
      <div className="banner-content text-center">
        <img src={OutspokenspotCard} alt="outspoketspot-cards" />
        <h4>This is not a game, more like an intimate session with your friend, family, or your partner. Be honest, be outspoken.</h4>
      </div>
      <div className="form-structor">
          <div className={ slide === 'signup' ? "signup slide-up" : "signup" }>
              <h2 onClick={() => handleSlideSignUp()} className="form-title" id="signup"><span>or</span>Sign up</h2>
              <div className="form-holder">
                  <input onChange={changeDataRegister} value={newUser.username} name="username" type="text" className="input" placeholder="Username" />
                  <input onChange={changeDataRegister} value={newUser.email} name="email" type="email" className="input" placeholder="Email" />
                  <input onChange={changeDataRegister} value={newUser.password} name="password" type="password" className="input" placeholder="Password" />
                  <input onChange={changeDataRegister} value={newUser.location} name="location" type="location" className="input" placeholder="Location" />
              </div>
              <button onClick={() => register()} className="submit-btn">Submit</button>
          </div>

          <div className={ slide === 'login' ? "login slide-up" : "login" }>
              <div className="center">
                  <h2 onClick={() => handleSlideLogIn()} className="form-title" id="login"><span>or</span>Log in</h2>
                  <div className="form-holder">
                      <input onChange={changeDataLogin} value={dataLogin.email} name="email" type="email" className="input" placeholder="Email" />
                      <input onChange={changeDataLogin} value={dataLogin.password} name="password" type="password" className="input" placeholder="Password" />
                  </div>
                  <button onClick={login} className="submit-btn">Let's Go</button>
              </div>
          </div>

      </div>
    </div>
  )
}
