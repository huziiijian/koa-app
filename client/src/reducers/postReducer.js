import { ADD_POST, GET_POSTS, GET_POST, DELETE_POST, POST_LOADDING } from '../actions/types';

const initialState = {
  posts: [],
  post: {},
  loading: false
};

export default function (state = initialState, action) {
  switch (action.type) {
    case POST_LOADDING:
      return {
        ...state,
        loading: true
      }
    case GET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false // 注意控制加载动画的开关
      }
    case GET_POST:
      return {
        ...state,
        post: action.payload,
        loading: false
      }
    case ADD_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts] // 结合之前的post数据返回给组件进行渲染
      }
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post._id !== action.payload)
      }
    default:
      return state;
  }
}