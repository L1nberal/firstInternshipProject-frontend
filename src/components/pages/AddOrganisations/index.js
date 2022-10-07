import React, { useState } from "react"
import classnames from 'classnames/bind'
import Form from 'react-bootstrap/Form';
import axios from 'axios'
import Button from 'react-bootstrap/Button'

import style from './AddOrganisations.module.scss'

const cx = classnames.bind(style)

function AddOrganisations() {
    const [name, setName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState()
    const [address, setAddress] = useState('')
    const [website, setWebsite] = useState('')
    const [email, setEmail] = useState('')
    const [about, setAbout] = useState('')
    const [logo, setLogo] = useState()
    const [ownedBy, setOwnedBy] = useState()
    // console.log(`name: ${name}
    //         phone number: ${phoneNumber}
    //         address: ${address}
    //         website: ${website}
    //         email: ${email}
    //         about: ${about}        
    //         logo: ${logo}        
    // `)

    // console.log(logo)
    function submitHandler(e) {
        e.preventDefault()

        axios.post('http://localhost:1337/api/organisations', {
            "data": {
                name: name,
                phoneNumber: phoneNumber,
                address: address,
                website: website,
                email: email,
                about: about,
                logo: logo,
                ownedBy: ownedBy,
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
        setAbout('')
        setAddress('')
        setEmail('')
        setWebsite('')
        setPhoneNumber()
        setOwnedBy()

    }
    return(
        <div className={cx('wrapper')}>
            <Form className={cx('form')} onSubmit={submitHandler}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên cơ quan</Form.Label>
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
                    <Form.Label>email</Form.Label>
                    <Form.Control 
                        value={email}
                        type="email" 
                        placeholder="Enter email" 
                        name="email" 
                        onChange={e => setEmail(e.target.value)}

                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Address</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter address" 
                        name="address" 
                        onChange={e => setAddress(e.target.value)}
                        value={address}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Website</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter website" 
                        name="website"
                        onChange={e => setWebsite(e.target.value)}
                        value={website}
                         
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Thuộc sở hữu của</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter owner" 
                        name="ownedBy"
                        onChange={e => setOwnedBy(e.target.value)}
                        value={ownedBy}
                         
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter phone number" 
                        name="phone number" 
                        onChange={e => setPhoneNumber(e.target.value)}
                        value={phoneNumber}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Giới thiệu về cơ quan</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter about" 
                        name="about" 
                        onChange={e => setAbout(e.target.value)}
                        value={about}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Ảnh Logo</Form.Label>
                    <Form.Control 
                        type="file" 
                        placeholder="Enter email" 
                        name="logo"
                        onChange={e => setLogo(e.target.files[0])}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Các ảnh minh họa khác:</Form.Label>
                    <Form.Control type="file" placeholder="Enter photos" name="file[]" nultiple/>
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

export default AddOrganisations
