import {
    Account, 
    Home, 
    Login, 
    Signup,
    AppDetails, 
    OrganisationDetails,
    AddOrganisations,
    AddCategories,
    AddApps,
} from '../components'
import {DefaultLayout, NoHeaderLayout} from '../components/Layouts'


const publishRoutes = [
    {path:'/account', Component: Account},
    {path:'/', Component: Home},
    {path:'/log-in', Component: Login, Layout: NoHeaderLayout},
    {path:'/sign-up', Component: Signup, Layout: NoHeaderLayout},
    {path:'/app-details', Component: AppDetails},
    {path:'/organisation-details', Component: OrganisationDetails},
    {path:'/add-organisations', Component: AddOrganisations},
    {path:'/add-categories', Component: AddCategories},
    {path:'/add-apps', Component: AddApps},
] 

export {publishRoutes}
