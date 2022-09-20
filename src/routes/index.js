import {Account, Home, Login, Signup} from '../components'
import {DefaultLayout, NoHeaderLayout} from '../components/Layouts'

const publishRoutes = [
    {path:'/account', Component: Account},
    {path:'/', Component: Home},
    {path:'/log-in', Component: Login, Layout: NoHeaderLayout},
    {path:'/sign-up', Component: Signup, Layout: NoHeaderLayout},
] 

export {publishRoutes}
