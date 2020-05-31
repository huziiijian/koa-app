import React, { Component } from 'react'
import { Link,withRouter } from 'react-router-dom'
import { connect } from 'react-redux';
import { logoutUser } from '../../actions/authActions';
import { clearCurrentProfile } from '../../actions/profileActions';
import { PropTypes } from 'prop-types';

class Navbar extends Component {

  onLogoutClick(e) {
    e.preventDefault();
    this.props.clearCurrentProfile();
    this.props.logoutUser();
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps) // 如果要更新组件状态需要在这调用setState
  }
// profile除了第一次不在componentWillReceiveProps里打印外，render中和componentWillReceiveProps中状态是同步变更的
  render() {
    const { isAuthenticated, user } = this.props.auth;
    const pathname = this.props.location.pathname; 
    const authLinks = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/feed">
            评论
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/dashboard">
            Dashboard
          </Link>
        </li>
        <li className="nav-item">
          <a href="" className="nav-link" onClick={this.onLogoutClick.bind(this)}>
            <img style={{ width: '25px', marginRight: '5px' }} className="rounded-circle" src={user.avatar} alt={user.name} /> 退出
          </a>
        </li>
      </ul>
    )
    const guestLink = (
      <ul className="navbar-nav ml-auto">
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            注册
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/login">
            登录
          </Link>
        </li>
      </ul>
    )

    return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
          <div className="container navbar-nav">
            <Link className={pathname === "/dashboard" ? "navbar-brand":"nav-link"} to="/"> 控制面板
            </Link>
            {/* <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
              <span className="navbar-toggler-icon"></span>
            </button> */}

            <div className="collapse navbar-collapse" id="mobile-nav">
              {/* <ul className="navbar-nav mr-auto"> */}
                {/* <li className="nav-item"> */}
                  <Link className={pathname === "/profiles" ? "navbar-brand":"nav-link"} to="/profiles"> 开发者
                  </Link>
                {/* </li> */}
              {/* </ul>              */}
              {isAuthenticated ? authLinks : guestLink}
            </div>
          </div>
        </nav>
      </div>
    )
  }
}

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { logoutUser, clearCurrentProfile })(withRouter(Navbar));

