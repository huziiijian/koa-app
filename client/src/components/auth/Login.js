import React, { Component } from 'react';
import TextFieldGroup from '../../common/TextFieldGroup'
import { PropTypes } from 'prop-types';

import { connect } from 'react-redux'
import { loginUser } from '../../actions/authActions';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {}
  };

  // 代替componentWillReceiveProps的写法
  // static getDerivedStateFromProps(nextProps) {
  //   if (nextProps.errors) {
  //     return {
  //       errors: nextProps.errors
  //     }
  //   }
  // }
  
  componentDidMount() { // 在这做路由守卫
    if (this.props.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }
  }

  // 因为要访问this.props，所以还是采用componentWillReceiveProps的写法
  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      this.props.history.push("/dashboard");
    }

    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }
  }


  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      email: this.state.email,
      password: this.state.password
    };
    // console.log(newUser);
    this.props.loginUser(newUser);
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render = () => {
    const { errors } = this.state;
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">登录</h1>
              <p className="lead text-center">使用已有的账户登录</p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  type="email"
                  placeholder="邮箱地址"
                  name="email"
                  value={this.state.email}
                  onChange={this.onChange}
                  error={errors.email}
                />
                <TextFieldGroup
                  type="password"
                  placeholder="密码"
                  name="password"
                  value={this.state.password}
                  onChange={this.onChange}
                  error={errors.password}
                />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

// 将状态映射为属性
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors
})



export default connect(mapStateToProps, { loginUser })(Login);
