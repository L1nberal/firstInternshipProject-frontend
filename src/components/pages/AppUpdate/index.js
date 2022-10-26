import React, { useState, useEffect } from "react"
import classnames from 'classnames/bind'
import Button from "react-bootstrap/esm/Button"
import Modal from "react-bootstrap/esm/Modal"
import Form from 'react-bootstrap/Form';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import $ from 'jquery'
import Dropdown from 'react-bootstrap/Dropdown';
import axios from "axios";

import style from './AppUpdate.module.scss'
import { UserAuth } from "../../../context/AuthContext";

const cx = classnames.bind(style)

function AppUpdate(
    {apps, 
    appId, 
    app, 
    organisations, 
    users, 
    categories}
    ) {
    // =================get users===================
    const { user } = UserAuth()
    let userId
    users.map(userMapped => {
         if(userMapped.username === user.username) {
             userId = userMapped.id
         }
     })
    // ===========set category choice============
    const [category, setCategory] = useState(app.attributes.category.data.attributes.name)
    const [categoryId, setCategoryId] = useState(app.attributes.category.data.id)

    // =============set developer================
    const [developerId, setDeveloperId] = useState(app.attributes.developer.data.id)
    // =============set owner================
    const [ownerId, setOwnerId] = useState(app.attributes.owner.data.id)
    // ==========check developer and owner checkboxes============
    useEffect(() => {
        $(`#developer-checkbox-${developerId}`).prop("checked", true)
        $(`#owner-checkbox-${ownerId}`).prop("checked", true)
    }, [])
    //a dialogue pops up when errors occur
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    // ================set app infor =============
    const [name, setName] = useState(app.attributes.name)
    const [description, setDescription] = useState(app.attributes.description)
    const [androidLink, setAndroidLink] = useState(app.attributes.androidLink)
    const [iosLink, setIosLink] = useState(app.attributes.iosLink)
    const [logo, setLogo] = useState(null)
    const [screenshots, setScreenshots] = useState([])

    // ============== submit handler==============
    async function submitHandler(e) {
        e.preventDefault()

        let error = false
        // ==================check if infor typed is wrong=============
        await apps.map(appMapped => {
            if(appMapped.attributes.name === name && app.attributes.name != name) {
                error = true
            }else if(appMapped.attributes.androidLink === androidLink && androidLink != app.attributes.androidLink) {
                error = true
            }else if(appMapped.attributes.iosLink === iosLink && iosLink != app.attributes.iosLink) {
                error = true
            }
        })
        // ==================submit if no error exists=============
        if(error === false) {
            let logoId
            let screenshotsIds = []
            let file = new FormData()
            let files = new FormData()

            file.append('files', logo)
            const newArray = Object.values(screenshots)
            newArray.forEach(screenshot => {
                files.append('files', screenshot)
            })
            async function submit() {
                if(logo != null) {
                    // ================upload logo====================
                    await axios.post('http://localhost:1337/api/upload', file, {
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(async (respond) => {
                            logoId = respond.data[0].id
                           
                        })
                }

                if(screenshots.length > 0) {
                    // =============upload screenshots==============
                    await axios.post('http://localhost:1337/api/upload', files, {
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(respond => {
                            respond.data.map(screenshot => screenshotsIds.push(screenshot.id))
                            
                        })
                }

                // ============post method==============
                if(logo === null && screenshots.length === 0) {
                    // =======uploading apps without screenshots and logo ===============
                    axios.put(`http://localhost:1337/api/apps/${appId}`, {
                        "data": {
                            name: name,
                            description: description,
                            androidLink: androidLink,
                            iosLink: iosLink,
                            category: categoryId,
                            developer: developerId,
                            owner: ownerId,
                            author: userId
                        }
                    },{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then((response) => {
                            console.log('uploaded successfully!')
                            window.location.reload()
                            
                        }, (error) => {
                            console.log(error);
                        });
                }else if(logo != null && screenshots.length > 0) {
                    // =======uploading apps attached with screenshots and logo ===============
                    axios.put(`http://localhost:1337/api/apps/${appId}`, {
                        "data": {
                            name: name,
                            description: description,
                            androidLink: androidLink,
                            iosLink: iosLink,
                            logo: logoId,
                            screenshots: screenshotsIds,
                            category: categoryId,
                            developer: developerId,
                            owner: ownerId,
                            author: userId
                        }
                    },{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    }
                    )
                        .then((response) => {
                            console.log('uploaded successfully!')
                            window.location.reload()
                            
                        }, (error) => {
                            console.log(error);
                        });
                }else if(logo != null && screenshots.length === 0) {
                    // =======uploading apps attached with logo ===============
                    axios.put(`http://localhost:1337/api/apps/${appId}`, {
                        "data": {
                            name: name,
                            description: description,
                            androidLink: androidLink,
                            iosLink: iosLink,
                            logo: logoId,
                            category: categoryId,
                            developer: developerId,
                            owner: ownerId,
                            author: userId
                        }
                    },{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    }
                    )
                        .then((response) => {
                            console.log('uploaded successfully!')
                            window.location.reload()

                            
                        }, (error) => {
                            console.log(error);
                        });
                }else if(logo===null && screenshots.length > 0) {
                    // =======uploading apps attached with screenshots ===============
                    axios.put(`http://localhost:1337/api/apps/${appId}`, {
                        "data": {
                            name: name,
                            description: description,
                            androidLink: androidLink,
                            iosLink: iosLink,
                            screenshots: screenshotsIds,
                            category: categoryId,
                            developer: developerId,
                            owner: ownerId,
                            author: userId
                        }
                    },{
                        headers: {
                            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    }
                    )
                        .then((response) => {
                            console.log('uploaded successfully!')
                            window.location.reload()
                            
                        }, (error) => {
                            console.log(error);
                        });
                }
            }
            submit()

        }else {
            setShow(true)
        } 
    }

    return (
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                </Modal.Header>
                <Modal.Body>Thông tin bạn nhập đã bị trùng với cá ứng dụng trước đó, mời thử lại!</Modal.Body>
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

            <Form className={cx('form')} onSubmit={e => submitHandler(e)}>
                <Form.Group className="mb-3 formBasic" controlId="formBasic">
                    <Form.Label>Tên ứng dụng</Form.Label>
                    <Form.Control 
                        value={name}
                        type="text" 
                        placeholder="Enter name" 
                        name="name" 
                        onChange={e => setName(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3 formBasic" controlId="formBasic">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter description" 
                        name="description" 
                        onChange={e => setDescription(e.target.value)}
                        value={description}
                    />
                </Form.Group>

                <Form.Group className="mb-3 formBasic"  controlId="formBasic">
                    <Form.Label>Liên kết tải ứng dụng cho thiết bị android</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter android link" 
                        name="androidLink" 
                        value={androidLink}
                        onChange={e => setAndroidLink(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3 formBasic"  controlId="formBasic">
                    <Form.Label>Liên kết tải ứng dụng cho thiết bị IOS</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter ios link" 
                        name="iosLink" 
                        onChange={e => setIosLink(e.target.value)}
                        value={iosLink}
                    />
                </Form.Group>

                <Form.Group className="mb-3 formBasic" controlId="formBasic">
                    <Form.Label>Logo</Form.Label>
                    <Form.Control 
                        type="file" 
                        placeholder="Upload logo" 
                        name="logo" 
                        onChange={e => setLogo(e.target.files[0])}
                    />

                    <div className={cx('logo')}>
                        <img src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}/>
                    </div>
                </Form.Group>

                <Form.Group className="mb-3 formBasic" controlId="formBasic">
                    <Form.Label>Screenshots</Form.Label>
                    <Form.Control 
                        type="file" 
                        placeholder="Uppload screenshots" 
                        name="screenshots" 
                        multiple
                        onChange={e => setScreenshots(e.target.files)}
                    />

                    <div className={cx('screenshots')}>
                        {app.attributes.screenshots.data.map(screenshot => {
                            return (
                                <img
                                    key={screenshot.id}
                                    src={`http://localhost:1337${screenshot.attributes.url}`}
                                />
                            )
                        })}
                    </div>
                </Form.Group>

                <Form.Group className={cx('mb-3', 'formBasic', 'categories-dropdown')} controlId="formBasic">
                    <Form.Label>Chọn phân loại cho ứng dụng: </Form.Label>
                    <Dropdown as={ButtonGroup}>
                        <Button variant="secondary">{category}</Button>

                        <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />

                        <Dropdown.Menu>
                            {categories.map(category => {
                                return (
                                    <React.Fragment key={category.id}>
                                        <Dropdown.Item 
                                            id={`dropdown-category-${category.id}`}
                                            onClick={() => {
                                                let choice = $(`#dropdown-category-${category.id}`)[0].innerText
                                                setCategory(choice)
                                                setCategoryId(category.id)
                                            }}
                                        >{category.attributes.name}</Dropdown.Item>
                                    </React.Fragment>
                                )
                            })}
                        </Dropdown.Menu>
                    </Dropdown>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Nhà phát triển:</Form.Label>
                    
                    <div className={cx('checkboxes')}>
                        {organisations.map(organisation => {
                            return (
                                <div key={organisation.id} className={cx('checkbox-container')}>
                                    <input
                                        id={`developer-checkbox-${organisation.id}`}
                                        type="checkbox" 
                                        className={cx('input')}
                                        name="checkbox" 
                                        onChange={() => {
                                            const isChecked = $(`#developer-checkbox-${organisation.id}`).is(":checked")
                                            if(isChecked) {
                                                setDeveloperId(organisation.id)
                                            }else if(!isChecked) {
                                                setDeveloperId()
                                            }
                                        }}
                                    />
                                    <div className={cx('organisation-container')}>
                                        <div className={cx('name')}>{organisation.attributes.name}</div>
                                        <div className={cx('image')}>
                                            <img src={`http://localhost:1337${organisation.attributes.logo.data.attributes.url}`}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Cơ quan sở hữu ứng dụng:</Form.Label>
                    
                    <div className={cx('checkboxes')}>
                        {organisations.map(organisation => {
                            return (
                                <div key={organisation.id} className={cx('checkbox-container')}>
                                    <input
                                        id={`owner-checkbox-${organisation.id}`}
                                        type="checkbox" 
                                        className={cx('input')}
                                        name="checkbox" 
                                        onChange={() => {
                                            const isChecked = $(`#owner-checkbox-${organisation.id}`).is(":checked")
                                            if(isChecked) {
                                                setOwnerId(organisation.id)
                                            }else if(!isChecked) {
                                                setOwnerId()
                                            }
                                        }}
                                    />
                                    <div className={cx('organisation-container')}>
                                        <div className={cx('name')}>{organisation.attributes.name}</div>
                                        <div className={cx('image')}>
                                            <img src={`http://localhost:1337${organisation.attributes.logo.data.attributes.url}`}/>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default AppUpdate
