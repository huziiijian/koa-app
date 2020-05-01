import axios from 'axios';
import jwt_decode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// 如果mapDispatchToProps是一个函数，会得到dispatch和ownProps（容器组件的props对象）两个参数
export const registerUser = (userData, history) => (dispatch,ownProps) => {
  // 请求
  axios.post("/api/users/register", userData)
    .then((res) => {
      console.log(res)
      history.push("/login")
  }).catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 登录
export const loginUser = userData => dispatch => {
  axios.post("/api/users/login", userData)
    .then(res => {
      const { token } = res.data;
      // 存储token到localStorage
      localStorage.setItem("jwtToken", token);
      // 设置axios的headers token
      setAuthToken(token);

      // 解析token为原来生成token的原始数据
      const decoded = jwt_decode(token);
      console.log(decoded);
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

export const setCurrentUser = decoded => {
  return {// 将同种名称(type)不同信息(payload)的action封装成一个函数，简化代码
    type: SET_CURRENT_USER,
    payload: decoded
  }
}

// logout
export const logoutUser = () => dispatch => {
  // 删除ls
  localStorage.removeItem("jwtToken");
  // 干掉请求头
  setAuthToken(false);
  // 链接reducer
  dispatch(setCurrentUser({}));
}