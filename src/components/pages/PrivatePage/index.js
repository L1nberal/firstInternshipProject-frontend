import React, { useEffect, useState} from "react"
import {useNavigate} from 'react-router-dom'
import Card from 'react-bootstrap/Card';
import axios from 'axios'
import classnames from 'classnames/bind'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useForm } from 'react-hook-form'
import { Link } from "react-router-dom"
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'

import style from './PrivatePage.module.scss'
import { UserAuth } from "../../../context/AuthContext";
import { icons } from "../../../assets"

const cx = classnames.bind(style)

function PrivatePage({userId, userInfor, apps, users}) {
    // ==============navigate============
    const navigate = useNavigate()
    //===============checking errors for logging in with database ===============
    const formSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Bạn chưa nhập mật khẩu hiện tại')
            .min(6, 'mật khẩu phải dài ít nhất 6 kí tự'),
        newPassword: Yup.string()
            .required('Bạn chưa nhập mật khẩu mới')
            .min(6, 'mật khẩu phải dài ít nhất 6 kí tự'),
        confirmNewPasword: Yup.string()
            .required('Bạn chưa xác nhận mật khẩu mới')
            .oneOf([Yup.ref('newPassword')], 'Mật khẩu không khớp'),        
    })
    const formOptions = { resolver: yupResolver(formSchema)}
    const { register, handleSubmit, formState } = useForm(formOptions)
    const { errors } = formState
    // ============destructring from UserAuth()=============
    const { user, logOut } = UserAuth()
    // ==========hide and show password update========
    const [avatar, setAvatar] = useState(null)
    // ==============deleted user id================
    const [deletedUserId, setDeletedUserId] = useState()
    // ==========hide and show update section========
    const [update, setUpdate] = useState(false)
    // ============set infor for updating=================
    const [username, setUsername] = useState(user.username)
    // ======================avatar Id for deleting the avatar later===========
    const [avatarId, setAvatarId] = useState('')
    // ===========add avatar id for deleting it later==========
    useEffect(() => {
        users.map(userMapped => {
            if(user) {
                if(userMapped.id === user.id && userMapped.from === "Database") {
                    setAvatarId(userMapped.avatar.id)
                }
            }
        })
    }, [user])
    // ===================infor update==================
    const inforUpdateHandler = () => {
        if(avatar === null) {
            axios.put(`http://localhost:1337/api/users/${user.id}`, {
                username: username
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                }
            })
                .then((respond) => {    
                    window.location.reload()           
                })
                .catch(error => console.log(error))

        }else {
            let file = new FormData()
            file.append('files', avatar)
            let fileId 

            axios.post('http://localhost:1337/api/upload', file, {
                headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                }
            })
                .then(respond => {
                    axios.delete(`http://localhost:1337/api/upload/files/${avatarId}`,{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })

                    fileId = respond.data[0].id
                    axios.put(`http://localhost:1337/api/users/${user.id}`, {
                        username: username,
                        avatar: fileId
                    }, {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(respond => {  
                            window.location.reload()           
                        })
                        .catch(error => console.log(error))
                })
        }
    }
    // ===============update password===============
    const passwordUpdateHandler = async (data) => {
        axios.post(`http://localhost:1337/api/auth/change-password`, {
            currentPassword: data.currentPassword,
            password: data.newPassword,
            passwordConfirmation: data.confirmNewPasword
        }, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('accessToken')}` 
            }
        })
            .then(respond => {
                window.location.reload()
            })
            .catch(error => alert("Mật khẩu bạn nhập không đúng, mời bạn thử lại"))
        
    }
    // =========pop up when errors exists=============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // =========pop up when a user delete request is made=============
    const [userDeleteModal, setUserDeleteModal] = useState(false);
    const handleCloseDeleteModal = () => setUserDeleteModal(false);
    // =========pop up when a user disable request is made=============
    const [userDisableModal, setUserDisableModal] = useState(false);
    const handleCloseDisableModal = () => setUserDisableModal(false);
    // =============get apps which have been posted by the user if it's admin=====
    let postedApps = []
    users.map(userMapped => {
        if(userMapped.id === userId) {
            userMapped.apps.map(app => {
                apps.map(appMapped => {
                    if(appMapped.id === app.id) {
                        postedApps.push(appMapped)
                    }
                })
            })
        }
    })
    // ==============user delete handler=========
    const userDeleteHandler = async (userId) => {
        // ==============delete comments of the user=======
        await axios.get('http://localhost:1337/api/comments?populate=*')
            .then(respond => {
                respond.data.data.map(comment => {
                    if(comment.attributes.userId === userId) {
                        respond.data.data.map(async(commentMapped) => {
                            if(commentMapped.attributes.parent_Id === comment.id) {
                                await axios.delete(`http://localhost:1337/api/comments/${commentMapped.id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                    }
                                })
                                    .then(respond => {})
                                    .catch(error => console.log(error))
                            }
                        })

                        axios.delete(`http://localhost:1337/api/comments/${comment.id}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                            }
                        })
                            .then(respond => {})
                            .catch(error => console.log(error))
                    }
                })
            })
            .catch(error => console.log(error))

        // ===========delete user==================
        await axios.delete(`http://localhost:1337/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(async(respond) => {
                await users.map(user => {
                    if(user.id === userId) {
                        // =============delete avatar===============
                        axios.delete(`http://localhost:1337/api/upload/files/${user.avatar.id}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                            }
                        })
                            .then(respond => {})
                            .catch(error => console.log(error))
                    }
                })
            })
            .catch(error => console.log(error))

        window.location.reload()
    }  

    // ================disable user handler==========
    const disableUserHandler = async (userId) => {
        // ==============delete comments of the user=======
        await axios.get('http://localhost:1337/api/comments?populate=*')
            .then(respond => {
                respond.data.data.map(comment => {
                    if(comment.attributes.userId === userId) {
                        respond.data.data.map(async(commentMapped) => {
                            if(commentMapped.attributes.parent_Id === comment.id) {
                                await axios.delete(`http://localhost:1337/api/comments/${commentMapped.id}`, {
                                    headers: {
                                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                    }
                                })
                                    .then(respond => {})
                                    .catch(error => console.log(error))
                            }
                        })

                        axios.delete(`http://localhost:1337/api/comments/${comment.id}`, {
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                            }
                        })
                            .then(respond => {})
                            .catch(error => console.log(error))
                    }
                })
            })
            .catch(error => console.log(error))

        await axios.delete(`http://localhost:1337/api/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then((respond) => {
                // =============delete avatar===============
                axios.delete(`http://localhost:1337/api/upload/files/${userInfor.avatar.id}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                    }
                })
                    .then(respond => {})
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(error))

        navigate('/')
        logOut()
        window.location.reload()
    }
    // ==========check if the current logged user is allowed to access the feature==========
    if(user.id != userId) {
        return(
            <div className={cx('warning-wrapper')}>
                <Spinner animation="border" variant="danger" />
                <div className={cx('warning')}>WARNING!!!</div>
                <div className={cx('message')}>Bạn không được phép truy cập trang này</div>
                <Link to="/">Trở về trang chủ! <FontAwesomeIcon icon={icons.faRotateLeft}/></Link>
            </div>
        )
    }else {
        return(
            <div className={cx('wrapper')}>
                {/* =============this dialogue pops up when errors exist========= */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Mật khẩu cần phải đủ ít nhất 6 kí tự!</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Ok
                    </Button>
                    </Modal.Footer>
                </Modal>
                {/* =============this dialogue pops up when a disable request is made========= */}
                <Modal show={userDisableModal} onHide={handleCloseDisableModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có thực sự muốn vô hiệu hóa tài khoản?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDisableModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => {
                        disableUserHandler(userInfor.id)
                        handleCloseDisableModal()
                    }}>
                        Đồng ý
                    </Button>
                    </Modal.Footer>
                </Modal>
                {/* =============this dialogue pops up when a delete request is made========= */}
                <Modal show={userDeleteModal} onHide={handleCloseDeleteModal}>
                    <Modal.Header closeButton>
                    <Modal.Title>Modal heading</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Bạn có thực sự muốn xóa tài khoản này?</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseDeleteModal}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={() => {
                        userDeleteHandler(deletedUserId)
                        handleCloseDisableModal()
                    }}>
                        Đồng ý
                    </Button>
                    </Modal.Footer>
                </Modal>
    
                <h5 className={cx('title')}>
                    Thông tin cá nhân của
                    <span>
                        {userInfor.username}
                    </span>
                </h5>
    
                <Tabs
                    defaultActiveKey="private-infor"
                    id="uncontrolled-tab-example"
                    className={cx('mb-3', 'tabs-head')}
                >
                    <Tab 
                        eventKey="private-infor" 
                        title="Thông tin cá nhân"
                        className={cx('private-infor-container', 'tab')}
    
                    >
                        {update === true ? (
                            <div className={cx('update-section')}>
                                {/* =================back-btn================= */}
                                <Button 
                                    variant="outline-secondary"
                                    className={cx('back-btn')}
                                    onClick={() => setUpdate(false)}
                                >
                                    Trở về 
                                    <FontAwesomeIcon
                                        icon={icons.faRightToBracket}
                                        className={cx('icon')}
                                    />
                                </Button>
                                {/* ====================infor update form================== */}
                                <form className={cx('change-infor-form')}>
                                    <div className={cx('form__image')}>
                                       <h6> Ảnh đại diện: </h6> 
                                        <input 
                                            type="file"
                                            onChange={e => setAvatar(e.target.files[0])}
                                        />
                                        <img src={user.avatar}/>
                                    </div>
        
                                    <div className={cx('form__username')}>
                                        <h6> Tên người dùng: </h6> 
                                        <input 
                                            type="text" 
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                        />
                                    </div>

                                    <Button onClick={() => inforUpdateHandler()}>Cập nhật</Button>
                                </form>
                                {/* =========================password update form ==================== */}
                                {user.from === "Database" && (
                                    <form className={cx('change-password-form')} onSubmit={handleSubmit(passwordUpdateHandler)}>
                                        <div className={cx('form__password')}>
                                            <h6> 
                                                <span>Đổi mật khẩu: </span>
                                            </h6> 
                                            
                                            <div>
                                                mật khẩu hiện tại: 
                                                <input 
                                                    type="password" 
                                                    {...register('currentPassword')}
                                                    id="currentPassword"
                                                />

                                                <input type="checkbox" onClick={() => {
                                                    var x = document.getElementById("currentPassword");
                                                    if (x.type === "password") {
                                                      x.type = "text";
                                                    } else {
                                                      x.type = "password";
                                                    }
                                                }}/>Show Password

                                                <div className={cx('invalid-feedback')}>{errors.currentPassword?.message}</div>
                                            </div>
                                            <div>
                                                Mật khẩu mới:
                                                <input 
                                                    type="password" 
                                                    {...register('newPassword')}
                                                    id="newPassword"
                                                />

                                                <input type="checkbox" onClick={() => {
                                                    var x = document.getElementById("newPassword");
                                                    if (x.type === "password") {
                                                      x.type = "text";
                                                    } else {
                                                      x.type = "password";
                                                    }
                                                }}/>Show Password

                                                <div className={cx('invalid-feedback')}>{errors.newPassword?.message}</div>
                                            </div>
                                            <div>
                                                Nhập lại mật khẩu mới: 
                                                <input 
                                                    type="password"
                                                    {...register('confirmNewPasword')}
                                                    id="confirmNewPasword"
                                                />
                                                
                                                <input type="checkbox" onClick={() => {
                                                    var x = document.getElementById("confirmNewPasword");
                                                    if (x.type === "password") {
                                                      x.type = "text";
                                                    } else {
                                                      x.type = "password";
                                                    }
                                                }}/>Show Password

                                                <div className={cx('invalid-feedback')}>{errors.confirmNewPasword?.message}</div>
                                            </div>
                                        </div>
                                        <button className={cx('change-password-btn')}>Đổi mật khẩu</button>
                                    </form>
                                )}
                            </div>
                        ) : (
                            <div className={cx('private-infor')}>
                                <img className={cx('image')} src={user.avatar}/>
                                <div className={cx('infor-container')}>
                                    <div>Tên người dùng: <span>{userInfor.username}</span></div>
                                    <div>Email: <span>{userInfor.email}</span></div>
                                    <div>Vai trò: {userInfor.isAdmin ? <span>Admin</span> : <span>Người dùng thông thường</span>}</div>
                                </div>
                            </div>
                        )}
    
                        {update === false && (
                            <div className={cx('buttons')}>
                                {user.from === "Database" && (
                                    <Button 
                                        variant="secondary"
                                        className={cx('update-btn')}
                                        onClick={() => setUpdate(true)}
                                    >
                                        cập nhật thông tin
                                    </Button>
                                )}

                                {user.isAdmin === false && (
                                    <Button
                                        className={cx('disabled-user-btn')}
                                        variant="danger"
                                        onClick={() => {
                                            setUserDisableModal(true)
                                        }}
                                    >
                                        Vô hiệu hóa tài khoản
                                    </Button>
                                )}
                            </div>
                        )}
                    </Tab>
    
                    {userInfor.isAdmin && (
                        <Tab 
                            eventKey="apps" 
                            title="Ứng dụng đã đăng"
                            className={cx('posted-apps-container', 'tab')}
                        >
                            <div className={cx('apps-posted')}>
                                {postedApps.map(app => {
                                    return(
                                        <Card 
                                            key={app.id}
                                            border="success" 
                                            className={cx('each-app')}
                                        >
                                            <Card.Header className={cx('each-app__name')}>{app.attributes.name}</Card.Header>
                                            <Card.Body className="d-flex">
                                                <Card.Img
                                                    src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}
                                                    className={cx('each-app__image')}
                                                />
                                                <Card.Text className={cx('each-app__description')}>
                                                    {app.attributes.description}
                                                </Card.Text>

                                                <Button 
                                                    onClick={() => navigate(`/app-details-${app.id}`)}
                                                    className={cx('more-btn')}
                                                    variant="info"
                                                >
                                                    Xem thêm
                                                </Button>
                                            </Card.Body>
                                        </Card>
                                    )
                                })}
                            </div>
                        </Tab>
                    )}

                    {userInfor.isAdmin && (
                        <Tab 
                            eventKey="users" 
                            title="Các user khác"
                            className={cx('other-users-container', 'tab')}
                        >
                            <div className={cx('users')}>
                                {users.map(user => {
                                    if(user.id != userInfor.id) {
                                        console.log(user)
                                        return(
                                            <Card 
                                                key={user.id}
                                                border="secondary"
                                                className={cx('each-user')}
                                            >
                                                <Card.Header className={cx('each-user__head')}>
                                                    <span className={cx('username')}>{user.username}</span>
                                                    <span className={cx('from')}>From: {user.from}</span>
                                                </Card.Header>
                                                <Card.Body className="d-flex">
                                                    {user.avatar != null ? (
                                                        <Card.Img
                                                            src={`http://localhost:1337${user.avatar.url}`}
                                                            className={cx('each-user__avatar')}
                                                        />
                                                    ) : (
                                                        <Card.Img
                                                            src={user.avatarLink}
                                                            className={cx('each-user__avatar')}
                                                        />
                                                    )}  
                                                    <Card.Text className={cx('each-user__email')}>
                                                        {user.email}
                                                    </Card.Text>
    
                                                    <Button 
                                                        onClick={() => {
                                                            setDeletedUserId(user.id)
                                                            setUserDeleteModal(true)
                                                        }}
                                                        className={cx('delete-btn')}
                                                        variant="outline-danger"
                                                    >
                                                        Xóa user này
                                                    </Button>
                                                </Card.Body>
                                            </Card>
                                        )
                                    }
                                })}
                            </div>
                        </Tab> 
                    )}
                </Tabs>
            </div>
        )
    }
}

export default PrivatePage
