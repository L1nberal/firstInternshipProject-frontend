import React, { useState, useEffect } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import { useForm } from "react-hook-form";
import * as yup from "yup";
import Modal from 'react-bootstrap/Modal';
import { yupResolver } from '@hookform/resolvers/yup';
import $ from 'jquery'

import style from './AddOrganisations.module.scss'

const cx = classnames.bind(style)

function AddOrganisations(data) {
    // ===============get apps' ids=============
    const [developedAppsIds, setDevelopedAppsIds] = useState([])
    const [ownedAppsIds, setOwnedAppsIds] = useState([])
    // console.log(ownedAppsIds)
    // console.log(developedAppsIds)
    // ============get apps===============
    const apps = data.apps
    // ===============check if f orm has been submitted successfully=============
    const  [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
    // =============get organisations==================
    const organisations = data.data
    //============ set fields as being required==========
    const schema = yup.object().shape({
        name: yup.string().required("Bạn chưa nhập tên ứng dụng"),
        about: yup.string().required("Bạn chưa nhập mô tả cho cơ quan"),
        address: yup.string().required("Bạn chưa nhập địa chỉ cho cơ quan"),
        email: yup.string().email().required("Bạn chưa nhập email cho cơ quan"),
        ownedBy: yup.string().required("Bạn chưa cung cấp người sở hữu của cơ quan"),
        phoneNumber: yup.number().required("Bạn chưa cung cấp số điện thoại liên lạc của cơ quan"),
        website: yup.string().required("Bạn chưa cung cấp trang web của cơ quan"),
    }).required();
    // =============destructuring from useForm hook================
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: yupResolver(schema),
    })
    // ==========reset data when submiting successfully=============
    useEffect(() => {
        reset({
            data: 'test'
        })
    }, [isSubmitSuccessful])
    
    // ============submit handler==============
    async function submitHandler (data) {
        let error = false
        // ==================check if infor typed is wrong=============
        await organisations.map(organisation => {
            if(organisation.attributes.email === data.email) {
                error = true
            }else if(organisation.attributes.name === data.name) {
                error = true
            }else if(organisation.attributes.phoneNumber === data.phoneNumber) {
                error = true
            }else if(organisation.attributes.website === data.website) {
                error = true
            }
        })

        if(error === false) {
            // ===========set ids to attach to organisation================
            let photoIds = []
            let fileId
            // ===============set files========================
            let logo = new FormData()
            let photos = new FormData
            const newArray = Object.values(data.photos)
            logo.append("files", data.logo[0])
            newArray.forEach(photo => {
                photos.append('files', photo)
            })
    
            async function submit() {
                // ==============submit with POST method================
                await axios.post('http://localhost:1337/api/upload', logo, {
                    headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                    }
                }
                )
                    .then(async (response) => {
                        fileId = response.data[0].id
                            
                        await axios.post('http://localhost:1337/api/upload', 
                            photos
                        ,{
                            headers: {
                                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                                }
                        })
                            .then(respond => {
                                console.log(respond)
                                respond.data.map(photo => photoIds.push(photo.id))
                            })
                            .catch(error => console.log(error))
                    }, (error) => {
                        console.log(error);
                    });
                
                axios.post("http://localhost:1337/api/organisations", {
                    data: {
                        name: data.name,
                        phoneNumber: data.phoneNumber,
                        address: data.address,
                        website: data.website,
                        email: data.email,
                        about: data.about,
                        ownedBy: data.ownedBy,
                        logo: fileId,
                        photos: photoIds,
                        appsDeveloped: developedAppsIds,
                        appsOwned: ownedAppsIds
                    }
                },{
                    headers: {
                    'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                    }
                })
                    .then(respond => {
                        setIsSubmitSuccessful(true)
                        console.log("Submit Successfully!")
                        // ===========set input value to be empty================
                        $('.form-control').val("")
                    })
                    .catch(error => console.log(error))
            }

            submit()
            
        }else{
            setShow(true)
            reset({
                data: null
            })
        }
        
    }

    //=================a dialogue pops up when errors occur============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
   
    return(
        <div className={cx('wrapper')}>
            {/* =============popup dialogue============== */}
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
            <Form className={cx('form')} onSubmit={handleSubmit(submitHandler)}>
                {/* =============== name ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên cơ quan</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter name" 
                        name="name" 
                        {...register("name")}
                    />
                    {errors.name && 
                        <Form.Text className="text-muted">
                            {errors.name.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== email ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>email</Form.Label>
                    <Form.Control 
                        type="email" 
                        placeholder="Enter email" 
                        name="email" 
                        {...register("email")}
                    />
                    {errors.email && 
                        <Form.Text className="text-muted">
                            {errors.email.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== address ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter address" 
                        name="address" 
                        {...register("address")}
                    />
                    {errors.address && 
                        <Form.Text className="text-muted">
                            {errors.address.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== website ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Website</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter website" 
                        name="website"
                        {...register("website")}
                    />
                    {errors.website && 
                        <Form.Text className="text-muted">
                            {errors.website.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== owned by ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Thuộc sở hữu của</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter owner" 
                        name="ownedBy"
                        {...register("ownedBy")}
                    />
                    {errors.ownedBy && 
                        <Form.Text className="text-muted">
                            {errors.ownedBy.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== phone number ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter phone number" 
                        name="phone number" 
                        {...register("phoneNumber")}
                    />
                    {errors.phoneNumber && 
                        <Form.Text className="text-muted">
                            {errors.phoneNumber.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== about ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Giới thiệu về cơ quan</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter about" 
                        name="about" 
                        {...register("about")}
                    />
                    {errors.about && 
                        <Form.Text className="text-muted">
                            {errors.about.message}
                        </Form.Text>
                    }
                </Form.Group>
                {/* =============== logo ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Ảnh Logo</Form.Label>
                    <Form.Control 
                        type="file" 
                        placeholder="Enter email" 
                        name="logo"
                        {...register("logo")}
                        required
                    />
                </Form.Group>
                {/* =============== illustrating photos ====================== */}
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Các ảnh minh họa khác:</Form.Label>
                    <Form.Control 
                        type="file" 
                        placeholder="Enter photos" 
                        name="file[]" 
                        multiple
                        {...register("photos")}
                        required
                    />
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
                
                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default AddOrganisations
