import {useNavigate, useParams} from 'react-router-dom'
import React from 'react'
import { useEffect, useState } from 'react'
import classnames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import axios from 'axios';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'

import {
    faUser,
    faKey,
    faRightToBracket,

} from '../../../assets/FontAwesome'
import style from './Signup.module.scss'
import {UserAuth} from '../../../context/AuthContext'
import Button from '../../Button';

const cx = classnames.bind(style)

function Signup() {
    const {user, googleSignIn, facebookSignIn} = UserAuth()
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
    const handleFacebookSignIn = async (e) => {
        e.preventDefault()
        try{
            await facebookSignIn();
        }catch(error) {
            console.log(error)
        }
    }

    //confirm password form handler
    const formSchema = Yup.object().shape({
        username: Yup.string()
            .required('Bạn chưa nhập tên người dùng'),
        email: Yup.string()
            .required('Bạn chưa nhập email'),
        password: Yup.string()
            .required('Bạn chưa nhập mật khẩu')
            .min(6, 'Mật khẩu phải bằng hoặc dài hơn 6 kí tự'),
        confirmPwd: Yup.string() //confirm password
            .required('Bạn chưa xác nhận mật khẩu')
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
        
    })
    const formOptions = { resolver: yupResolver(formSchema) }
    const {register, handleSubmit, reset, formState} = useForm(formOptions)
    const { errors } = formState

    //submit handler
    function onSubmit(data) {
        //axios submit by POST method to register a new account
        axios.post('http://localhost:1337/api/auth/local/register', {  
            username: data.username,
            email: data.email,
            isAdmin: true,
            password: data.password,
        })
            .then(respond => {console.log(respond)})
            .catch(error => {console.log(error)})
    }
    
    return(
        <div className={cx('wrapper')}>
            <h2>Sign up</h2>

            <form method='' action='' onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('database-login')}>
                    <div className={cx('database-login-infor-container')}>
                        Tên người dùng:
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faUser}/>
                            <input 
                                type='text' 
                                placeholder='username' 
                                name='username' 
                                {...register('username')}
                            />
                        </div>
                        <div className={cx('invalid-feedback')}>{errors.username?.message}</div>

                        Email:
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faUser}/>
                            <input 
                                type='email' 
                                placeholder='username' 
                                name='email' 
                                {...register('email')}

                            />
                        </div>
                        <div className={cx('invalid-feedback')}>{errors.email?.message}</div>

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
                        
                        Nhập lại mật khẩu:
                        <div>
                            <FontAwesomeIcon className={cx('icon')} icon={faKey}/>
                            <input 
                                type='password' 
                                placeholder='password' 
                                name='password'
                                {...register('confirmPwd')}
                            />
                        </div>
                        <div className={cx('invalid-feedback')}>{errors.confirmPwd?.message}</div>
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
                <Button className={cx('user__login-btn')} to='/log-in'>
                    <FontAwesomeIcon className={cx('icon')} icon={faRightToBracket}/>
                    Log in
                </Button>  
            </form>

        </div>
    )
}

export default Signup
