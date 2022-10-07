import React, { useState } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import style from './AddCategories.module.scss'

const cx = classnames.bind(style)

function AddCategories() {
    const [name, setName] = useState('')
    const [ordered, setOrdered] = useState()
    // console.log(`name: ${name}
    //         ordered: ${ordered}       
    // `)

    function submitHandler(e) {
        e.preventDefault()
        
        axios.post('http://localhost:1337/api/categories', {
            "data": {
                name: name,
                ordered: parseInt(ordered),
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
        setOrdered(0)
    }
    return(
        <div className={cx('wrapper')}>
            <Form className={cx('form')} onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên phân loại</Form.Label>
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
                    <Form.Label>Thứ tự sắp xếp</Form.Label>
                    <Form.Control 
                        value={ordered}
                        type="text" 
                        placeholder="Enter ordered number" 
                        name="ordered" 
                        onChange={e => setOrdered(e.target.value)}

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

export default AddCategories
