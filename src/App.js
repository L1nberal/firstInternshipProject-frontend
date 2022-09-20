import './App.css';
import { Routes, Route } from 'react-router-dom'

import {publishRoutes} from './routes'
import {DefaultLayout} from './components/Layouts';

function App() {
  return(
      <Routes>
        {publishRoutes.map((route, index) => {
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
      </Routes>
      

  )
}

export default App;
