import { ADD_POST, GET_POSTS, GET_POST, DELETE_POST, POST_LOADDING, CHANGE_LIKE } from '../actions/types';

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
    case CHANGE_LIKE:
      return {
        ...state,
        posts: state.posts.map(post => // 这样可以不修改state.posts的属性，而是直接返回新对象
          post._id == action.payload._id ? { ...post, likes:action.payload.likes} : post )
      }
    default:
      return state;
  }
}