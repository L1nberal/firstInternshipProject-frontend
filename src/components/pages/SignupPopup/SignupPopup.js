import React, { useState } from "react"
import classnames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import {useNavigate} from 'react-router-dom'
import Button from "react-bootstrap/esm/Button"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import axios from "axios"
import Modal from "react-bootstrap/esm/Modal"

import style from './SignupPopup.module.scss'
import { icons } from "../../../assets"
import { UserAuth } from "../../../context/AuthContext"

const cx = classnames.bind(style)

function SignupPopup () {
    const { userEmail, dataBaseLogin, from, isUsed} = UserAuth()
    console.log(from)
    console.log(isUsed)
    //===========confirm password form handler==============
    const formSchema = Yup.object().shape({
        username: Yup.string()
            .required('Bạn chưa nhập tên người dùng'),
        password: Yup.string()
            .required('Bạn chưa nhập mật khẩu')
            .min(6, 'Mật khẩu phải bằng hoặc dài hơn 6 kí tự'),
        confirmPwd: Yup.string() //confirm password
            .required('Bạn chưa xác nhận mật khẩu')
            .oneOf([Yup.ref('password')], 'Mật khẩu không khớp'),
    })

    const formOptions = { resolver: yupResolver(formSchema) }
    const {register, handleSubmit, formState} = useForm(formOptions)
    const { errors } = formState
    // ===============navigate============
    const navigate = useNavigate()
    //==============submit handler==================
    async function onSubmit(data) {
        let avatar = new FormData()
        let avatarId
        avatar.append('files', data.avatar[0])

        await axios.post('http://localhost:1337/api/upload', avatar, {
            headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        }
        )
            .then(async (response) => {
                avatarId = response.data[0].id
            }, (error) => {
                console.log(error);
            });

        //==========axios submit by POST method to register a new account============
        axios.post('http://localhost:1337/api/auth/local/register', {  
            username: data.username,
            email: userEmail,
            isAdmin: false,
            password: data.password,
            from: from,
            avatar: avatarId
        })
            .then(async(respond) => {
                await dataBaseLogin(respond)
                navigate('/')
            })
            .catch(error => {
                setShow(true)
            })
    }

    //a dialogue pops up when errors occur
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    
    return (
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Thông tin bạn nhập không khả dụng, mời bạn thử lại!</Modal.Body>
                <Modal.Footer>
                    <Button 
                        variant="secondary" 
                        onClick={handleClose}
                        className={cx('modal-btn')}
                    >
                        Đã hiểu
                    </Button>
                </Modal.Footer>
            </Modal>

            <form method='' action='' onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('container')}>
                    <span>Tên người dùng:</span>
                    <div className={cx('container__username', 'container__infor')}>
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faUser}/>
                        <input 
                            type='text' 
                            placeholder='username' 
                            name='username' 
                            {...register('username')}
                        />
                    </div>
                    <div className={cx('invalid-feedback')}>{errors.username?.message}</div>

                    <span>Email:</span>
                    <div className={cx('container__email', 'container__infor')}>
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faUser}/>
                        <input 
                            value={userEmail}
                            disabled
                            type='email' 
                            placeholder='username' 
                            name='email' 
                        />
                    </div>

                    <span>Mật khẩu:</span>
                    <div className={cx('container__email', 'container__infor')}>
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faKey}/>
                        <input 
                            type='password' 
                            placeholder='password' 
                            name='password' 
                            {...register('password')}
                        />
                    </div>
                    <div className={cx('invalid-feedback')}>{errors.password?.message}</div>

                    <span>Nhập lại mật khẩu:</span>
                    <div className={cx('container__email', 'container__infor')}>
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faKey}/>
                        <input 
                            type='password' 
                            placeholder='password' 
                            name='emapasswordil' 
                            {...register('confirmPwd')}
                        />
                    </div>
                    <div className={cx('invalid-feedback')}>{errors.confirmPwd?.message}</div>


                    <span>Hình đại diện:</span>
                    <div className={cx('container__username', 'container__infor')}>
                        <input 
                            required
                            type='file' 
                            placeholder='username' 
                            name='username' 
                            {...register('avatar')}
                        />
                    </div>
                </div>

                <button className={cx('submit-btn')} variant="info">Sign up</button>
            </form>
        </div>
    )
}

export default SignupPopup
