import classnames from "classnames/bind"

import style from './LayoutWithSidebar.module.scss' 

const cx = classnames.bind(style)

function LayoutWithSidebar() {
    return(
        <div className={cx('wrapper')}>
            <div className={cx('sidebar')}></div>

            <div className={cx('content')}></div>
        </div>
    )
}

export default LayoutWithSidebar
