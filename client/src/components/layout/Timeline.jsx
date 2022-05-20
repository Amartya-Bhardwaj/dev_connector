import React from 'react'
import { Link } from 'react-router-dom'

const Timeline = (props) => {
    const displayProfiles = (props) => {
        const { profiles } = props;
        if (profiles.length > 0) {
            return (
                profiles.map((profile, index) => {
                    console.log(profile);
                    // destructuring nested object.
                    const { user: {id, name, avatar }} = profile;
                    return (
                        <section className="container">
                            <div className="profiles">
                                <div className="profile bg-light">
                                    <img
                                        className="round-img"
                                        src={avatar}
                                        alt=""
                                    />
                                    <div>
                                        <h2>{name}</h2>
                                        <p>{profile.status}</p>
                                        <p>{profile.company}</p>
                                        <Link to="/profile" classNameName="btn btn-primary">View Profile</Link>
                                    </div>

                                    <ul>
                                        <li className="text-primary">
                                            <i className="fas fa-check"></i> {profile.skills.map(skill=><p>{skill}</p>)}
                                        </li>
                                        
                                    </ul>
                                </div>
                            </div>
                        </section>
                    )

                })
            )
        }
    }

    return (
        <>
            <h1 className="large text-primary">Developers</h1>
      <p className="lead">
        <i className="fab fa-connectdevelop"></i> Browse and connect with developers
      </p>
            {displayProfiles(props)}
        </>
    )
}

export default Timeline