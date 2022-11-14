import React, { useState, useEffect } from 'react';
import classnames from 'classnames/bind';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import $ from 'jquery';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import style from './AddCategories.module.scss';
import { UserAuth } from '../../../context/AuthContext';
import { icons } from '../../../assets';

const cx = classnames.bind(style);

function AddCategories(data) {
    // =================get curent logged user===================
    const { user } = UserAuth();
    // =======get categories===========
    const [arrayOfCategories, setArrayOfCategories] = useState([]);
    // =======set categoryId for deleting===========
    const [categoryId, setCategoryId] = useState();
    let categories = [];
    useEffect(() => {
        axios('http://localhost:1337/api/categories?populate=*')
            .then((respond) => {
                setArrayOfCategories(respond.data.data);
            })
            .catch((error) => console.log(error));
    }, []);
    //============ set fields as being required==========
    const schema = yup
        .object()
        .shape({
            name: yup.string().required('Bạn chưa nhập tên phân loại'),
            ordered: yup.string().required('Bạn chưa nhập thứ tự sắp xếp cho phân loại'),
        })
        .required();
    // =============destructuring from useForm hook================
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });
    // ==================ordering categories to prioritize some scrucial ones============
    let categoriesTemporary;
    for (let i = 0; i < arrayOfCategories.length - 1; i++) {
        for (let j = i + 1; j < arrayOfCategories.length; j++) {
            if (arrayOfCategories[i].attributes.ordered > arrayOfCategories[j].attributes.ordered) {
                categoriesTemporary = arrayOfCategories[i];
                arrayOfCategories[i] = arrayOfCategories[j];
                arrayOfCategories[j] = categoriesTemporary;
            }
        }
    }

    async function submitHandler(data) {
        let error = false;

        await arrayOfCategories.map((category) => {
            if (category.attributes.name === data.name) {
                error = true;
            } else if (category.attributes.ordered == data.ordered) {
                error = true;
            }
        });

        if (error === false) {
            axios
                .post(
                    'http://localhost:1337/api/categories',
                    {
                        data: {
                            name: data.name,
                            ordered: parseInt(data.ordered),
                        },
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                        },
                    },
                )
                .then(
                    (respond) => {
                        let array = [...arrayOfCategories, respond.data.data];
                        setArrayOfCategories(array);
                        // ===========set input value to be empty================
                        $('.form-control').val('');
                    },
                    (error) => {
                        console.log(error);
                    },
                );
        } else {
            setShow(true);
        }
    }
    // ==============category delete handler===========
    const deleteHandler = (categoryId) => {
        axios
            .delete(`http://localhost:1337/api/categories/${categoryId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {
                let array = arrayOfCategories.filter((category) => category.id != categoryId);
                setArrayOfCategories(array);
            });
    };
    //===========a dialogue pops up when deleteHandler is called ===========
    const [deleteCategory, setDeleteCategory] = useState(false);
    const handleCloseDelete = () => setDeleteCategory(false);
    //===========a dialogue pops up when errors occur===========
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    // ==========check if the current logged user is admin to offer the feature==========
    if (user && user.isAdmin === false) {
        return (
            <div className={cx('warning-wrapper')}>
                <Spinner animation="border" variant="danger" />
                <div className={cx('warning')}>WARNING!!!</div>
                <div className={cx('message')}>Bạn không được phép truy cập chức năng này</div>
                <Link to="/">
                    Trở về trang chủ! <FontAwesomeIcon icon={icons.faRotateLeft} />
                </Link>
            </div>
        );
    } else {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('content')}>
                    {/* =============a dialogue pops up when errors occur============== */}
                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Thông tin bạn nhập đã tồn tại, mời bạn thử lại!</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose} className={cx('modal-btn')}>
                                Đã hiểu
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* =============a dialogue pops up when deleteHandler is called============== */}
                    <Modal show={deleteCategory} onHide={handleCloseDelete}>
                        <Modal.Header closeButton>
                            <Modal.Title>Có lỗi xảy ra!</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>Bạn có chắc chắn muốn xóa phân loại này?</Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleCloseDelete} className={cx('modal-btn')}>
                                Không
                            </Button>

                            <Button
                                variant="danger"
                                onClick={() => {
                                    deleteHandler(categoryId);
                                    setDeleteCategory(false);
                                }}
                                className={cx('modal-btn')}
                            >
                                Xóa
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Form className={cx('form')} onSubmit={handleSubmit(submitHandler)}>
                        <Form.Group className={cx('form-group', 'mb-3')} controlId="formBasicEmail">
                            <Form.Label>Tên phân loại</Form.Label>
                            <Form.Control
                                className={cx('infor-input')}
                                type="text"
                                placeholder="Enter name"
                                name="name"
                                {...register('name')}
                            />
                            {errors.name && <Form.Text className="text-muted">{errors.name.message}</Form.Text>}
                        </Form.Group>

                        <Form.Group className={cx('form-group', 'mb-3')} controlId="formBasicEmail">
                            <Form.Label>Thứ tự sắp xếp</Form.Label>
                            <Form.Control
                                className={cx('infor-input')}
                                type="text"
                                placeholder="Enter ordered number"
                                name="ordered"
                                {...register('ordered')}
                            />
                            {errors.ordered && <Form.Text className="text-muted">{errors.ordered.message}</Form.Text>}
                        </Form.Group>

                        <Button variant="primary" type="submit" className={cx('submit-btn')}>
                            Submit
                        </Button>
                    </Form>
                </div>

                <div className={cx('sidebar')}>
                    <h6 className={cx('sidebar__title')}>Danh sách các phân loại và thứ tự sắp xếp:</h6>

                    {arrayOfCategories.map((category, index) => {
                        return (
                            <div key={index} className={cx('sidebar__container')}>
                                <div className={cx('category-infor')}>
                                    <div className={cx('name')}>{category.attributes.name}:</div>
                                    <div className={cx('ordered')}>{category.attributes.ordered}</div>
                                </div>

                                <Button
                                    variant="secondary"
                                    className={cx('delete-btn')}
                                    onClick={() => {
                                        setDeleteCategory(true);
                                        setCategoryId(category.id);
                                    }}
                                >
                                    x
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

export default AddCategories;
