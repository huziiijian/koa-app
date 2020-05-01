import React, { Component } from 'react';
import TextFieldGroup from '../../common/TextFieldGroup';
import { PropTypes } from 'prop-types';
// import { withRouter } from 'react-router-dom';
// 非路由组件才需要这样，路由组件的this.props中能够获取路由信息

// redux
import { connect } from 'react-redux';
import { registerUser } from '../../actions/authActions';


class Register extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    password2: '',
    errors: {}
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  onSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password2: this.state.password2
    };
    // axios.post("/api/users/register",newUser).then(res => {
    //   console.log(res)
    // }).catch(err => {
    //   this.setState({errors:err.response.data})
    // })

    // 调用action  this.props.history提供跳转功能
    this.props.registerUser(newUser, this.props.history);
  }

  // componentWillReceiveProps在初始化render的时候不会执行，它会在Component接受到新的状态(Props)时被触发
  // 在这个生命周期中，可以在子组件的render函数执行前获取新的props，从而更新子组件自己的state
  // 通过调用this.setState()来更新你的组件状态，旧的属性还是可以通过this.props来获取,
  // 这里调用更新状态是安全的，并不会触发额外的render调用
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }
  }

  render() {
    const { errors } = this.state;
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">注册</h1>
              <p className="lead text-center">创建新的账户</p>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup placeholder="用户名" name="name" value={this.state.name} onChange={this.onChange}
                  error={errors.name} />
                <TextFieldGroup type="email" placeholder="邮箱地址" name="email" value={this.state.email} onChange={this.onChange} error={errors.email}
                  info="我们使用了gravatar全球公认头像, 如果需要有头像显示, 请使用在gravatar注册的邮箱" />
                <TextFieldGroup type="password" placeholder="密码" name="password" value={this.state.password} onChange={this.onChange}
                  error={errors.password} />
                <TextFieldGroup type="password" placeholder="确认密码" name="password2" value={this.state.password2} onChange={this.onChange}
                  error={errors.password2} />
                <input type="submit" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

Register.propTypes = {
  registerUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

// mapStateToProps是一个函数，它接受state作为参数，返回一个对象。这个对象的属性代表 UI 组件的同名参数
// 后面的state.***也是一个函数，可以从state算出返回值,一般就是对应的reducer的返回对象
const mapStateToProps = (state) => ({
  auth: state.auth,
  errors: state.errors//注意这里是通过reducer返回的state.errors
})

// 如果mapDispatchToProps是一个对象，它的每个键名也是对应 UI 组件的同名参数，键值应该是一个函数
// 会被当作 Action creator ，返回的 Action 会由 Redux 自动发出
export default connect(mapStateToProps, { registerUser })(Register);
