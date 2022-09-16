import React, { useEffect, useState} from "react"
import {UserAuth} from '../../../context/AuthContext'
import {useNavigate} from 'react-router-dom'
import axios from 'axios'


function Account() {
    const {logOut, user} = UserAuth()
    const [name, setName] = useState('')
    const [numberOfApps, setNumberOfApps] = useState('')

    const navigate = useNavigate()

    const handleSignOut = async () => {
        try{
            await logOut()
        }catch(error) {
            console.log(error)
        }
    }
    console.log(process.env.REACT_APP_FULL_ACCESS_TOKEN)
 
    useEffect(() => {
        if(!user) {
            navigate('/login')
        }
    }, [user])

    const submit = async (e) => {
        e.preventDefault()

        
    }

    return(
        <div >
            {user?.displayName && <button onClick={handleSignOut}>Logout</button>}
            {user?.displayName && <div>
                <div>{user.displayName}</div>
                <div>{user.email}</div>
                
                </div>}
            
            <form method='POST' onSubmit={submit}>
                <input name="name" type='text' onChange={e => setName(e.target.value)}/>
                <input name="numberOfApps" type='text' onChange={e =>setNumberOfApps(e.target.value)}/>
                <button name="submit">Submit</button>
            </form>
        </div>
    )
}

export default Account
