import classnames from "classnames/bind"
import { Link } from 'react-router-dom'

import style from './Button.module.scss'

const cx = classnames.bind(style)

function Button({children, to, href, onClick, ...passProps}) {
    let Component = 'button'

    const props = {
        onClick,
        ...passProps
    }

    if(to) {
        Component = Link
        props.to = to
    }else if(href) {
        Component = 'a'
        props.href = href
    }

    return(
        <Component className={cx('button')} {...props}>{children}</Component>
    )
}

export default Button
