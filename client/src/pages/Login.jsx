import React, {useState, useRef, useEffect} from 'react'
import {useHistory} from 'react-router-dom'
import '../styles/Logres.css'
import axios from 'axios'
import { socket } from '../connections/socketio'

export default function Login() {
  const history = useHistory()

  useEffect(() => {
  }, [])

  const [dataLogin, setDataLogin] = useState({
    email: "",
    password: ""
  })
  
  const login = (e) => {
    e.preventDefault()
    console.log('masuk login');
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
        history.push('/')
      })
      .catch(err => {
        console.log(err);
      })
  }

  const changeData = (e) => {
    setDataLogin({
      ...dataLogin,
      [e.target.name]: e.target.value
    })
  }


  return (
    <div class="container">
        <div class="row px-3">
          <div class="card col-lg-10 flex-row mx-auto px-0" style={{marginTop: "100px"}}>
            <div class="img-left d-none d-md-flex"></div>
            <div class="card-body flex-fill">
              <h4 class="title text-center mt-4">
                Login to your account
              </h4>
              <form onSubmit={login} class="form-box px-3" action="">
                <div class="form-input">
                  <span><i class="bi bi-envelope"></i></span>
                  <input 
                    type="email"
                    name="email"
                    onChange={changeData}
                    value={dataLogin.email} 
                    placeholder="email address" 
                    required/>
                </div>
                <div class="form-input">
                  <span><i class="bi bi-key"></i></span>
                  <input 
                    type="password" 
                    name="password"
                    onChange={changeData}
                    value={dataLogin.password} 
                    placeholder="password" 
                    required/>
                </div>
                <div class="mb-3">
                  <div class="custom-control custom-checkbox">
                    <input type="checkbox" class="custom-control-input" id="cb1"/>
                    <label for="cb1" class="custom-control-label">Remember me?</label>
                  </div>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-block text-uppercase"> Login</button>
                </div>
                <hr class="mt-5"/>
                <p>{dataLogin.email}</p>
                <p>{dataLogin.password}</p>
              </form>
            </div> 
          </div>
        </div>
      </div>
  )
}
