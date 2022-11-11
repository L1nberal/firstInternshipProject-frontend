import React, { useState, useEffect } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Modal from 'react-bootstrap/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Link } from "react-router-dom";
import Dropdown from 'react-bootstrap/Dropdown';
import $ from 'jquery'
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Button from "react-bootstrap/Button";

import style from './AddApps.module.scss'
import { UserAuth } from "../../../context/AuthContext"
import { icons } from "../../../assets"

const cx = classnames.bind(style)

function AddApps(data) {
    // =================get curent logged user===================
    const { user } = UserAuth()  
    // ============get organisations==================
    const organisations = data.organisations
    // =============set developer================
    const [developerId, setDeveloperId] = useState()
    // =============set owner================
    const [ownerId, setOwnerId] = useState()
    // ===========set category choice============
    const [category, setCategory] = useState('Chọn phân loại')
    const [categoryId, setCategoryId] = useState(null)
    // ============get categories==================
    const categories = data.categories
    // ===============get apps=================
    const apps = data.data
    //============ set fields as being required==========
    const schema = yup.object().shape({
        name: yup.string().required("Bạn chưa nhập tên ứng dụng"),
        description: yup.string().required("Bạn chưa nhập mô tả cho ứng dụng"),
        androidLink: yup.string().required("Bạn chưa cung cấp liên kết tải cho Android"),
        iosLink: yup.string().required("Bạn chưa cung cấp liên kết tải cho IOS"),
    }).required();
    // =============destructuring from useForm hook================
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    })
  
    // ============== submit handler==============
    async function submitHandler(data) {
        if(categoryId === null) {
            alert("Bạn chưa chọn phân loại!")
        }else {
            // ==================check if infor typed is wrong=============
            let error = false
            await apps.map(app => {
                if(app.attributes.name === data.name) {
                    error = true
                }else if(app.attributes.androidLink === data.androidLink) {
                    error = true
    
                }else if(app.attributes.iosLink === data.iosLink) {
                    error = true
                }
            })
            // ==================submit if no error exists=============
            if(error === false) {
                let logoId
                let screenshotsId = []
                let file = new FormData()
                let files = new FormData()
        
                file.append('files', data.logo[0])
                const newArray = Object.values(data.screenshots)
                newArray.forEach(screenshot => {
                    files.append('files', screenshot)
                })
                // ================upload logo====================
                async function submit() {
                    await axios.post('http://localhost:1337/api/upload', file, {
                        headers: {
                        'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                        }
                    })
                        .then(async (respond) => {
                            logoId = respond.data[0].id
                            // =============upload screenshots==============
                            await axios.post('http://localhost:1337/api/upload', files, {
                                headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                }
                            })
                                .then(respond => {
                                    respond.data.map(screenshot => screenshotsId.push(screenshot.id))
                                    
                                })
                        })
                    // =======uploading apps attached with screenshots and logo===============
                        axios.post('http://localhost:1337/api/apps', {
                            "data": {
                                name: data.name,
                                description: data.description,
                                androidLink: data.androidLink,
                                iosLink: data.iosLink,
                                logo: logoId,
                                screenshots: screenshotsId,
                                category: categoryId,
                                developer: developerId,
                                owner: ownerId,
                                author: user.id
                            }
                        },{
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                            }
                        }
                        )
                            .then((response) => {  
                                window.location.reload()
                            }, (error) => {
                                console.log(error);
                    });
                }
                submit()
            }else {
                setShow(true)
            }
        }
    }
    //a dialogue pops up when errors occur
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // ==========check if the current logged user is admin to offer the feature==========
    if(user && user.isAdmin === false) {
        return(
            <div className={cx('warning-wrapper')}>
                <Spinner animation="border" variant="danger" />
                <div className={cx('warning')}>WARNING!!!</div>
                <div className={cx('message')}>Bạn không được phép truy cập chức năng này</div>
                <Link to="/">Trở về trang chủ! <FontAwesomeIcon icon={icons.faRotateLeft}/></Link>
            </div>
        )
    }else{
        return(
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
    
                <Form className={cx('form')} onSubmit={handleSubmit(submitHandler)}>
                    <Form.Group controlId="formBasic" className={cx('form-group', 'mb-3', 'formBasic')}>
                        <Form.Label>Tên ứng dụng</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter name" 
                            className={cx('infor-input')}
                            name="name" 
                            {...register("name")}
                        />
                        {errors.name && 
                            <Form.Text className="text-muted">
                                {errors.name.message}
                            </Form.Text>
                        }
                    </Form.Group>
    
                    <Form.Group className={cx('form-group', 'mb-3', 'formBasic')} controlId="formBasic">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter description" 
                            name="description" 
                            {...register("description")}
                            className={cx('infor-input')}
                        />
                        {errors.description && 
                            <Form.Text className="text-muted">
                                {errors.description.message}
                            </Form.Text>
                        }
                    </Form.Group>
    
                    <Form.Group className={cx('form-group', 'mb-3', 'formBasic')}  controlId="formBasic">
                        <Form.Label>Liên kết tải ứng dụng cho thiết bị android</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter android link" 
                            name="androidLink" 
                            {...register("androidLink")}
                            className={cx('infor-input')}
                        />
                        {errors.androidLink && 
                            <Form.Text className="text-muted">
                                {errors.androidLink.message}
                            </Form.Text>
                        }
                    </Form.Group>
    
                    <Form.Group className={cx('form-group', 'mb-3', 'formBasic')}  controlId="formBasic">
                        <Form.Label>Liên kết tải ứng dụng cho thiết bị IOS</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter ios link" 
                            name="iosLink" 
                            {...register("iosLink")}
                            className={cx('infor-input')}
                        />
                        {errors.iosLink && 
                            <Form.Text className="text-muted">
                                {errors.iosLink.message}
                            </Form.Text>
                        }
                    </Form.Group>
    
                    <Form.Group className={cx('form-group', 'mb-3', 'formBasic')} controlId="formBasic">
                        <Form.Label>Logo</Form.Label>
                        <Form.Control 
                            type="file" 
                            placeholder="Upload logo" 
                            name="logo" 
                            {...register("logo")}
                            required
                            className={cx('infor-input')}
                        />
                    </Form.Group>
    
                    <Form.Group className={cx('form-group', 'mb-3', 'formBasic')} controlId="formBasic">
                        <Form.Label>Screenshots</Form.Label>
                        <Form.Control 
                            type="file" 
                            placeholder="Uppload screenshots" 
                            name="screenshots" 
                            {...register("screenshots")}
                            multiple
                            required
                            className={cx('infor-input')}
                        />
                    </Form.Group>
    
                    <Form.Group className={cx('mb-3', 'formBasic', 'categories-dropdown')} controlId="formBasic">
                        <Form.Label>Chọn phân loại cho ứng dụng: </Form.Label>
                        <Dropdown as={ButtonGroup}>
                            <Button variant="secondary">{category}</Button>
    
                            <Dropdown.Toggle split variant="secondary" id="dropdown-split-basic" />
    
                            <Dropdown.Menu>
                                {categories.map(category => {
                                    if(category.attributes.name != "Tất cả")
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
                        
                        <div className={cx('radios')}>
                            {organisations.map(organisation => {
                                return (
                                    <div key={organisation.id} className={cx('radio-container')}>
                                        <input
                                            id={`developer-radio-${organisation.id}`}
                                            type="radio" 
                                            className={cx('input')}
                                            name="developer" 
                                            onChange={() => {
                                                const isChecked = $(`#developer-radio-${organisation.id}`).is(":checked")
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
                        
                        <div className={cx('radios')}>
                            {organisations.map(organisation => {
                                return (
                                    <div key={organisation.id} className={cx('radio-container')}>
                                        <input
                                            id={`owner-radio-${organisation.id}`}
                                            type="radio" 
                                            className={cx('input')}
                                            name="owner" 
                                            onChange={() => {
                                                const isChecked = $(`#owner-radio-${organisation.id}`).is(":checked")
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
    
                    <Button 
                        variant="primary" 
                        type="submit"
                        className={cx('submit-btn')}
                    >
                        Submit
                    </Button>
                </Form>
            </div>
        )
    }
}

export default AddApps
