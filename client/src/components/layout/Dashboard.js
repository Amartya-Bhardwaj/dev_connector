import React, { useState, useEffect, Fragment } from 'react';
import Dash from './Dash';
import axios from 'axios';


const Dashboard = (props) => {
  const [User, setUser] = useState('');
    const loginToken = sessionStorage.getItem('myToken')
    const config = {
      headers: {
        "x-auth-token": loginToken,
      },
    }
    useEffect(() => {
      getUser();
    },[]);
    const getUser = () => {
      axios.get(
        '/api/profile/me',
        config
      ).then((resp) => {
        setUser(resp.data)
      }).catch(error => console.error(`Error: ${error}`))
    }
    return(
      <Dash User = {User}/>
    )
}

export default Dashboard