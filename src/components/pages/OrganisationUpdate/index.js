import React, { useEffect, useState } from "react"
import Modal from 'react-bootstrap/Modal';
import Button from "react-bootstrap/esm/Button";
import classnames from "classnames/bind";
import Form from 'react-bootstrap/Form';
import $ from 'jquery'
import axios from "axios";
import { Link } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

import style from './OrganisationUpdate.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import { icons } from "../../../assets"
import { async } from "@firebase/util";

const cx = classnames.bind(style)

function OrganisationUpdate({
    organisationId,
    organisations,
    apps,
    organisation
}) {
    // =================get curent logged user===================
    const { user } = UserAuth()
    // ===============get apps' ids=============
    let developedIds = []
    let ownedIds = []
    useEffect(() => {
        organisation.attributes.appsDeveloped.data.map(app => {
            $(`#developed-apps-checkbox-${app.id}`).prop("checked", true)
            developedIds.push(app.id)
        })
        organisation.attributes.appsOwned.data.map(app => {
            $(`#owned-apps-checkbox-${app.id}`).prop("checked", true)
            ownedIds.push(app.id)
        })
    }, [])

    const [developedAppsIds, setDevelopedAppsIds] = useState(developedIds)
    const [ownedAppsIds, setOwnedAppsIds] = useState(ownedIds)

    // =============set infor==============
    const [name, setName] = useState(organisation.attributes.name)
    const [email, setEmail] = useState(organisation.attributes.email)
    const [address, setAddress] = useState(organisation.attributes.address)
    const [website, setWebsite] = useState(organisation.attributes.website)
    const [ownedBy, setOwnedBy] = useState(organisation.attributes.ownedBy)
    const [phoneNumber, setPhoneNumber] = useState(organisation.attributes.phoneNumber)
    const [about, setAbout] = useState(organisation.attributes.about)
    const [logo, setLogo] = useState(null)
    const [photos, setPhotos] = useState([])
    // ============submit handler==============
    async function submitHandler (e) {
    // ===========set ids to attach to organisation================    
        let fileIds = []
        let fileId
        
        e.preventDefault()

        let error = false
        // ==================check if infor typed is wrong=============
        await organisations.map(organisation => {
            if(organisation.attributes.email === email && organisation.id != organisationId) {
                error = true
            }else if(organisation.attributes.name === name && organisation.id != organisationId) {
                error = true
            }else if(organisation.attributes.phoneNumber === phoneNumber && organisation.id != organisationId) {
                error = true
            }else if(organisation.attributes.website === website && organisation.id != organisationId) {
                error = true
            }
        })

        if(error === false) {
            // ===============set files========================
            let file = new FormData()
            let files = new FormData
            const newArray = Object.values(photos)
            file.append("files", logo)
            newArray.forEach(photo => {
                files.append('files', photo)
            })
    
            async function submit() {
                // =======upload logo===============
                if(logo != null) {
                    await axios.post('http://localhost:1337/api/upload', file, {
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    }
                    )
                    .then(async (response) => {
                        fileId = response.data[0].id
                    }, (error) => {
                        console.log(error);
                    });
                    
                }
                // =======upload photos===============
                if(photos.length != 0) {
                    await axios.post('http://localhost:1337/api/upload', 
                    files
                    ,{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                    .then(respond => {
                        respond.data.map(photo => {
                            fileIds.push(photo.id)
                        })
                    })
                    .catch(error => console.log(error))
                }
                
                // ==============submit with POST method================
                if(logo === null && photos.length === 0){
                    axios.put(`http://localhost:1337/api/organisations/${organisationId}`, {
                        data: {
                            name: name,
                            phoneNumber: phoneNumber,
                            address: address,
                            website: website,
                            email: email,
                            about: about,
                            ownedBy: ownedBy,
                            appsDeveloped: developedAppsIds,
                            appsOwned: ownedAppsIds
                        }
                    },{
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then((respond) => {
                            window.location.reload()
                        })
                        .catch(error => console.log(error))
                }else if(photos.length > 0 && logo === null) {
                    axios.put(`http://localhost:1337/api/organisations/${organisationId}`, {
                        data: {
                            name: name,
                            phoneNumber: phoneNumber,
                            address: address,
                            website: website,
                            email: email,
                            about: about,
                            ownedBy: ownedBy,
                            photos: fileIds,
                            appsDeveloped: developedAppsIds,
                            appsOwned: ownedAppsIds
                        }
                    },{
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(async(respond) => {
                            await organisations.map(organisationMapped => {
                                if(organisationMapped.id === organisationId) {
                                    organisationMapped.attributes.photos.data.map(photo => {
                                        axios.delete(`http://localhost:1337/api/upload/files/${photo.id}`, {
                                            headers: {
                                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                            }
                                        })
                                            .then(respond)
                                            .catch(error => console.log(error))
                                    })
                                }
                            })
                            window.location.reload()
                        })
                        .catch(error => console.log(error))
                }else if(logo != null && photos.length === 0) {
                    axios.put(`http://localhost:1337/api/organisations/${organisationId}`, {
                        data: {
                            name: name,
                            phoneNumber: phoneNumber,
                            address: address,
                            website: website,
                            email: email,
                            about: about,
                            ownedBy: ownedBy,
                            logo: fileId,
                            appsDeveloped: developedAppsIds,
                            appsOwned: ownedAppsIds
                        }
                    },{
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(async (respond) => {
                            await organisations.map(organisationMapped => {
                                if(organisationMapped.id === organisationId) {
                                    axios.delete(`http://localhost:1337/api/upload/files/${organisationMapped.attributes.logo.data.id}`, {
                                        headers: {
                                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                        }
                                    })
                                        .then(respond)
                                        .catch(error => console.log(error))
                                }
                            })
                            window.location.reload()
                        })
                        .catch(error => console.log(error))
                }else if(logo != null && photos.length > 0) {
                    axios.put(`http://localhost:1337/api/organisations/${organisationId}`, {
                        data: {
                            name: name,
                            phoneNumber: phoneNumber,
                            address: address,
                            website: website,
                            email: email,
                            about: about,
                            ownedBy: ownedBy,
                            logo: fileId,
                            photos: fileIds,
                            appsDeveloped: developedAppsIds,
                            appsOwned: ownedAppsIds
                        }
                    },{
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(async(respond) => {
                            await organisations.map(organisationMapped => {
                                if(organisationMapped.id === organisationId) {
                                    axios.delete(`http://localhost:1337/api/upload/files/${organisationMapped.attributes.logo.data.id}`, {
                                        headers: {
                                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                        }
                                    })
                                        .then(respond => {})
                                        .catch(error => console.log(error))

                                    organisationMapped.attributes.photos.data.map(photo => {
                                        axios.delete(`http://localhost:1337/api/upload/files/${photo.id}`, {
                                            headers: {
                                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                            }
                                        })
                                            .then(respond => {})
                                            .catch(error => console.log(error))
                                    })
                                }
                            })
                            window.location.reload()
                        })
                        .catch(error => console.log(error))
                }               
            }
            submit()
        }else{
            setShow(true)
        }
    }
  
    //=================a dialogue pops up when errors occur============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // ==========check if the current logged user is admin to offer the feature==========
    if(user.isAdmin === false) {
        return(
            <div className={cx('warning-wrapper')}>
                <Spinner animation="border" variant="danger" />
                <div className={cx('warning')}>WARNING!!!</div>
                <div className={cx('message')}>Bạn không được phép truy cập chức năng này</div>
                <Link to="/">Trở về trang chủ! <FontAwesomeIcon icon={icons.faRotateLeft}/></Link>
            </div>
        )
    }else {
        return (
            <div className={cx('wrapper')}>
                {/* =============error popup dialogue============== */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Thông tin bạn nhập đã bị trùng với cáC cơ quan trước đó, mời thử lại!</Modal.Body>
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
    
                {/* ===============form submit====================== */}
                <Form className={cx('form')} onSubmit={e => submitHandler(e)}>
                    {/* =============== name ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Tên cơ quan</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            value={name}
                            type="text" 
                            placeholder="Enter name" 
                            name="name" 
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    {/* =============== email ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>email</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            type="email" 
                            placeholder="Enter email" 
                            name="email" 
                            required
                            onChange={e => setEmail(e.target.value)}
                            value={email}
                        />
                    </Form.Group>
                    {/* =============== address ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Address</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            type="text" 
                            placeholder="Enter address" 
                            name="address" 
                            required
                            onChange={e => setAddress(e.target.value)}
                            value={address}
                        />
                    </Form.Group>
                    {/* =============== website ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Website</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            type="text" 
                            placeholder="Enter website" 
                            name="website"
                            required
                            onChange={e => setWebsite(e.target.value)}
                            value={website}
                        />
                    </Form.Group>
                    {/* =============== owned by ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Thuộc sở hữu của</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            type="text" 
                            placeholder="Enter owner" 
                            name="ownedBy"
                            required
                            onChange={e => setOwnedBy(e.target.value)}
                            value={ownedBy}
                        />
                    </Form.Group>
                    {/* =============== phone number ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control 
                            className={cx('infor-input')}
                            type="text" 
                            placeholder="Enter phone number" 
                            name="phone number" 
                            required
                            onChange={e => setPhoneNumber(e.target.value)}
                            value={phoneNumber}
                        />
                    </Form.Group>
                    {/* =============== about ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Giới thiệu về cơ quan</Form.Label>
                        <textarea
                            className={cx('about', 'infor-input')}
                            type="text" 
                            placeholder="Enter about" 
                            name="about" 
                            required
                            onChange={e => setAbout(e.target.value)}
                            value={about}
                        />
                    </Form.Group>
                    {/* =============== logo ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Ảnh Logo</Form.Label>
                        <Form.Control 
                            type="file" 
                            placeholder="Enter logo" 
                            name="logo"
                            onChange={e => setLogo(e.target.files[0])}
                        />
    
                        <div className={cx('logo')}>
                            <img src={`http://localhost:1337${organisation.attributes.logo.data.attributes.url}`}/>
                        </div>
                    </Form.Group>
                    {/* =============== illustrating photos ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Các ảnh minh họa khác:</Form.Label>
                        <Form.Control 
                            type="file" 
                            placeholder="Enter photos" 
                            name="file[]" 
                            onChange={e => setPhotos(e.target.files)}
                            multiple
                        />
    
                        <div className={cx('photos')}>
                           {organisation.attributes.photos.data.map(photo => {
                                return (
                                    <React.Fragment key={photo.id}>
                                        <img src={`http://localhost:1337${photo.attributes.url}`}/>
                                    </React.Fragment>
                                )
                           })}
                        </div>
                        
                    </Form.Group>
                    {/* =============== apps developed ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Các ứng dụng đã phát triển:</Form.Label>
                        
                        <div className={cx('checkboxes')}>
                            {apps.map(app => {
                                return (
                                    <div key={app.id} className={cx('checkbox-container')}>
                                        <input
                                            id={`developed-apps-checkbox-${app.id}`}
                                            type="checkbox" 
                                            className={cx('input')}
                                            name="checkbox" 
                                            onChange={() => {
                                                const isChecked = $(`#developed-apps-checkbox-${app.id}`).is(":checked")
                                                if(isChecked) {
                                                    setDevelopedAppsIds([...developedAppsIds, app.id])
                                                }else if(!isChecked) {
                                                    let array = developedAppsIds.filter(id => id != app.id)
                                                    setDevelopedAppsIds(array)
                                                }
                                            }}
                                        />
                                        <div className={cx('app-container')}>
                                            <div className={cx('name')}>{app.attributes.name}</div>
                                            <img src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Form.Group>
                    {/* =============== apps owned ====================== */}
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Các ứng dụng đang sở hữu:</Form.Label>
                        
                        <div className={cx('checkboxes')}>
                            {apps.map(app => {
                                return (
                                    <div key={app.id} className={cx('checkbox-container')}>
                                        <input
                                            id={`owned-apps-checkbox-${app.id}`}
                                            type="checkbox" 
                                            className={cx('input')}
                                            name="checkbox" 
                                            onChange={() => {
                                                const isChecked = $(`#owned-apps-checkbox-${app.id}`).is(":checked")
                                                if(isChecked) {
                                                    setOwnedAppsIds([...ownedAppsIds, app.id])
                                                }else if(!isChecked) {
                                                    let array = ownedAppsIds.filter(id => id != app.id)
                                                    setOwnedAppsIds(array)
                                                }
                                            }}
                                        />
                                        <div className={cx('app-container')}>
                                            <div className={cx('name')}>{app.attributes.name}</div>
                                            <img src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}/>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </Form.Group>
                    
                    <Button className={cx('submit-btn')} variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default OrganisationUpdate
