import React, { useState } from 'react';
import classnames from 'classnames/bind';
import Card from 'react-bootstrap/Card';
import Modal from 'react-bootstrap/Modal';
import style from './AppDetails.module.scss';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, Link } from 'react-router-dom';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';

import { UserAuth } from '../../../context/AuthContext';
import Comments from './components/Comments';
import axios from 'axios';

const cx = classnames.bind(style);

function AppDetails({ apps, appId, comments, users, app }) {
    // ==========getting user from userauth======
    const { user } = UserAuth();
    // ============navigate=============
    const navigate = useNavigate();
    // ===============check if there are any related apps==================
    let relatedApps = 0;
    // ===============detecting the device's OS==================
    function getMobileOperatingSystem() {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;

        // Windows Phone must come first because its UA also contains "Android"
        if (/windows phone/i.test(userAgent)) {
            return 'WindowPhone';
        }

        if (/android/i.test(userAgent)) {
            return 'Android';
        }

        // iOS detection from: http://stackoverflow.com/a/9039885/177710
        if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
            return 'IOS';
        }
        return 'unknown';
    }
    // ==============app delete handler=============
    const deleteHandler = async (appId) => {
        await axios
            .delete(`http://localhost:1337/api/upload/files/${app.attributes.logo.data.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {})
            .catch((error) => console.log(error));
        app.attributes.screenshots.data.map(async (screenshot) => {
            await axios
                .delete(`http://localhost:1337/api/upload/files/${screenshot.id}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                    },
                })
                .then((respond) => {})
                .catch((error) => console.log(error));
        });
        await axios
            .delete(`http://localhost:1337/api/apps/${appId}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                },
            })
            .then((respond) => {
                navigate('/');
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
                    <Modal.Title>X??a ???ng d???ng</Modal.Title>
                </Modal.Header>
                <Modal.Body>B???n c?? th???c s??? mu???n x??a ???ng d???ng n??y kh??ng?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()} className={cx('modal-btn')}>
                        H???y
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleClose();
                            deleteHandler(appId);
                        }}
                        className={cx('modal-btn')}
                    >
                        X??a
                    </Button>
                </Modal.Footer>
            </Modal>

            <div className={cx('infor')}>
                <div className={cx('app-details')}>
                    <div className={cx('head')}>
                        <div className={cx('above')}>
                            <img
                                src={`http://localhost:1337${app.attributes.logo.data.attributes.url}`}
                                alt={app.attributes.name}
                            />

                            <div className={cx('head__infor')}>
                                <div className={cx('name')}>{app.attributes.name}</div>
                                <div className={cx('owner')}>
                                    Thu???c s??? h???u c???a:
                                    {app.attributes.owner.data != null && (
                                        <Link
                                            to={`/organisation-details-${app.attributes.owner.data.id}`}
                                            state={app.attributes.owner}
                                            className={cx('owner__name')}
                                        >
                                            {app.attributes.owner.data.attributes.name}
                                        </Link>
                                    )}
                                </div>
                                <div className={cx('category')}>
                                    Ph??n lo???i:
                                    {app.attributes.category.data != null && (
                                        <Link
                                            to={`/category-${app.attributes.category.data.id}`}
                                            className={cx('category__name')}
                                        >
                                            {app.attributes.category.data.attributes.name}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={cx('below')}>
                            {user && (
                                <React.Fragment>
                                    {user.isAdmin && (
                                        <div className={cx('head__btn-group')}>
                                            {/* =============app update button==============  */}
                                            <Button
                                                variant="outline-primary"
                                                className={cx('head__update-btn')}
                                                onClick={() => navigate(`/app-update-${appId}`)}
                                            >
                                                C???p nh???t
                                            </Button>

                                            <Button
                                                variant="outline-danger"
                                                className={cx('head__delete-btn')}
                                                onClick={() => setShow(true)}
                                            >
                                                X??a ???ng d???ng
                                            </Button>
                                        </div>
                                    )}
                                </React.Fragment>
                            )}

                            <div className={cx('download-container')}>
                                {getMobileOperatingSystem() === 'Android' && (
                                    <React.Fragment>
                                        {app.attributes.androidLink != null ? (
                                            <a
                                                className={cx('head__download-link')}
                                                href={app.attributes.androidLink}
                                                target="blank"
                                            >
                                                <img src="/pictures/android-download.png" />
                                            </a>
                                        ) : (
                                            <div>Ch??a c?? li??n k???t t???i xu???ng cho android</div>
                                        )}
                                    </React.Fragment>
                                )}
                                {getMobileOperatingSystem() === 'IOS' && (
                                    <React.Fragment>
                                        {app.attributes.iosLink ? (
                                            <a
                                                className={cx('head__download-link')}
                                                href={app.attributes.iosLink}
                                                target="blank"
                                            >
                                                <img src="/pictures/Apple-ios-download.png" />
                                            </a>
                                        ) : (
                                            <div>Ch??a c?? li??n k???t t???i xu???ng cho IOS</div>
                                        )}
                                    </React.Fragment>
                                )}
                                {getMobileOperatingSystem() === 'WindowPhone' && (
                                    <span className={cx('message')}>
                                        Hi???n t???i ???ng d???ng n??y v???n ch??a c?? tr??n n???n t???ng Window phone
                                    </span>
                                )}
                                {getMobileOperatingSystem() != 'Android' &&
                                    getMobileOperatingSystem() != 'IOS' &&
                                    getMobileOperatingSystem() != 'WindowPhone' && (
                                        <span className={cx('message')}>
                                            ???ng d???ng kh??ng kh??? d???ng tr??n thi???t b??? c???a b???n
                                        </span>
                                    )}
                            </div>
                        </div>
                    </div>

                    <div className={cx('general-infor')}>
                        <h6>M?? t???:</h6>
                        <div>{app.attributes.description}</div>
                    </div>

                    <div className={cx('carousel')}>
                        <h5 className={cx('carousel__title')}>???nh ch???p m??n h??nh:</h5>

                        <div className={cx('carousel-provider')}>
                            {app.attributes.screenshots.data != null ? (
                                <CarouselProvider
                                    naturalSlideWidth={100}
                                    naturalSlideHeight={125}
                                    totalSlides={8}
                                    visibleSlides={4}
                                    currentSlide={0}
                                >
                                    <Slider>
                                        {app.attributes.screenshots.data.map((screenshot, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Slide className={cx('carousel-slide')}>
                                                        <img
                                                            src={`http://localhost:1337${screenshot.attributes.url}`}
                                                        />
                                                    </Slide>
                                                </React.Fragment>
                                            );
                                        })}
                                    </Slider>

                                    <div className={cx('btn-container')}>
                                        <ButtonBack className={cx('carousel-left-btn')}>Back</ButtonBack>
                                        <ButtonNext className={cx('carousel-right-btn')}>Next</ButtonNext>
                                    </div>
                                </CarouselProvider>
                            ) : (
                                <div>Ch??a c?? ???nh minh h???a n??o cho ???ng d???ng n??y</div>
                            )}
                        </div>

                        <div className={cx('carousel-provider-mobile-tablet')}>
                            {app.attributes.screenshots.data != null ? (
                                <CarouselProvider
                                    naturalSlideWidth={100}
                                    naturalSlideHeight={125}
                                    totalSlides={8}
                                    visibleSlides={2}
                                    currentSlide={0}
                                >
                                    <Slider>
                                        {app.attributes.screenshots.data.map((screenshot, index) => {
                                            return (
                                                <React.Fragment key={index}>
                                                    <Slide className={cx('carousel-slide')}>
                                                        <img
                                                            src={`http://localhost:1337${screenshot.attributes.url}`}
                                                        />
                                                    </Slide>
                                                </React.Fragment>
                                            );
                                        })}
                                    </Slider>

                                    <div className={cx('btn-container')}>
                                        <ButtonBack className={cx('carousel-left-btn')}>Back</ButtonBack>
                                        <ButtonNext className={cx('carousel-right-btn')}>Next</ButtonNext>
                                    </div>
                                </CarouselProvider>
                            ) : (
                                <div>Ch??a c?? ???nh minh h???a n??o cho ???ng d???ng n??y</div>
                            )}
                        </div>
                    </div>

                    <div className={cx('developer')}>
                        {app.attributes.developer.data != null ? (
                            <React.Fragment>
                                <h5 className={cx('developer__title')}>
                                    Nh?? ph??t tri???n:{' '}
                                    <Link
                                        to={`/organisation-details-${app.attributes.developer.data.id}`}
                                        state={app.attributes.developer}
                                    >
                                        {app.attributes.developer.data.attributes.name}
                                    </Link>
                                </h5>

                                <div className={cx('developer__contact')}>
                                    <h5 className={cx('title')}>Th??ng tin li??n h???: </h5>

                                    <div className={cx('infor')}>
                                        <div>
                                            <div className={cx('infor__phone-number')}>
                                                S??? ??i???n tho???i: {app.attributes.developer.data.attributes.phoneNumber}
                                            </div>
                                            <div className={cx('infor__email')}>
                                                Email: {app.attributes.developer.data.attributes.email}
                                            </div>
                                        </div>
                                        <div>
                                            <div className={cx('infor__address')}>
                                                ?????a ch???: {app.attributes.developer.data.attributes.address}
                                            </div>
                                            <div className={cx('infor__website')}>
                                                Website:{' '}
                                                <a
                                                    href={app.attributes.developer.data.attributes.website}
                                                    target="_blank"
                                                >
                                                    {app.attributes.developer.data.attributes.website}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        ) : (
                            <div>Ch??a c?? th??ng tin cho nh?? ph??t tri???n c???a ???ng d???ng n??y</div>
                        )}
                    </div>
                </div>
                {/* =================apps which are related to the app shown ================== */}
                <div className={cx('related-apps')}>
                    <h5 className={cx('related-apps__title')}>C??c apps li??n quan:</h5>

                    {app.attributes.category.data != null ? (
                        <div className={cx('related-apps__container')}>
                            {apps.map((relatedApp, index) => {
                                if (relatedApp.id != appId && relatedApp.attributes.category.data) {
                                    if (
                                        app.attributes.category.data.attributes.name ===
                                            relatedApp.attributes.category.data.attributes.name &&
                                        app.attributes.name != relatedApp.attributes.name
                                    ) {
                                        relatedApps = relatedApps + 1;
                                    }
                                }

                                return (
                                    <React.Fragment key={index}>
                                        {relatedApp.attributes.category.data && (
                                            <React.Fragment>
                                                {app.attributes.category.data.attributes.name ===
                                                    relatedApp.attributes.category.data.attributes.name &&
                                                    app.attributes.name != relatedApp.attributes.name && (
                                                        <Link to={`/app-details-${relatedApp.id}`}>
                                                            <Card border="dark" className={cx('app-container')}>
                                                                <Card.Body className="d-flex">
                                                                    <Card.Img
                                                                        className={cx('image')}
                                                                        src={`http://localhost:1337${relatedApp.attributes.logo.data.attributes.url}`}
                                                                    ></Card.Img>

                                                                    <Card.Text>
                                                                        <div className={cx('name')}>
                                                                            {relatedApp.attributes.name}
                                                                        </div>

                                                                        <div className={cx('description')}>
                                                                            {relatedApp.attributes.description}
                                                                        </div>
                                                                    </Card.Text>
                                                                </Card.Body>
                                                            </Card>
                                                        </Link>
                                                    )}
                                            </React.Fragment>
                                        )}
                                    </React.Fragment>
                                );
                            })}

                            {/* ==============check if there's no app related to the app shown, a message would be printed out================ */}
                            {relatedApps === 0 && (
                                <div className={cx('related-apps__message')}>
                                    Hi???n t???i th?? {app.attributes.name} l?? ???ng d???ng duy nh???t thu???c ph??n lo???i{' '}
                                    {app.attributes.category.data.attributes.name} t???i trang web n??y!
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className={cx('related-apps__message')}>
                            Ch??a c?? ???ng d???ng n??o li??n quan ?????n ph??n lo???i n??y ???????c th??m v??o!
                        </div>
                    )}
                </div>
            </div>

            <div className={cx('comments-section')}>
                <Comments appId={appId} users={users} />
            </div>
        </div>
    );
}

export default AppDetails;
