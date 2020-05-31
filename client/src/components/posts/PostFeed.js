import React, { Component } from 'react'
import PostItem from './PostItem';
import { PropTypes } from 'prop-types';
class PostFeed extends Component {
  render() {
    // const { posts, _post } = this.props;
    // return posts.map(post => {
    // if(post._id === _post._id){
    //   post = { ...post, likes:_post.likes};// 数据处理可以在reducer或者组件内
    // } 
    const { posts } = this.props;
    return posts.map(post => <PostItem key={post._id} post={post} />)
  }
}

PostFeed.propTypes = {
  posts: PropTypes.array.isRequired
}

export default PostFeed;