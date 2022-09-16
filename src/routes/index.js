import {Protected, Account, Home, Login} from '../components'
import {DefaultLayout, NoHeaderLayout} from '../components/Layouts'

const publishRoutes = [
    {path:'/account', Component: Account, CoverComponent: Protected},
    {path:'/', Component: Home},
    {path:'/login', Component: Login, Layout: NoHeaderLayout},
] 

export {publishRoutes}
