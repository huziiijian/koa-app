const Router = require('koa-router');
const router = new Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('koa-passport');

const User = require('../../models/User');
const keys = require('../../config/keys');
const tools = require('../../config/tools');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');


/**
 * @route POST api/users/register
 * @desc  注册接口地址
 * @access 接口是公开的
 */
router.post('/register', async ctx => {
  const { errors, isValid } = validateRegisterInput(ctx.request.body);
  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  // 存储到数据库
  // ctx.request.body相当于req，ctx.body`相当于res
  const findResult = await User.find({ email: ctx.request.body.email });
  if (findResult.length > 0) {
    ctx.status = 500;
    ctx.body = { email: '邮箱已被占用' };
  } else {
    const avatar = gravatar.url(ctx.request.body.email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });
    // User模板通过参数生成一个User对象
    const newUser = new User({
      name: ctx.request.body.name,
      email: ctx.request.body.email,
      avatar,
      // password: ctx.request.body.password
      password: tools.enbcrypt(ctx.request.body.password)//抽离封装
    });

    // 同步
    // const salt = bcrypt.genSaltSync(10);
    // const hash = bcrypt.hashSync(newUser.password, salt);
    // newUser.password = hash;

    // 异步
    // 加密时函数里newUser是正常的，但函数外部newUser没变化？？？只能写成同步或者抽离封装！！！
    // bcrypt.genSalt(10, (err, salt) => {
    //   bcrypt.hash(newUser.password, salt, (err, hash) => {
    //     if (err) throw err;
    //     newUser.password = hash;
    //   });
    // });

    newUser.save()
    ctx.body = newUser
  }
});


/**
 * @route POST api/users/login
 * @desc  登录接口地址 返回token
 * @access 接口是公开的
 */
router.post('/login', async ctx => {
  const { errors, isValid } = validateLoginInput(ctx.request.body);

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  
  const findResult = await User.find({ email: ctx.request.body.email });
  const user = findResult[0];
  const password = ctx.request.body.password;

  // 判断查没查到
  if (findResult.length == 0) {
    ctx.status = 404;
    ctx.body = { email: '用户不存在!' };
  } else {
    // password中提取salt后hash，再和注册时储存的hash后的password比对
    var result = bcrypt.compareSync(password, user.password);

    // 验证通过
    if (result) {
      // 返回token
      const payload = { id: user.id, name: user.name, avatar: user.avatar };
      const token = jwt.sign(payload, keys.secretOrKey, { expiresIn: "7d" });
      ctx.status = 200;
      ctx.body = { success: true, token: 'Bearer ' + token };//注意一定要加Bearer
    } else {
      ctx.status = 400;
      ctx.body = { password: '密码错误!' };
    }
  }
});


/**
 * @route GET api/users/current
 * @desc  用户信息接口地址 返回用户信息
 * @access 接口是私密的
 */
router.get( '/current', passport.authenticate('jwt', { session: false }), async ctx => {
    ctx.body = {
      id: ctx.state.user.id,
      name: ctx.state.user.name,
      email: ctx.state.user.email,
      avatar: ctx.state.user.avatar
    }; 
  }
);


//使路由生效
module.exports = router.routes();











