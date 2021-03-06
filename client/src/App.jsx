import jwtDecode from 'jwt-decode'
import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { logoutUser, setCurrentUser } from './actions/authActions'
import { clearCurrentProfile } from './actions/profileActions'
import './App.css'
import AddEducation from './components/add-credentials/AddEducation'
import AddExperience from './components/add-credentials/AddExperience'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import PrivateRoute from './components/common/PrivateRoute'
import CreateProfile from './components/create-profile/CreateProfile'
import Dashboard from './components/dashboard/Dashboard'
import EditProfile from './components/edit-profile/EditProfile'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Navbar from './components/layout/Navbar'
import NotFound from './components/NotFound'
import Posts from './components/posts/Posts'
import Profile from './components/profile/Profile'
import Profiles from './components/profiles/Profiles'
import store from './store'
import setAuthHeader from './utils/setAuthHeader'
import Post from './components/post/Post'

if (window.localStorage.jwtToken) {
  const { jwtToken } = window.localStorage
  // Set Authorization Header
  setAuthHeader(jwtToken)
  // Set current user
  const decodedToken = jwtDecode(jwtToken)
  // Dispatch set_current_user action
  store.dispatch(setCurrentUser(decodedToken))

  // If session is up, logout user
  const currentTime = Date.now() / 1000
  if (decodedToken.exp < currentTime) {
    store.dispatch(clearCurrentProfile())
    store.dispatch(logoutUser())

    /** TODO:
     * > Remove user profile
     * > Redirect user to '/login
     */
    window.location.href = '/login'
  }
}
class App extends Component {
  render () {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar />
            <Route exact path='/' component={Landing} />
            <div className='container'>
              <Route exact path='/register' component={Register} />
              <Route exact path='/login' component={Login} />
              <Switch>
                <PrivateRoute exact path='/dashboard' component={Dashboard} />
                <PrivateRoute
                  exact
                  path='/create-profile'
                  component={CreateProfile}
                />
                <PrivateRoute
                  exact
                  path='/edit-profile'
                  component={EditProfile}
                />
                <PrivateRoute
                  exact
                  path='/add-experience'
                  component={AddExperience}
                />
                <PrivateRoute
                  exact
                  path='/add-education'
                  component={AddEducation}
                />
                <PrivateRoute exact path='/feed' component={Posts} />
                <PrivateRoute exact path='/post/:id' component={Post} />
              </Switch>
              <Route exact path='/developers' component={Profiles} />
              <Route exact path='/profile/:handle' component={Profile} />
              <Route exact path='/not-found' component={NotFound} />
            </div>
            <Footer />
          </div>
        </Router>
      </Provider>
    )
  }
}

export default App
