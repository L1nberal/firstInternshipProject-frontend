import React, { useState, useEffect } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal';
import { useForm } from "react-hook-form";
import $ from 'jquery'
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';

import style from './AddCategories.module.scss'

const cx = classnames.bind(style)

function AddCategories(data) {
    // =======get categories===========
    const [arrayOfCategories, setArrayOfCategories] = useState([])
    let categories = []
    useEffect(() => {
        axios("http://localhost:1337/api/categories?populate=*")
            .then(respond => {
                setArrayOfCategories(respond.data.data)
            })
            .catch(error => console.log(error))
    }, [])    

    // ===============check if form has been submitted successfully=============
    const  [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false)
    //============ set fields as being required==========
    const schema = yup.object().shape({
        name: yup.string().required("Bạn chưa nhập tên phân loại"),
        ordered: yup.string().required("Bạn chưa nhập thứ tự sắp xếp cho phân loại"),
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
    
    async function submitHandler(data) {  
        let error = false
        
        await arrayOfCategories.map(category => {
            if(category.attributes.name === data.name) {
                error = true
            }else if(category.attributes.ordered == data.ordered) {
                error = true
            }
        })
        
        if(error === false) {
            axios.post('http://localhost:1337/api/categories', {
                "data": {
                    name: data.name,
                    ordered: parseInt(data.ordered),
                }
            },{
                headers: {
                'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
                }
            }
            )
                .then((respond) => {
                    console.log(respond)

                    let array = [...arrayOfCategories, respond.data.data]
                    setArrayOfCategories(array)

                    setIsSubmitSuccessful(true)
                    // ===========set input value to be empty================
                    $('.form-control').val("")


                }, (error) => {
                    console.log(error);
                })
        }else {
            setShow(true)
            reset({
                data: 'test'
            })
        }
    }

    //a dialogue pops up when errors occur
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return(
        <div className={cx('wrapper')}>
            <div className={cx('content')}>
                {/* =============popup dialogue============== */}
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Thông tin bạn nhập đã tồn tại, mời bạn thử lại!</Modal.Body>
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
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Tên phân loại</Form.Label>
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
    
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Thứ tự sắp xếp</Form.Label>
                        <Form.Control 
                            type="text" 
                            placeholder="Enter ordered number" 
                            name="ordered" 
                            {...register("ordered")}
                        />
                        {errors.ordered && 
                            <Form.Text className="text-muted">
                                {errors.ordered.message}
                            </Form.Text>
                        }
                    </Form.Group>
    
                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>

            <div className={cx('sidebar')}>
                <h6 className={cx('sidebar__title')}>Danh sách các phân loại và thứ tự sắp xếp:</h6>
                
                {arrayOfCategories.map((category, index) => {
                    return (
                        <div key={index} className={cx('sidebar__container')}>
                            <div className={cx('name')}>{category.attributes.name}:</div>
                            <div className={cx('ordered')}>{category.attributes.ordered}</div>
                        </div>
                    )
                })} 
            </div>
        </div>
    )
}

export default AddCategories
