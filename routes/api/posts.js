const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

const validatePostInput = require('../../validation/post');


/**
 * @route POST api/posts
 * @desc  创建留言接口地址
 * @access 接口是私有的
 */
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {
  const { errors, isValid } = validatePostInput(ctx.request.body);

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  const newPost = new Post({
    text: ctx.request.body.text,
    name: ctx.request.body.name,
    avatar: ctx.request.body.avatar,
    user: ctx.state.user.id
  });

  await newPost
    .save()
    .then(post => (ctx.body = post))
    .catch(err => (ctx.body = err));

  ctx.body = newPost;
}
);


/**
 * @route POST api/posts/all
 * @desc  所有留言接口地址
 * @access 接口是公开的
 */
router.get('/all', async ctx => {
  await Post.find()
    .sort({ date: -1 })//按时间逆序
    .then(posts => {
      ctx.status = 200;
      ctx.body = posts;
    })
    .catch(() => {
      ctx.status = 404;
      ctx.body = { nopostsfound: '找不到任何留言信息' };
    });
});


/**
 * @route POST api/posts?id=asdfasdf
 * @desc  单个留言接口地址
 * @access 接口是公开的
 */
router.get('/', async ctx => {
  const id = ctx.query.id;
  await Post.findById(id)
    .then(post => {
      ctx.status = 200;
      ctx.body = post;
    })
    .catch(() => {
      ctx.status = 404;
      ctx.body = { nopostfound: '没有留言信息' };
    });
});


/**
 * @route DELETE api/posts?id=adsfasdfasf
 * @desc  删除单个留言接口地址
 * @access 接口是私有的
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async ctx => {
  const id = ctx.query.id;
  // 当前用户是否拥有个人信息
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile.length > 0) {
    // 查找此人的留言
    const post = await Post.findById(id);

    // 判断是不是当前用户操作，toString()方法并非必要，不干扰逻辑执行
    if (post.user.toString() !== ctx.state.user.id) {
      ctx.status = 401;
      ctx.body = { notauthorized: '用户非法操作' };
      return;
    }

    // 这里是直接删除表格，用remove更加方便
    await Post.deleteOne({ _id: id }).then(() => {
      ctx.status = 200;
      ctx.body = { success: true };
    });
  } else {
    ctx.status = 404;
    ctx.body = { error: '个人信息不存在' };
  }
}
);


/**
 * @route POST api/posts/like?id=afdsfadfasf
 * @desc  点赞接口地址
 * @access 接口是私有的
 */
router.post('/like', passport.authenticate('jwt', { session: false }), async ctx => {
  const id = ctx.query.id; // 当前被点赞用户id
  // 当前登录用户信息
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile.length > 0) {
    const post = await Post.findById(id); // 当前被点赞用户的留言内容
    const isLike = post.likes.filter(like => like.user.toString() === ctx.state.user.id);
    if (isLike.length > 0) {// 判断当前被点赞用户是否和登录用户一致
      ctx.status = 400;
      ctx.body = { alreadyliked: '该用户已赞过' };
      return;
    }
    post.likes.unshift({ user: ctx.state.user.id }); // 将点赞的user插入
    const postUpdate = await Post.findOneAndUpdate(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'profile 不存在' };
  }
}
);


/**
 * @route POST api/posts/cancel_like?id=afdsfadfasf
 * @desc  取消点赞接口地址
 * @access 接口是私有的
 */
router.post('/cancel_like', passport.authenticate('jwt', { session: false }), async ctx => {
  const id = ctx.query.id; // 当前被取消赞用户id
  // 当前登录用户信息
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile.length > 0) {
    const post = await Post.findById(id);
    // 定位like是依靠当前登录用户的id，而不是要删除的post的id，一个post有许多的用户点赞，只能删除自己赞的
    const removeIndex = post.likes.map(item => item.user.toString()).indexOf(ctx.state.user.id);
    if (removeIndex != -1) {
      post.likes.splice(removeIndex, 1);
    } else {
      ctx.status = 400;
      ctx.body = { alreadyliked: '该用户没有点赞过' };
      return;
    }

    const postUpdate = await Post.findOneAndUpdate(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  } else {
    ctx.status = 404;
    ctx.body = { error: 'profile 不存在' };
  }
}
);


/**
 * @route POST api/posts/comment?id=afdsfadfasf
 * @desc  评论接口地址
 * @access 接口是私有的
 */
router.post( '/comment', passport.authenticate('jwt', { session: false }), async ctx => {
    const id = ctx.query.id;
    const post = await Post.findById(id);
    const newComment = {
      text: ctx.request.body.text,
      name: ctx.request.body.name,
      avatar: ctx.request.body.avatar,
      user: ctx.state.user.id
    };

    post.comments.unshift(newComment);
    const postUpdate = await Post.findOneAndUpdate(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  }
);


/**
 * @route DELETE api/posts/comment?id=afdsfadfasf&comment_id=dsfasdfasfd
 * @desc  删除评论接口地址
 * @access 接口是私有的
 */
router.delete( '/comment', passport.authenticate('jwt', { session: false }), async ctx => {
    const id = ctx.query.id; // 删除哪个post
    const comment_id = ctx.query.comment_id; // 删除哪一条评论

    const post = await Post.findById(id);
    const isComment =
      post.comments.filter(comment => comment._id.toString() === comment_id)
        .length == 0;
    if (isComment) {
      ctx.status = 400;
      ctx.body = { commentnotexists: '该评论不存在' };
      return;
    }

    // 找到该评论信息
    const removeIndex = post.comments
      .map(item => item._id.toString())
      .indexOf(comment_id);
    // 删除
    post.comments.splice(removeIndex, 1);
    const postUpdate = await Post.findByIdAndUpdate(
      { _id: id },
      { $set: post },
      { new: true }
    );
    ctx.body = postUpdate;
  }
);


module.exports = router.routes();