import React, { useState } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import style from './AddApps.module.scss'

const cx = classnames.bind(style)

function AddApps() {
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [androidLink, setAndroidLink] = useState('')
    const [iosLink, setIosLink] = useState('')   

    function submitHandler(e) {
        e.preventDefault()
        
        axios.post('http://localhost:1337/api/apps', {
            "data": {
                name: name,
                description: description,
                androidLink: androidLink,
                iosLink: iosLink,
            }
        },{
            headers: {
              'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        }
        )
            .then((response) => {
            console.log(response);
            }, (error) => {
            console.log(error);
        });

        setName('')
        setDescription('')
        setAndroidLink('')
        setIosLink('')
    }
    return(
        <div className={cx('wrapper')}>
            <Form className={cx('form')} onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên ứng dụng</Form.Label>
                    <Form.Control 
                        value={name}
                        type="text" 
                        placeholder="Enter name" 
                        name="name" 
                        onChange={e => setName(e.target.value)}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control 
                        value={description}
                        type="text" 
                        placeholder="Enter description" 
                        name="description" 
                        onChange={e => setDescription(e.target.value)}

                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Liên kết tải ứng dụng cho thiết bị android</Form.Label>
                    <Form.Control 
                        value={androidLink}
                        type="text" 
                        placeholder="Enter android link" 
                        name="androidLink" 
                        onChange={e => setAndroidLink(e.target.value)}

                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Liên kết tải ứng dụng cho thiết bị IOS</Form.Label>
                    <Form.Control 
                        value={iosLink}
                        type="text" 
                        placeholder="Enter ios link" 
                        name="iosLink" 
                        onChange={e => setIosLink(e.target.value)}

                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default AddApps
