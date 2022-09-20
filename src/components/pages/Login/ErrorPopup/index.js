import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classnames from 'classnames/bind'

import {
    faCircleXmark,
    faX,

} from '../../../../assets/FontAwesome'
import style from './ErrorPopup.module.scss'

const cx = classnames.bind(style)

function ErrorPopup(props) {
    const { setPopup } = props

    return (
        <div className={cx('popup-wrapper')}>
            {/* x close window */}
            <button className={cx('popup-x')} onClick={()=> setPopup(false)}>
                <FontAwesomeIcon icon={faX}/>
            </button>
            <div className={cx('pu-content-container')}>
                <FontAwesomeIcon icon={faCircleXmark}/>
                <div className={cx('message')}>Bạn đã nhập sai mật khẩu hoặc tên đăng nhập</div>
            </div>
            {/* button controls */}
            <div className={cx('pu-button-container')}>
                <button onClick={()=> setPopup(false)}> OK </button>
            </div>
        </div>
    )
}

export default ErrorPopup
