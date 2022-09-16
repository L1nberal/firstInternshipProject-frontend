import classnames from 'classnames/bind';

import style from './DefaultLayout.module.scss'
import { Header } from '../components'

const cx = classnames.bind(style)

function DefaultLayout({children}) {
    return (
        <div className={cx('wrapper')}>
            <header>
                <Header/>
            </header>

            <div className={cx('wrapper-content')}>
                {children}
            </div>
        </div>
    )
}

export default DefaultLayout
