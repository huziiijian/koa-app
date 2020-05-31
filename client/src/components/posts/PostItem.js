import React, { Component } from 'react'
import classnames from 'classnames';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { Link } from 'react-router-dom';
import { deletePost, addLike, removeLike } from '../../actions/postActions';

class PostItem extends Component {

  onDeleteClick(id) {
    this.props.deletePost(id);
  }

  onLikeClick(post) {
    const { auth } = this.props; 
    // 判断当前用户是否赞过
    if (post.likes.filter(like => like.user === auth.user.id).length > 0) {
      this.props.removeLike(post._id);
    } else {
      this.props.addLike(post._id);
    }
  }

  findUserLike(likes) {
    const { auth } = this.props;
    if (likes.filter(like => like.user === auth.user.id).length > 0) {
      return true;
    } else {
      return false;
    }
  }
  
  componentWillReceiveProps(newProps) {
    this.findUserLike(newProps.post.likes)
  }

  render() {
    const { post, auth, showActions } = this.props;
    return (
      <div className="card card-body mb-3">
        <div className="row">
          <div className="col-md-2">
            <a href="profile.html">
              <img className="rounded-circle d-nonse d-md-block" src={post.avatar}
                alt="" />
            </a>
            <br />
            <p className="text-center">{post.name}</p>
          </div>
          <div className="col-md-10">
            <p className="lead">{post.text}</p>
            {
              showActions ? (
                <span>
                {/* 注意这里如果不用bind，配合action里的reload会导致组件不停地刷新 */}
                  <button onClick={() => this.onLikeClick(post)} type="button" className="btn btn-light mr-1">
                    <i className={classnames("fas fa-thumbs-up", {
                      // 这里对样式的修改不起作用，必须刷新后起效
                      // 'text-info': this.findUserLike(post.likes)
                    })} ></i>
                    <span className="badge badge-light">{post.likes.length}</span>
                  </button>
                  <Link to={`/post/${post._id}`} className="btn btn-info mr-1">
                    鼓励留言
                  </Link>
                  {
                    post.user === auth.user.id ? ( // 如果是自己点赞的就可以删除
                      <button
                        onClick={this.onDeleteClick.bind(this, post._id)}
                        type="button"
                        className="btn btn-danger mr-1">
                        删除
                      </button>
                    ) : null
                  }
                </span>
              ) : null
            }
          </div>
        </div>
      </div>
    )
  }
}

PostItem.defaultProps = {
  showActions: true
}

PostItem.propTypes = {
  addLike: PropTypes.func.isRequired,
  removeLike: PropTypes.func.isRequired,
  deletePost: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  auth: state.auth
})
export default connect(mapStateToProps, { deletePost, addLike, removeLike })(PostItem);