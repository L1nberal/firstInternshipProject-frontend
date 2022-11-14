import classnames from 'classnames/bind';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-bootstrap/Carousel';
import Card from 'react-bootstrap/Card';
import CardGroup from 'react-bootstrap/CardGroup';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import style from './OrganisationDetails.module.scss';
import { icons } from '../../../assets';
import { UserAuth } from '../../../context/AuthContext';
import axios from 'axios';

const cx = classnames.bind(style);

function OrganisationDetails({ apps, organisations, organisationId, users, organisation }) {
    const { user } = UserAuth();
    //================ the amount of owned apps===================
    let amountOfOwnedApps = 0;
    //============the amount of developed apps==================
    let amountOfDevelopedApps = 0;
    // ==========navigate==================
    const navigate = useNavigate();

    // =============delete organisation handler=========
    const deleteHandler = async (organisationId) => {
        await axios
            .delete(`http://localhost:1337/api/upload/files/${organisation.attributes.logo.data.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {})
            .catch((error) => console.log(error));
        organisation.attributes.photos.data.map(async (photo) => {
            await axios
                .delete(`http://localhost:1337/api/upload/files/${photo.id}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                    },
                })
                .then((respond) => {})
                .catch((error) => console.log(error));
        });
        axios
            .delete(`http://localhost:1337/api/organisations/${organisationId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {
                navigate('/');
                window.location.reload();
            })
            .catch((error) => console.log(error));
    };
    //=================a dialogue pops up when a delete request exists============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <div className={cx('wrapper')}>
            {/* =============a dialogue pops up whenever a delete request exists============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa Cơ quan</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có thực sự muốn xóa cơ quan này không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()} className={cx('modal-btn')}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleClose();
                            deleteHandler(organisationId);
                        }}
                        className={cx('modal-btn')}
                    >
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            {organisations.map((organisation, index) => {
                return (
                    // organisations' details
                    <React.Fragment key={index}>
                        {/* compare to print out the right organisation */}
                        {organisation.id === organisationId && (
                            <React.Fragment>
                                <div className={cx('head')}>
                                    <div className={cx('above')}>
                                        <div className={cx('image-container')}>
                                            <img
                                                className={cx('head__image')}
                                                src={`http://localhost:1337${organisation.attributes.logo.data.attributes.url}`}
                                            />
                                        </div>

                                        <div className={cx('head__infor')}>
                                            <div>
                                                <div>
                                                    {organisation.attributes.name} | {organisation.attributes.ownedBy}
                                                </div>
                                                <div>
                                                    Số điện thoại: <span>{organisation.attributes.phoneNumber}</span>
                                                </div>
                                                <div>
                                                    Địa chỉ: <span>{organisation.attributes.address}</span>
                                                </div>
                                            </div>
                                            <div>
                                                <div>
                                                    Email: <span>{organisation.attributes.email}</span>
                                                </div>
                                                <div>
                                                    Website:{' '}
                                                    <span>
                                                        <a href={organisation.attributes.website} target="blank">
                                                            {organisation.attributes.website}
                                                        </a>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* ============ organisation update button ============== */}
                                    {user && (
                                        <React.Fragment>
                                            {user.isAdmin && (
                                                <div className={cx('head__btn-group')}>
                                                    <Button
                                                        variant="outline-primary"
                                                        className={cx('head__update-btn')}
                                                        onClick={() =>
                                                            navigate(`/organisation-update-${organisation.id}`)
                                                        }
                                                    >
                                                        Cập nhật
                                                    </Button>

                                                    <Button
                                                        variant="outline-danger"
                                                        className={cx('head__delete-btn')}
                                                        onClick={() => setShow(true)}
                                                    >
                                                        Xóa cơ quan
                                                    </Button>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    )}
                                </div>

                                <div className={cx('carousel')}>
                                    <Carousel fade>
                                        {organisation.attributes.photos.data.map((photo, index) => {
                                            return (
                                                <Carousel.Item key={index}>
                                                    <img
                                                        className="d-block w-100"
                                                        src={`http://localhost:1337${photo.attributes.url}`}
                                                        alt="First slide"
                                                    />
                                                </Carousel.Item>
                                            );
                                        })}
                                    </Carousel>
                                </div>

                                <div className={cx('general-infor')}>
                                    <h5 className={cx('title')}>Giới thiệu về cơ quan:</h5>

                                    <div className={cx('about')}>{organisation.attributes.about}</div>
                                </div>
                                {/*====================== apps devloped by the organisation ====================*/}
                                <div className={cx('apps-developed')}>
                                    <h5 className={cx('title')}>Những ứng dụng đã phát triển:</h5>

                                    <CardGroup>
                                        {apps.map((app, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {organisation.attributes.appsDeveloped.data.map(
                                                        (developedApp, index) => {
                                                            if (app.attributes.name === developedApp.attributes.name) {
                                                                amountOfDevelopedApps++;
                                                            }
                                                            let enter = amountOfDevelopedApps > 4;
                                                            return (
                                                                <React.Fragment key={index}>
                                                                    {app.attributes.name ===
                                                                        developedApp.attributes.name &&
                                                                        !enter && (
                                                                            <Card className={cx('app-container')}>
                                                                                <Link
                                                                                    to={`/app-details-${app.id}`}
                                                                                    state={{ app: app }}
                                                                                >
                                                                                    <Card.Img
                                                                                        className={cx('app-image')}
                                                                                        variant="top"
                                                                                        src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}
                                                                                    />
                                                                                    <Card.Body
                                                                                        className={cx('app-name')}
                                                                                    >
                                                                                        <Card.Title>
                                                                                            {app.attributes.name}
                                                                                        </Card.Title>
                                                                                    </Card.Body>
                                                                                </Link>
                                                                            </Card>
                                                                        )}
                                                                </React.Fragment>
                                                            );
                                                        },
                                                    )}
                                                </React.Fragment>
                                            );
                                        })}
                                    </CardGroup>

                                    {/* ==============a message is prined out when there is no app================ */}
                                    {amountOfDevelopedApps === 0 && (
                                        <div className={cx('message')}>
                                            Hiện tại cơ quan này vẫn chưa phát triển bất kì ứng dụng nào!
                                        </div>
                                    )}
                                    {/* ==============a button is rendered out when there are more than 4 apps================ */}
                                    {amountOfDevelopedApps > 4 && (
                                        <Link
                                            to={`/organisation-details-${organisation.id}-developed-apps`}
                                            className={cx('more-apps')}
                                        >
                                            <span>Xem Thêm</span>
                                            <FontAwesomeIcon icon={icons.faAnglesRight} />
                                        </Link>
                                    )}
                                </div>
                                {/*============= apps owned by the organisation ===============*/}
                                <div className={cx('apps-owned')}>
                                    <h5 className={cx('title')}>Những ứng dụng đang sở hữu:</h5>

                                    <CardGroup className={cx('apps-wrapper')}>
                                        {apps.map((app, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    {organisation.attributes.appsOwned.data.map((appsOwned, index) => {
                                                        if (app.attributes.name === appsOwned.attributes.name) {
                                                            amountOfOwnedApps++;
                                                        }
                                                        let enter = amountOfOwnedApps > 4;
                                                        return (
                                                            <React.Fragment key={index}>
                                                                {app.attributes.name === appsOwned.attributes.name &&
                                                                    !enter && (
                                                                        <Card className={cx('app-container')}>
                                                                            <Link to={`/app-details-${app.id}`}>
                                                                                <Card.Img
                                                                                    className={cx('app-image')}
                                                                                    variant="top"
                                                                                    src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}
                                                                                />
                                                                                <Card.Body className={cx('app-name')}>
                                                                                    <Card.Title>
                                                                                        {app.attributes.name}
                                                                                    </Card.Title>
                                                                                </Card.Body>
                                                                            </Link>
                                                                        </Card>
                                                                    )}
                                                            </React.Fragment>
                                                        );
                                                    })}
                                                </React.Fragment>
                                            );
                                        })}
                                    </CardGroup>
                                    {/* a message is prined out when there is no app */}
                                    {amountOfOwnedApps === 0 && (
                                        <div className={cx('message')}>
                                            Hiện tại cơ quan này vẫn chưa sở hữu bất kì ứng dụng nào!
                                        </div>
                                    )}
                                    {/* ==============a button is rendered out when there are more than 4 apps================ */}
                                    {amountOfOwnedApps > 4 && (
                                        <Link
                                            to={`/organisation-details-${organisation.id}-owned-apps`}
                                            className={cx('more-apps')}
                                        >
                                            <span>Xem Thêm</span>
                                            <FontAwesomeIcon icon={icons.faAnglesRight} />
                                        </Link>
                                    )}
                                </div>
                            </React.Fragment>
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export default OrganisationDetails;
