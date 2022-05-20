import axios from 'axios';
import React, { useEffect, useState } from 'react'

import Timeline from './Timeline';

const Profiles = () => {
    const [profiles, setProfiles] = useState('');
    useEffect(() => {
        getProfile();
    }, []);
    const getProfile = () => {
        axios.get('/api/profile')
            .then((resp) => {
                setProfiles(resp.data);
            })
            .catch(error => console.error(`Error: ${error}`))
    }
   // console.log(profiles);
    return (
        <Timeline profiles={profiles}/>
    )
}

export default Profiles