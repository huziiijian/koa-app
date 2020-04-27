import React, { Component } from 'react';
import TextFieldGroup from '../../common/TextFieldGroup'

class Login extends Component {
  state = {
      email: '',
      password: '',
      errors: {}
    };

    componentDidMount() {
      console.log(this.props.history)
      console.log(this.props.location)
    }

    onSubmit = (e) =>  {
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

  render() {
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


export default Login;
