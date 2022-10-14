import classnames from "classnames/bind"
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import style from './Button.module.scss'

const cx = classnames.bind(style)

function Button({children, to, href, onClick, state, rightIcon, leftIcon, ...passProps}) {
    let Component = 'button'

    const props = {
        onClick,
        ...passProps,
    }

    if(to) {
        Component = Link
        props.to = to
    }else if(href) {
        Component = 'a'
        props.href = href
    }

    return(
        <Component className={cx('button')} {...props} to={to} state={state}>
            {leftIcon && <FontAwesomeIcon icon={leftIcon}/>}
            {children}
            {rightIcon && <FontAwesomeIcon icon={rightIcon}/>}
        </Component>
    )
}

export default Button
