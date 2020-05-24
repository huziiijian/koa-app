import axios from 'axios';
import { GET_PROFILES, GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS, SET_CURRENT_USER } from './types';


export const getCurrentProfile = () => dispatch => {
  // 加载动画
  dispatch(setProfileLoading());
  // 请求数据
  axios("/api/profile")
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: {}
      })
    )
}
// 根据handle获取个人信息
export const getProfileByHandle = handle => dispatch => {
  // 加载动画
  dispatch(setProfileLoading());
  // 请求数据
  axios(`/api/profile/handle/${handle}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILE,
        payload: null
      })
    )
}

// 创建个人信息post数据
export const createProfile = (profileData, history) => dispatch => {
  axios.post("/api/profile", profileData)
    .then(() => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 删除账户
export const deleteAccout = () => dispatch => {
  axios.delete("/api/profile")
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER,
        payload: {}
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 添加个人经历
export const addExperience = (expData, history) => dispatch => {
  axios.post("/api/profile/experience", expData)
    .then(() => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 添加教育经历
export const addEducation = (expData, history) => dispatch => {
  axios.post("/api/profile/education", expData)
    .then(() => history.push("/dashboard"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 删除个人履历
export const deleteExperience = id => dispatch => {
  axios.delete(`/api/profile/experience/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 删除教育经历
export const deleteEducation = id => dispatch => {
  axios.delete(`/api/profile/education/${id}`)
    .then(res =>
      dispatch({
        type: GET_PROFILE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
}

// 获取所有人员信息
export const getProfiles = () => dispatch => {
  // 加载动画
  dispatch(setProfileLoading());
  // 请求所有人信息
  axios.get('/api/profile/all')
    .then(res =>
      dispatch({
        type: GET_PROFILES,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_PROFILES,
        payload: null
      })
    )
}

export const setProfileLoading = () => {
  return {
    type: PROFILE_LOADING
  };
}

export const clearCurrentProfile = () => dispatch => {
  // return和dispatch两种写法都行。。。不对，还是只能dispatch，return不起作用
  // http://echizen.github.io/tech/2016/07-23-dispatch
  // return { 
  //   type: CLEAR_CURRENT_PROFILE
  // }
  dispatch({ // 派发成功，state的改变需要用componentWillReceiveProps去监听
    type: CLEAR_CURRENT_PROFILE
  })
}