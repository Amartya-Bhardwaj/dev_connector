import React, { Fragment,useState } from 'react'
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'

const Login = ({authenticate}) => {
  const[formData,setFormData] = useState({
    email: '',
    password: '',
  })
  const navigate = useNavigate();
  const {email,password} = formData;
  const onChange = e => setFormData({...formData, [e.target.name]:e.target.value})
  const onSubmit =async e => {
    e.preventDefault();
    const user = {
      email,
      password
    }
    try {
      const config = {
        headers:{
          'Content-Type': 'application/json'
        }
      }
      const body = JSON.stringify(user)
      const res = await axios.post(
        '/api/auth',
        body,
        config
      );
      if(res.data){
        authenticate();
        const token = res.data.token;
        sessionStorage.setItem('myToken',token);
        navigate("dashboard"); 
      }
      // const getToken = sessionStorage.getItem('myToken');
      // console.log(getToken);
    } catch (err) {
      console.error(err.message);
    }
  }
  return (
    <Fragment>
      <div className="alert alert-danger">
        Invalid credentials
      </div>
      <h1 className="large text-primary">Sign In</h1>
      <p className="lead"><i className="fas fa-user"></i> Sign into Your Account</p>
      <form className="form" onSubmit={e=>onSubmit(e)} >
        <div className="form-group">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange = {e=>onChange(e)}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange = {e=>onChange(e)}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
        {/* <Route exact path = "/dashboard" element={<Dashboard/>}/> */}
      </form>
      <p className="my-1">
        Don't have an account? <Link to="/register">Sign Up</Link>
      </p>
    </Fragment>
  )
}

export default Login