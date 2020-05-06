import React from 'react'
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const PrivateRoute = (props) => {
  // {exact: true, path: "/dashboard", component: {…}, auth: {…}, dispatch: ƒ}
  const { component: Component, auth, ...rest } =  props 
  return (
  <Route
    {...rest} // render是路由组件自带的一种渲染组件方式，这里的props指的是路由Route的location等属性
    render={props => auth.isAuthenticated === true ? <Component {...props} /> : <Redirect to='/login' />}
  />
)}

PrivateRoute.prototype = {
  auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})

export default connect(mapStateToProps)(PrivateRoute)
