import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import jwt_decode from 'jwt-decode';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import setAuthToken from './utils/setAuthToken';
import Dashboard from './components/dashboard/Dashboard'

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
      <Router>
        <div className="App">
          <h1>ces冯绍fdv峰dc </h1>
          <Navbar />
          {/* 注意Switch引用时一定要刚好只包裹路由组件，否则会无法显示路由 */}
          <Switch>
            <Route exact path="/" component={Landing} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/dashboard" component={Dashboard} />
          </Switch>
          <Footer />
        </div>
      </Router>
    </Provider>
  );
}

export default App; 
