import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import React, { useEffect, useState } from 'react';
import {Link} from "react-router-dom";
import classnames from 'classnames/bind'
import Moment from 'moment';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import $ from 'jquery'
import Spinner from 'react-bootstrap/Spinner';

import style from './Apps.module.scss'
import {
    icons
} from '../../../../../assets'

const cx = classnames.bind(style)

function Apps({apps, organisations, sortingCategory, sortingIndex}) {
    // ===========apps and pages infor for pagination===========
    const [currentPage, setCurrentPage] = useState(1)
    const [appsPerPage, setAppsPerPage] = useState(4)
    // ==============move to page 1 again after changing the category=================
    useEffect(() => {
        setCurrentPage(1)
    }, [sortingIndex])
    //========================= get current posts===========================
    const indexOfLastApp = currentPage * appsPerPage
    const indexOfFirstApp = indexOfLastApp - appsPerPage
    //================== sorting apps into categories==================
    let newArrayOfApps = []
    if(sortingCategory === "Tất cả") {
        apps.map(app => {
            newArrayOfApps.push(app)
        })
    }else(
        apps.filter(app => {
            if(app.attributes.category.data && app.attributes.category.data.attributes.name === sortingCategory) {
                newArrayOfApps.push(app)
            }
        })
    )
    // =====================current apps on a page===================
    const currentApps = newArrayOfApps.slice(indexOfFirstApp, indexOfLastApp)
    // ==================number of apps on a page=======================
    const  numberOfpages = Math.ceil(newArrayOfApps.length/appsPerPage)
    // ======================change page=====================
    const handlePageClick = (data) => {
        setCurrentPage(data.selected+1)
    }
   
    return (
        <div className={cx('wrapper')}>
            <ListGroup as="ol" className={cx('list-group')}>
                {currentApps.map(app => {
                    // distinguishing new and old app
                    const formatDate = Moment(app.attributes.publishedAt).format("MM/DD/YYYY") 
                    const now = new Date()
                    const date = new Date(formatDate)
                    const amountOfDays1 = Math.ceil((now.getTime() -  date.getTime())/(1000*60*60*24))
                    return (
                        <React.Fragment key={app.id}> 
                            {app.attributes.owner.data != null ? (
                                <React.Fragment>
                                    {organisations.map((organisation) => {
                                        return (
                                            <React.Fragment key={organisation.id}>
                                                    <React.Fragment>
                                                        {app.attributes.owner.data.attributes.name === organisation.attributes.name && (
                                                            <Link to={`/app-details-${app.id}`} state={{app: app}}>
                                                                <ListGroup.Item
                                                                    as="li"
                                                                    className={cx('list-item')}
                                                                    key={organisation.id}
                    
                                                                >
                                                                    <div className={cx('list-item__name')}>
                                                                        {app.attributes.name}
                                                                    </div>
                    
                                                                    <div className={cx('list-item__owner-infor')}>
                                                                        {organisation.attributes.logo.data != null ? (
                                                                            <img 
                                                                                className={cx('logo')}
                                                                                src={`http://localhost:1337${organisation.attributes.logo.data.attributes.url}`}
                                                                            />
                                                                        ) : (
                                                                            <img 
                                                                                className={cx('logo')}
                                                                                src=""
                                                                            />
                                                                        )}
                    
                                                                        <div className={cx('name')}>
                                                                            {organisation.attributes.name}
                                                                        </div>
                                                                    </div>
                    
                                                                    <div className={cx('list-item__status')}>
                                                                        {amountOfDays1 < 25 ? (
                                                                            <Badge 
                                                                                bg="primary"
                                                                                className={cx('new')} 
                                                                                pill 
                                                                            >
                                                                                new
                                                                            </Badge>
                                                                        ) : (
                                                                            <Badge 
                                                                                bg="primary"
                                                                                className={cx('old')} 
                                                                                pill 
                                                                            >
                                                                                old
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                        
                                                                </ListGroup.Item>
                                                            </Link>
                                                        )}
                                                    </React.Fragment>
                                            </React.Fragment>
                                        )
                                    })}
                                </React.Fragment>
                            ) : (
                                <Link to={`/app-details-${app.id}`} state={{app: app}}>
                                    <ListGroup.Item
                                        as="li"
                                        className={cx('list-item')}
                                        key={app.id}
                                    >
                                        <div className={cx('list-item__name')}>
                                            {app.attributes.name}
                                        </div>

                                        <div className={cx('list-item__status')}>
                                            {amountOfDays1 < 25 ? (
                                                <Badge 
                                                    bg="primary"
                                                    className={cx('new')} 
                                                    pill 
                                                >
                                                    new
                                                </Badge>
                                            ) : (
                                                <Badge 
                                                    bg="primary"
                                                    className={cx('old')} 
                                                    pill 
                                                >
                                                    old
                                                </Badge>
                                            )}
                                        </div>
            
                                    </ListGroup.Item>
                                </Link>
                            )}
                        </React.Fragment>
                    )
                })}
            </ListGroup>

            <div className={cx('Pagination')}>
                <ReactPaginate
                    nextLabel={<FontAwesomeIcon icon={icons.faAngleRight}/>}
                    previousLabel={<FontAwesomeIcon icon={icons.faAngleLeft}/>}
                    pageCount={numberOfpages}
                    marginPagesDisplayed={2}
                    onPageChange={handlePageClick}
                    pageClassName={'page-item'}
                    renderOnZeroPageCount={null}
                />
            </div>
        </div>
    )

    
}

export default Apps
