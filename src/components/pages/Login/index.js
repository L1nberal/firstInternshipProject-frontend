import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axios from 'axios';
import { useContext } from 'react';


import {
    faUser,
    faKey,
    faFeather,
} from '../../../assets/FontAwesome'
import style from './Login.module.scss'
import {AuthContext} from '../../../context/AuthContext'
import Button from '../../Button';
import ErrorPopup from './ErrorPopup';

const cx = classnames.bind(style)

function Login() {
    //destructuring from Authcontext
    const { user, googleSignIn, facebookSignIn, dataBaseLogin } = useContext(AuthContext)
    //used to redirect where is necessary
    const navigate = useNavigate()
    //login with database declaration
    const formSchema = Yup.object().shape({
        username: Yup.string()
            .required('Bạn chưa nhập tên đăng nhập'),
        password: Yup.string()
            .required('Bạn chưa nhập mật khẩu')
            .min(6, 'mật khẩu phải dài ít nhất 6 kí tự'),
         
    })
    const formOptions = { resolver: yupResolver(formSchema)}
    const { register, handleSubmit, reset, formState } = useForm(formOptions)
    const { errors } = formState
    //used to pop up a dialogue when an error exists
    const [popup, setPopup] = useState(false)

    //login with google
    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        try{
            await googleSignIn()
        }catch(error) {
            console.log(error)
        }
    }

    //login with facebook
    const handleFacebookSignIn = async (e) => {
        e.preventDefault()
        try{
            await facebookSignIn()
        }catch(error) {
            console.log(error)
        }
    }

    // login with database
    function onSubmit(data) {
        let jwt = ''
        axios.post('http://localhost:1337/api/auth/local', {
            identifier: data.username,
            password: data.password
        })
            .then(respond => {
                // navigate('/')
                try{
                    dataBaseLogin(respond)
                }catch(error) {
                    console.log(error)
                }
            })
            .catch(error => {
                setPopup(true)  
            })      
        
    }

    // check if user has logged in, then redirect
    useEffect(() => {
        // console.log('user', user)
        if(user != null) {
            navigate('/')
        }
    }, [user])

    return(
        <div className={cx('wrapper')}>
            <h2>Log in</h2>
            {/* ===========a dialogue pops up when an error exists */}
            {popup && <ErrorPopup setPopup={setPopup}/>}
            {/* ==========login form============== */}
            <form method='' action='' onSubmit={handleSubmit(onSubmit)}>
                {/* ===================database login============= */}
                <div className={cx('database-login')}>
                    <div className={cx('database-login-infor-container')}>
                        Tên đăng nhập:
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faUser}/>
                            <input 
                                type='text' 
                                placeholder='email or username' 
                                name='username'
                                {...register('username')}
                                />
                        </div>
                        <div className={cx('invalid-feedback')}>{errors.username?.message}</div>

                        Mật khẩu
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faKey}/>
                            <input 
                                type='password' 
                                placeholder='password' 
                                name='password'
                                {...register('password')}
                            />
                        </div>
                        <div className={cx('invalid-feedback')}>{errors.password?.message}</div>
                    </div>

                    <button className={cx('database-login__submit-btn')}>Submit</button>
                </div>
                {/* =============barrier between database login and other login methods */}
                <span className={cx('barrier')}></span>
                {/* ============login with other methods================ */}
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
                <Button className={cx('user__signup-btn')} to='/sign-up'>
                    <FontAwesomeIcon className={cx('icon')} icon={faFeather}/>
                    Sign up
                </Button>

            </form>

        </div>
    )
}

export default Login