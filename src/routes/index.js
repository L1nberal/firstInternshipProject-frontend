import axios from 'axios'
import React, {useState, useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'

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
    OwnedApps,
    DevelopedApps,
    Categories,
    OrganisationUpdate,
    AppUpdate,
} from '../components'
import {DefaultLayout, NoHeaderLayout} from '../components/Layouts'

function TotalRoutes() {
    const [organisations, setOrganisations] = useState([])
    const [users, setUsers] = useState([])
    const [comments, setComments] = useState([])
    const [categories, setCategories] = useState([])
    const [apps, setApps] = useState([])
    let newOrganisations = []
    let newComments = []
    let newCategories = []
    let newApps = []

    // =================get infor from API========================
    useEffect(() => {
        // =============get organisations from strapi API=============
        fetch('http://localhost:1337/api/apps?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(app => {
                    setApps(() => {
                        newApps = [...newApps, app]
                        return newApps
                    })
                })

            }) 
    
        // =============get apps from strapi API=============
        fetch('http://localhost:1337/api/organisations?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(organisation => {
                    setOrganisations(() => {
                        newOrganisations = [...newOrganisations, organisation]
                        return newOrganisations
                    })
                })

            }) 
        // =============get categories from strapi API=============
        fetch('http://localhost:1337/api/categories?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(category => {
                    setCategories(() => {
                        newCategories = [...newCategories, category]
                        return newCategories
                    })
                })
            })
        // =============get comments from strapi API=============
        fetch('http://localhost:1337/api/comments?populate=*')
            .then(response => response.json())
            .then(data => {
                Object.values(data)[0].map(comment => {
                    setComments(() => {
                        newComments = [...newComments, comment]
                        return newComments
                    })
                })
            })
        // =============get users from strapi API=============
        axios.get('http://localhost:1337/api/users?populate=*', {
            headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_FULL_ACCESS_TOKEN}` 
            }
        })
            .then(respond => setUsers(respond.data))
            .catch(error => console.log(error))
    }, []) 
    // routes that show pages
    const PagesRoutes = [
        {path:'/account', Component: Account},
        {path:'/', Component: Home},
        {path:'/log-in', Component: Login, Layout: NoHeaderLayout},
        {path:'/sign-up', Component: Signup, Layout: NoHeaderLayout},
        {path:'/add-organisations', Component: AddOrganisations, data: organisations, apps: apps},
        {path:'/add-categories', Component: AddCategories, data: categories},
        {path:'/add-apps', Component: AddApps, data: apps, categories: categories, organisations: organisations, users: users},
    ] 
    // routes that show individual app
    const AppDetailsRoutes = apps.map((app) => {
        return {path: `/app-details-${app.id}`, Component: AppDetails, appId: app.id, app: app, comments: comments, users: users}
    })
    // routes that show individual organisation
    const OrganisationDetailsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}`, Component: OrganisationDetails, organisationId: organisation.id}
    })
    // routes that show owned apps
    const OwnedAppsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}-owned-apps`, Component: OwnedApps, organisationId: organisation.id, organisation: organisation}
    })
    // routes that show owned organisations
    const DevelopedAppsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}-developed-apps`, Component: DevelopedApps, organisationId: organisation.id, organisation: organisation}
    })
    // routes that show apps in categories
    const CategoriesRoutes = categories.map((category) => {
        return {path: `/category-${category.id}`, Component: Categories, categoryId: category.id, category: category}
    })
    // routes that update individual organisation
    const organisationUpdateRoutes = organisations.map((organisation) => {
        return {path: `/organisation-update-${organisation.id}`, Component: OrganisationUpdate, organisationId: organisation.id, organisation: organisation, organisations: organisations, apps: apps}
    })
    // routes that update individual organisation
    const appUpdateRoutes = apps.map((app) => {
        return {path: `/app-update-${app.id}`, Component: AppUpdate, appId: app.id, app: app, apps: apps, organisations: organisations, users: users, categories: categories}
    })

    return(
        <Routes>
            {/* ==============routes that show pages================= */}
            {PagesRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    data={route.data}
                                    apps={route.apps}
                                    categories={route.categories}
                                    organisations={route.organisations}
                                    users={route.users}
                                />
                            </Layout>
                    }
                    />

                )
            })}

            {/* ==============routes that show individual app================= */}
            {AppDetailsRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    apps={apps} 
                                    appId={route.appId}
                                    comments={route.comments}
                                    users={route.users}
                                    app={route.app}
                                />
                            </Layout>
                        }
                    />

                )
            })}

            {/* ==============routes that show owned apps================= */}
            {OwnedAppsRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    apps={apps} 
                                    organisations={organisations} 
                                    organisationId={route.organisationId}
                                    organisation={route.organisation}
                                />
                            </Layout>
                        }
                    />
                )
            })}

            {/* ==============routes that show developed apps================= */}
            {DevelopedAppsRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    apps={apps} 
                                    organisations={organisations} 
                                    organisationId={route.organisationId}
                                    organisation={route.organisation}
                                />
                            </Layout>
                        }
                    />
                )
            })}

            {/* ==============routes that show individual organisation================= */}
            {OrganisationDetailsRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    apps={apps} 
                                    organisations={organisations} 
                                    organisationId={route.organisationId}
                                />
                            </Layout>
                        }
                    />
                )
            })}

             {/* ==============routes that show developed apps================= */}
             {CategoriesRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    apps={apps} 
                                    categories={categories} 
                                    categoryId={route.categoryId}
                                    category={route.category}
                                />
                            </Layout>
                        }
                    />
                )
            })}

            {/* ==============routes that show organisation update routes================= */}
            {organisationUpdateRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    organisationId= {route.organisationId}
                                    organisations= {route.organisations}
                                    apps= {route.apps}
                                    organisation= {route.organisation}
                                />
                            </Layout>
                        }
                    />

                )
            })}

            {/* ==============routes that show app update routes================= */}
            {appUpdateRoutes.map((route, index) => {
                const Component = route.Component
                let Layout = DefaultLayout

                if(route.Layout) {
                    Layout = route.Layout
                }

                return(
                    <Route 
                        key={index} 
                        path={route.path} 
                        element={
                            <Layout>
                                <Component 
                                    appId= {route.appId}
                                    organisations= {route.organisations}
                                    apps= {route.apps}
                                    app= {route.app}
                                    users= {route.users}
                                    categories= {route.categories}
                                />
                            </Layout>
                        }
                    />

                )
            })}
        </Routes>
    )
}


export default TotalRoutes
