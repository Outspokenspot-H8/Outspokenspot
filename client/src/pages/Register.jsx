import React, {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Axios from 'axios'

export default function Register() {
  const history = useHistory()

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    location: ""
  })

  const register = (e) => {
    e.preventDefault()
    console.log('masuk register jsx');
    Axios.post('http://localhost:4000/register', {
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      location: newUser.location,
    })
    .then(res => {
      console.log(res);
      history.push('/login')
    })
    .catch(err => {
      console.log(err);
    })
  }
  
  const changeData = (e) => {
    setNewUser({
      ...newUser,
      [e.target.name] : e.target.value
    })
  }

  return (
    <div class="container">
        <div class="row px-3">
          <div class="card col-lg-10 flex-row mx-auto px-0" style={{marginTop: "100px", marginBottom: "80px"}}>
            <div class="img-left d-none d-md-flex"></div>
            <div class="card-body">
              <h4 class="title text-center mt-4">
                Register
              </h4>
              <form onSubmit={register} class="form-box px-3" action="">
                <div class="form-input">
                  <span><i class="bi bi-person"></i></span>
                  <input 
                    type="text" 
                    name="username" 
                    placeholder="username"
                    onChange={changeData}
                    value={newUser.username} 
                    required/>
                </div>
                <div class="form-input">
                  <span><i class="bi bi-envelope"></i></span>
                  <input 
                    type="email" 
                    name="email" 
                    placeholder="email address" 
                    onChange={changeData}
                    value={newUser.email} 
                    required/>
                </div>
                <div class="form-input">
                  <span><i class="bi bi-key"></i></span>
                  <input 
                    type="password" 
                    name="password" 
                    placeholder="password" 
                    onChange={changeData}
                    value={newUser.password} 
                    required/>
                </div>
                <div class="form-input">
                  <span><i class="bi bi-geo-alt"></i></span>
                  <input 
                    type="text" 
                    name="location" 
                    placeholder="your location" 
                    onChange={changeData}
                    value={newUser.location} 
                    required/>
                </div>
                <div class="mb-3">
                  <button type="submit" class="btn btn-block text-uppercase"> Login</button>
                </div>
                <hr class="mt-5"/>
                <div class="text-center mb-2">
                  Don't have account? 
                  <a class="register-link" href=""> Register here</a>
                </div>
              </form>
            </div> 
          </div>
        </div>
      </div>
  )
}
