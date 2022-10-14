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
} from '../components'
import {DefaultLayout, NoHeaderLayout} from '../components/Layouts'

function TotalRoutes() {
    const [organisations, setOrganisations] = useState([])
    const [categories, setCategories] = useState([])
    const [apps, setApps] = useState([])
    let newOrganisations = []
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
    }, []) 
    // routes that show pages
    const PagesRoutes = [
        {path:'/account', Component: Account},
        {path:'/', Component: Home},
        {path:'/log-in', Component: Login, Layout: NoHeaderLayout},
        {path:'/sign-up', Component: Signup, Layout: NoHeaderLayout},
        {path:'/add-organisations', Component: AddOrganisations},
        {path:'/add-categories', Component: AddCategories},
        {path:'/add-apps', Component: AddApps},
    ] 
    // routes that show individual app
    const AppDetailsRoutes = apps.map((app) => {
        return {path: `/app-details-${app.id}`, Component: AppDetails, appId: app.id, data:{data: app}}
    })
    // routes that show individual app
    const OrganisationDetailsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}`, Component: OrganisationDetails, organisationId: organisation.id}
    })
    // routes that show owned apps
    const OwnedAppsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}-owned-apps`, Component: OwnedApps, organisationId: organisation.id, organisation: organisation}
    })
    // routes that show owned apps
    const DevelopedAppsRoutes = organisations.map((organisation) => {
        return {path: `/organisation-details-${organisation.id}-developed-apps`, Component: DevelopedApps, organisationId: organisation.id, organisation: organisation}
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
                                <Component/>
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
        </Routes>
    )
}


export default TotalRoutes
