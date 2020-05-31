import axios from 'axios';
import { ADD_POST, GET_POSTS, GET_POST, DELETE_POST, POST_LOADDING, GET_ERRORS, CHANGE_LIKE } from './types';

// 添加评论
export const addPost = postData => dispatch => {
  axios.post("/api/posts", postData)
    .then(res =>
      dispatch({
        type: ADD_POST,
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

// 获取评论
export const getPosts = () => dispatch => {
  dispatch(setPostLoading);
  axios.get("/api/posts/all")
    .then(res => {
      dispatch({
        type: GET_POSTS,
        payload: res.data
      })
    }
    )
    .catch(() =>
      dispatch({
        type: GET_POSTS,
        payload: null
      })
    )
}

// 获取单条评论  api/posts?id=asdfasdf
export const getPost = id => dispatch => {
  dispatch(setPostLoading);
  axios.get(`/api/posts?id=${id}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(() =>
      dispatch({
        type: GET_POST,
        payload: null
      })
    )
}

// 删除一条评论  api/posts?id=adsfasdfasf
export const deletePost = id => dispatch => {
  axios.delete(`/api/posts?id=${id}`)
    .then(() =>
      dispatch({
        type: DELETE_POST,
        payload: id
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// 点赞  api/posts/like?id=afdsfadfasf
export const addLike = id => dispatch => {
  axios.post(`/api/posts/like?id=${id}`)
    .then(res => {
      dispatch({
        type: CHANGE_LIKE,
        payload: res.data
      })
    }
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// 取消点赞  api/posts/cancel_like?id=afdsfadfasf
export const removeLike = id => dispatch => {
  axios.post(`/api/posts/cancel_like?id=${id}`)
    .then(res =>
      dispatch({
        type: CHANGE_LIKE,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// 添加留言  api/posts/comment?id=afdsfadfasf
export const addComment = (postId, commentData) => dispatch => {
  axios.post(`/api/posts/comment?id=${postId}`, commentData)
    .then(res =>
      dispatch({
        type: GET_POST,
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

// 删除留言  api/posts/comment?id=afdsfadfasf&comment_id=dsfasdfasfd
// 谁(id)给谁(comment_id)留的言
export const deleteComment = (postId, commentId) => dispatch => {
  axios.delete(`/api/posts/comment?id=${postId}&comment_id=${commentId}`)
    .then(res =>
      dispatch({
        type: GET_POST,
        payload: res.data
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    )
};

// 加载动画
export const setPostLoading = () => {
  return {
    type: POST_LOADDING
  }
}