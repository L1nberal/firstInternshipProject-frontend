import {useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import $ from "jquery"
import { useContext } from 'react'
import Modal from 'react-bootstrap/Modal';
import ButtonBootstrap from 'react-bootstrap/esm/Button';

import {
    icons
} from '../../../assets'
import style from './Login.module.scss'
import {AuthContext} from '../../../context/AuthContext'
import Button from '../../Button';

const cx = classnames.bind(style)

function Login() {
    //=============destructuring from Authcontext==============
    const { 
        user, 
        googleSignIn, 
        facebookSignIn, 
        dataBaseLogin,
        error,
         setError
    } = useContext(AuthContext)
    // =====show and hide password============
    const [eye, setEye] = useState(icons.faEye)
    const [type, setType] = useState("password")
    //=========used to redirect where is necessary==================
    const navigate = useNavigate()
    //===============checking errors for logging in with database ===============
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
    //====================login with google=================
    const handleGoogleSignIn = async (e) => {
        e.preventDefault()
        try{
            await googleSignIn()
        }catch(error) {
            console.log(error)
        }
    }
    //==========login with facebook=================
    const handleFacebookSignIn = async (e) => {
        e.preventDefault()
        try{
            await facebookSignIn()
        }catch(error) {
            console.log(error)
        }
    }
    // ============login with database================
    function onSubmit(data) {
        dataBaseLogin(data)
    }
    //=========== check if user has logged in, then redirect=================
    useEffect(() => {
        if(user != null) {
            navigate('/')
        }
    }, [user])
    // =============check if error exists==============
    useEffect(() => {
        if(error === true) {
            setShow(true)
        }
    }, [error])
    //================a dialogue pops up when errors occur================
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return(
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Tài khoản hoặc mật khẩu không chính xác, mời bạn thử lại!</Modal.Body>
                <Modal.Footer>
                    <ButtonBootstrap 
                        variant="secondary" 
                        onClick={() => {
                            handleClose()
                            setError(false)
                        }}
                        className={cx('modal-btn')}
                    >
                        Đã hiểu
                    </ButtonBootstrap>
                </Modal.Footer>
            </Modal>

            <div className={cx('login-form-container')}>
                <h2>Log in</h2>
                {/* ==========login form============== */}
                <form method='' action='' onSubmit={handleSubmit(onSubmit)}>
                    {/* ===================database login============= */}
                    <div className={cx('database-login')}>
                        <div className={cx('database-login-infor-container')}>
                            Tên đăng nhập:
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faUser}/>
                                <input 
                                    type='text' 
                                    placeholder='email or username' 
                                    name='username'
                                    className={cx('username-input')}
                                    {...register('username')}
                                    />
                            </div>
                            <div className={cx('invalid-feedback')}>{errors.username?.message}</div>
    
                            Mật khẩu
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faKey}/>
                                <input 
                                    type={type}
                                    placeholder='password' 
                                    name='password'
                                    id='password'
                                    className={cx('password-input')}
                                    {...register('password')}
                                />
                                <button 
                                    type='button'
                                    className={cx('show-password')}
                                    onClick={() => {
                                        if($("#password").attr('type') === "password") {
                                            setEye(icons.faEyeSlash)
                                            setType("text")
                                        }else{
                                            setEye(icons.faEye)
                                            setType("password")
                                        }
                                }}>
                                    <FontAwesomeIcon icon={eye}/>
                                </button>
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
    
                    <Button className={cx('user__signup-btn')} to='/sign-up'>
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faFeather}/>
                        Sign up
                    </Button>
    
                </form>
            </div>

            <Button to='/' className={cx('home-btn')}>Home</Button> 
        </div>
    )
}

export default Login
