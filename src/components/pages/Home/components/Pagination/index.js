import React, { useEffect, useState } from "react"
import classnames from "classnames/bind";
import ReactPaginate from 'react-paginate';

import style from './Pagination.module.scss'

const cx = classnames.bind(style)

function PaginationComponent({ appsPerPage, totalApps }) {
    const  numberOfpages = Math.ceil(totalApps.length/appsPerPage)

    return(  
        <React.Fragment>
            <ReactPaginate
                pageCount={numberOfpages}
                marginPagesDisplayed={3}
                onPageChange={handlePageClick}
                pageClassName={'page-item'}
                renderOnZeroPageCount={null}
            />
        </React.Fragment>
           
    )
} 

export default PaginationComponent
  