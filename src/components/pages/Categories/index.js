import classnames from 'classnames/bind';
import { Link } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import $ from 'jquery';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import style from './Categories.module.scss';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { UserAuth } from '../../../context/AuthContext';

const cx = classnames.bind(style);

function Categories({ apps, categoryId, category }) {
    // ==========get current logged in user==================
    const { user } = UserAuth();
    // ==========get sorted apps and apps' ids===================
    let sortedApps = [];
    let sortedAppsIds = [];
    apps.map((app) => {
        if (app.attributes.category.data && app.attributes.category.data.id === categoryId) {
            sortedAppsIds.push(app.id);
        }
        if (category.attributes.name === 'Tất cả') {
            sortedAppsIds.push(app.id);
        }
    });
    // ===============appIds for deleting=============
    const [appIds, setAppIds] = useState([]);
    // detecting the device's OS
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

    // ============app delete button handler=========
    useEffect(() => {
        $('#delete-btn').prop('disabled', true);
    }, []);
    const appDeleteBtn = () => {
        if ($('input[name="body__checkbox"]:checked').length > 0) {
            $('#delete-btn').prop('disabled', false);
        } else if ($('input[name="body__checkbox"]:checked').length === 0) {
            $('#delete-btn').prop('disabled', true);
        }
    };

    // ==============checkboxes hanlder============
    const headCheckHandler = () => {
        //check all individual app
        const isChecked = $('#head__checkbox').prop('checked');
        if (isChecked) {
            $('input[name="body__checkbox"]').prop('checked', true);
        } else $('input[name="body__checkbox"]').prop('checked', false);
        appDeleteBtn();
    };

    const bodyCheckHandler = (appId) => {
        //check the all-drivers checkbox
        const isCheckedAll =
            $('input[name="body__checkbox"]').length === $('input[name="body__checkbox"]:checked').length;
        if (isCheckedAll) {
            $('#head__checkbox').prop('checked', true);
        } else {
            $('#head__checkbox').prop('checked', false);
        }

        const isChecked = $(`#body__checkbox-${appId}`).is(':checked');
        if (isChecked === true) {
            setAppIds([...appIds, appId]);
        } else {
            setAppIds(() => {
                let ids = [];
                ids = appIds.filter((appIdMapped) => appIdMapped != appId);
                return ids;
            });
        }
        appDeleteBtn();
    };
    // ==============app delete handler=============
    const deleteAppHandler = () => {
        if ($('input[name="body__checkbox"]:checked').length === $('input[name="body__checkbox"]').length) {
            sortedAppsIds.map((id) => {
                axios
                    .delete(`http://localhost:1337/api/apps/${id}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                        },
                    })
                    .then((respond) => {
                        apps.map((app) => {
                            if (app.id === respond.data.data.id) {
                                axios
                                    .delete(`http://localhost:1337/api/upload/files/${app.attributes.logo.data.id}`, {
                                        headers: {
                                            Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                                        },
                                    })
                                    .then((respond) => {
                                        window.location.reload();
                                    })
                                    .catch((error) => console.log(error));

                                app.attributes.screenshots.data
                                    .map((screenshot) => {
                                        axios.delete(`http://localhost:1337/api/upload/files/${screenshot.id}`, {
                                            headers: {
                                                Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                                            },
                                        });
                                    })
                                    .then((respond) => {
                                        window.location.reload();
                                    })
                                    .catch((error) => console.log(error));
                            }
                        });
                    })
                    .catch((error) => console.log(error));
            });
        } else if (
            $('input[name="body__checkbox"]:checked').length < $('input[name="body__checkbox"]').length &&
            $('input[name="body__checkbox"]:checked').length > 0
        ) {
            appIds.map((id) => {
                axios
                    .delete(`http://localhost:1337/api/apps/${id}`, {
                        headers: {
                            Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                        },
                    })
                    .then((respond) => {
                        apps.map((app) => {
                            if (app.id === respond.data.data.id) {
                                axios
                                    .delete(`http://localhost:1337/api/upload/files/${app.attributes.logo.data.id}`, {
                                        headers: {
                                            Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                                        },
                                    })
                                    .then((respond) => {
                                        window.location.reload();
                                    })
                                    .catch((error) => console.log(error));
                                app.attributes.screenshots.data
                                    .map((screenshot) => {
                                        axios.delete(`http://localhost:1337/api/upload/files/${screenshot.id}`, {
                                            headers: {
                                                Authorization: `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}`,
                                            },
                                        });
                                    })
                                    .then((respond) => {
                                        window.location.reload();
                                    })
                                    .catch((error) => console.log(error));
                            }
                        });
                    })
                    .catch((error) => console.log(error));
            });
        } else if ($('input[name="body__checkbox"]:checked').length === 0) {
        }
    };

    //=================a dialogue pops up when a delete request exists============
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);

    return (
        <div className={cx('wrapper')}>
            {/* =============a dialogue pops up whenever a delete request exists============== */}
            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Xóa phân loại</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có thực sự muốn xóa các phân loại này không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => handleClose()} className={cx('modal-btn')}>
                        Hủy
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleClose();
                            deleteAppHandler();
                        }}
                        className={cx('modal-btn')}
                    >
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>

            <h4 className={cx('title')}>
                Danh sách các ứng dụng thuộc phân loại <span>{category.attributes.name}</span>
            </h4>

            {user != null && user.isAdmin && (
                <Button id="delete-btn" variant="danger" className={cx('delete-btn')} onClick={() => setShow(true)}>
                    Delete
                </Button>
            )}

            <div className={cx('apps-container')}>
                <Table striped bordered hover>
                    <thead className={cx('head')}>
                        <tr>
                            {user != null && user.isAdmin && (
                                <th className={cx('head__checkbox')}>
                                    <input id="head__checkbox" type="checkbox" onChange={() => headCheckHandler()} />
                                </th>
                            )}
                            <th className={cx('head__index')}>#</th>
                            <th className={cx('head__image')}>Logo</th>
                            <th className={cx('head__name')}>name</th>
                            <th className={cx('head__download-link')}>Liên kết tải xuống</th>
                        </tr>
                    </thead>
                    <tbody className={cx('body')}>
                        {apps.map((app) => {
                            if (
                                app.attributes.category.data &&
                                app.attributes.category.data.attributes.name === category.attributes.name
                            ) {
                                sortedApps.push(app);
                            }
                            if (category.attributes.name === 'Tất cả') {
                                sortedApps.push(app);
                            }
                        })}

                        {sortedApps.map((sortedApp, index) => {
                            return (
                                <tr key={index}>
                                    {user != null && user.isAdmin && (
                                        <th className={cx('body__checkbox')}>
                                            <input
                                                id={`body__checkbox-${sortedApp.id}`}
                                                name="body__checkbox"
                                                type="checkbox"
                                                onChange={() => bodyCheckHandler(sortedApp.id)}
                                            />
                                        </th>
                                    )}

                                    <td className={cx('body__index')}>{index + 1}</td>

                                    <td className={cx('body__image')}>
                                        <img
                                            src={`http://localhost:1337${sortedApp.attributes.logo.data.attributes.url}`}
                                        />
                                    </td>

                                    <td className={cx('body__name')}>{sortedApp.attributes.name}</td>

                                    <td className={cx('body__download-link')}>
                                        {getMobileOperatingSystem() === 'Android' && (
                                            <a
                                                className={cx('head__download-link')}
                                                href={sortedApp.attributes.androidLink}
                                                target="blank"
                                            >
                                                <img src="/pictures/android-download.png" />
                                            </a>
                                        )}
                                        {getMobileOperatingSystem() === 'IOS' && (
                                            <a
                                                className={cx('head__download-link')}
                                                href={sortedApp.attributes.iosLink}
                                                target="blank"
                                            >
                                                <img src="/pictures/Apple-ios-download.png" />
                                            </a>
                                        )}
                                        {getMobileOperatingSystem() === 'WindowPhone' && (
                                            <span className={cx('message')}>
                                                Hiện tại ứng dụng này vẫn chưa có trên nền tảng Window phone
                                            </span>
                                        )}
                                        {getMobileOperatingSystem() != 'Android' &&
                                            getMobileOperatingSystem() != 'IOS' &&
                                            getMobileOperatingSystem() != 'WindowPhone' && (
                                                <span className={cx('message')}>
                                                    Ứng dụng không khả dụng trên thiết bị của bạn
                                                </span>
                                            )}
                                    </td>
                                </tr>
                            );
                        })}

                        {sortedApps.length === 0 && (
                            <tr>
                                <td colSpan={5}>
                                    <div className={cx('message')}>
                                        Chưa có bất kì ứng dụng nào ở danh mục thể loại này!!!
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </div>
        </div>
    );
}

export default Categories;
