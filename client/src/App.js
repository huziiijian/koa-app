import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import './App.css';
import jwt_decode from 'jwt-decode';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard';
import CreateProfile from './components/create-profile/CreateProfile';
import EditProfile from './components/edit-profile/EditProfile'
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from './components/add-credentials/AddEducation';
import PrivateRoute from './common/PrivateRoute';

// redux
import store from './store'
import { Provider } from 'react-redux';
import { setCurrentUser, logoutUser } from './actions/authActions';

// 防止刷新导致的redux丢失
if (localStorage.jwtToken) {
  setAuthToken(localStorage.jwtToken);
  const decoded = jwt_decode(localStorage.jwtToken);
  // 派发到reducer里
  store.dispatch(setCurrentUser(decoded));
  // 检测token是否过期

  // 获取当前时间
  const currentTime = Date.now() / 1000;
  // 判断当前是否大于token过期时间
  if (decoded.exp < currentTime) {
    // 过期
    store.dispatch(logoutUser());
    // 页面跳转
    window.location.href = "/login";
  }
}

function App() {
  return (
    <Provider store={store}>
    {/* 通过context原理让子组件直接拿到state */}
      <Router>
        <div className="App">
          <h1>ces冯绍fdv峰dc </h1>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <div className="contaier">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
                <PrivateRoute exact path="/create-profile" component={CreateProfile} />
                <PrivateRoute exact path="/edit-profile" component={EditProfile} />
                <PrivateRoute exact path="/add-experience" component={AddExperience} />
                <PrivateRoute exact path="/add-education" component={AddEducation} />
          </div>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App; 
