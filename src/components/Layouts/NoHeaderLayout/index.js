import classnames from 'classnames/bind';

import Button from '../../Button';
import style from './noHeaderLayout.module.scss';

const cx = classnames.bind(style);

function noHeaderLayout({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default noHeaderLayout;
