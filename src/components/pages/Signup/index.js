import { useNavigate } from 'react-router-dom';
import React from 'react';
import { useEffect, useState } from 'react';
import classnames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import Modal from 'react-bootstrap/Modal';
import ButtonBootstrap from 'react-bootstrap/esm/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import $ from 'jquery';

import { icons } from '../../../assets';
import style from './Signup.module.scss';
import { UserAuth } from '../../../context/AuthContext';
import Button from '../../Button';

const cx = classnames.bind(style);

function Signup() {
    // =====show and hide password============
    const [eye, setEye] = useState(icons.faEye);
    const [type, setType] = useState('password');

    const [confirmEye, setConfirmEye] = useState(icons.faEye);
    const [confirmType, setConfirmType] = useState('password');
    //=========used to redirect where is necessary==================
    const navigate = useNavigate();
    // ============destructring from UserAuth()===============
    const { googleSignIn, facebookSignIn, user } = UserAuth();
    //=========== check if user has logged in, then redirect=================
    useEffect(() => {
        if (user != null) {
            navigate('/');
        }
    }, [user]);
    //============login with google====================
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error);
        }
    };
    //=============login with facebook=================
    const handleFacebookSignIn = async (e) => {
        e.preventDefault();
        try {
            await facebookSignIn();
        } catch (error) {
            console.log(error);
        }
    };

    //==========confirm password form handler==============
    const formSchema = Yup.object().shape({
        username: Yup.string().required('B???n ch??a nh???p t??n ng?????i d??ng'),
        email: Yup.string().required('B???n ch??a nh???p email'),
        password: Yup.string().required('B???n ch??a nh???p m???t kh???u').min(6, 'M???t kh???u ph???i b???ng ho???c d??i h??n 6 k?? t???'),
        confirmPwd: Yup.string() //confirm password
            .required('B???n ch??a x??c nh???n m???t kh???u')
            .oneOf([Yup.ref('password')], 'M???t kh???u kh??ng kh???p'),
    });
    const formOptions = { resolver: yupResolver(formSchema) };
    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    //===============submit handler===============
    function onSubmit(data) {
        // ==================get photo file to upload========
        let file = new FormData();
        let fileId;
        file.append('files', data.avatar[0]);
        // =============upload avatar==========
        axios
            .post('http://localhost:1337/api/upload', file, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {
                fileId = respond.data[0].id;
                //=======axios submit by POST method to register a new account===========
                axios
                    .post('http://localhost:1337/api/auth/local/register', {
                        username: data.username,
                        email: data.email,
                        isAdmin: false,
                        password: data.password,
                        avatar: fileId,
                    })
                    .then((respond) => {
                        navigate('/log-in');
                    })
                    .catch((error) => {
                        setShow(true);
                    });
            })
            .catch((error) => console.log(error));
    }
    //=============a dialogue pops up when errors occur==============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>C?? l???i x???y ra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>T??n ng?????i d??ng ho???c email ???? t???n t???i, m???i b???n th??? l???i!</Modal.Body>
                <Modal.Footer>
                    <ButtonBootstrap variant="secondary" onClick={handleClose} className={cx('modal-btn')}>
                        ???? hi???u
                    </ButtonBootstrap>
                </Modal.Footer>
            </Modal>

            <div className={cx('signup-form-container')}>
                <h2>Sign up</h2>

                <form method="" action="" onSubmit={handleSubmit(onSubmit)}>
                    <div className={cx('database-login')}>
                        <div className={cx('database-login-infor-container')}>
                            T??n ng?????i d??ng:
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faUser} />
                                <input type="text" placeholder="username" name="username" {...register('username')} />
                            </div>
                            <div className={cx('invalid-feedback')}>{errors.username?.message}</div>
                            Email:
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faUser} />
                                <input type="email" placeholder="username" name="email" {...register('email')} />
                            </div>
                            <div className={cx('invalid-feedback')}>{errors.email?.message}</div>
                            M???t kh???u
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faKey} />
                                <input
                                    type={type}
                                    placeholder="password"
                                    name="password"
                                    id="password"
                                    {...register('password')}
                                />

                                <button
                                    type="button"
                                    className={cx('show-password')}
                                    onClick={() => {
                                        if ($('#password').attr('type') === 'password') {
                                            setEye(icons.faEyeSlash);
                                            setType('text');
                                        } else {
                                            setEye(icons.faEye);
                                            setType('password');
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={eye} />
                                </button>
                            </div>
                            <div className={cx('invalid-feedback')}>{errors.password?.message}</div>
                            Nh???p l???i m???t kh???u:
                            <div>
                                <FontAwesomeIcon className={cx('icon')} icon={icons.faKey} />
                                <input
                                    type={confirmType}
                                    placeholder="password"
                                    name="confirmPwd"
                                    id="confirmPwd"
                                    {...register('confirmPwd')}
                                />

                                <button
                                    type="button"
                                    className={cx('show-password')}
                                    onClick={() => {
                                        if ($('#confirmPwd').attr('type') === 'password') {
                                            setConfirmEye(icons.faEyeSlash);
                                            setConfirmType('text');
                                        } else {
                                            setConfirmEye(icons.faEye);
                                            setConfirmType('password');
                                        }
                                    }}
                                >
                                    <FontAwesomeIcon icon={confirmEye} />
                                </button>
                            </div>
                            <div className={cx('invalid-feedback')}>{errors.confirmPwd?.message}</div>
                            ???nh ?????i di???n:
                            <div>
                                <input
                                    required
                                    type="file"
                                    name="avatar"
                                    className={cx('avatar-input')}
                                    {...register('avatar')}
                                />
                            </div>
                        </div>

                        <button className={cx('database-login__submit-btn')}>Submit</button>
                    </div>

                    <span className={cx('barrier')}></span>

                    <div className={cx('other-login-methods')}>
                        <button className={cx('other-login-methods__google-login')} onClick={handleGoogleSignIn}>
                            <img src="https://storage.googleapis.com/support-kms-prod/ZAl1gIwyUsvfwxoW9ns47iJFioHXODBbIkrK" />
                            Login with google
                        </button>

                        <button className={cx('other-login-methods__facebook')} onClick={handleFacebookSignIn}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Facebook_Logo_%282019%29.png/1200px-Facebook_Logo_%282019%29.png" />
                            Login with Facebook
                        </button>
                    </div>

                    <Button className={cx('user__login-btn')} to="/log-in">
                        <FontAwesomeIcon className={cx('icon')} icon={icons.faRightToBracket} />
                        Log in
                    </Button>
                </form>
            </div>

            <Button to="/" className={cx('home-btn')}>
                Home
            </Button>
        </div>
    );
}

export default Signup;
