import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {
    faUser,
    faKey,
} from '../../../assets/FontAwesome'
import style from './Login.module.scss'
import {UserAuth} from '../../../context/AuthContext'
import Button from '../../Button';

const cx = classnames.bind(style)
export let isLoggedin = false

function Login() {
    const {user, logOut, googleSignIn, facebookSignIn} = UserAuth()
    const navigate = useNavigate()

    //login with google
    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        try{
            await googleSignIn();
        }catch(error) {
            console.log(error)
        }
    }
    //login with facebook
    const handleFacebookSignIn = async () => {
        try{
            await facebookSignIn();
        }catch(error) {
            console.log(error)
        }
    }

    const handleLogOut = async () => {
        try{
            await logOut()
        }catch(error) {
            console.log(error)
        }
    }

    useEffect(() => {
        console.log('user', user)
        if(user != null) {
            navigate('/')
            isLoggedin = true
        }else {
            isLoggedin = false
        }
    }, [user])

    return(
        <div className={cx('wrapper')}>
            <h2>Log in</h2>

            <form method='' action=''>
                <div className={cx('database-login')}>
                    <div className={cx('database-login-infor-container')}>
                        Tên đăng nhập:
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faUser}/>
                            <input type='text' placeholder='email or username'/>
                        </div>
                    </div>

                    <div className={cx('database-login-infor-container')}>
                        Mật khẩu
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faKey}/>
                            <input type='password' placeholder='password'/>
                        </div>
                    </div>

                    <button className={cx('database-login__submit-btn')}>Submit</button>
                </div>

                <span className={cx('barrier')}></span>

                <div className={cx('other-login-methods')}>
                    <button
                        className={cx('other-login-methods__google-login')}
                        onClick={handleGoogleSignIn}
                    >
                        <img src='https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK'/>
                        Login with google
                    </button>
        
                    <button 
                        className={cx('other-login-methods__facebook')}   
                        onClick={handleFacebookSignIn}
                    >
                        <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png'/>
                        Login with Facebook
                    </button>
                    {/* {user?.displayName ? <button onClick={handleSignOut}>logout</button> : <Link to='/login'>Signin</Link>} */}
                </div>

                <Button to='/' className={cx('home-btn')}>Home</Button>   
            </form>

        </div>
    )
}

export default Login
