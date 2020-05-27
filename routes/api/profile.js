const Router = require('koa-router');
const router = new Router();
const passport = require('koa-passport');

// 引入模板实例
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// 引入验证
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');


/**
 * @route GET api/profile
 * @desc  个人信息接口地址
 * @access 接口私有
 */
router.get('/', passport.authenticate('jwt', { session: false }), async ctx => {
  const profile = await Profile.find({ user: ctx.state.user.id })
    .populate('user', ['name', 'avatar']);//以对象形式去加入新表格的数据
  if (profile.length > 0) {
    ctx.status = 200;
    ctx.body = profile[0]; // 注意find()的返回值是数组类型
  } else {
    ctx.status = 404;
    ctx.body = { noprofile: '该用户没有任何相关的个人信息' };
    return;
  }
});


/**
 * @route POST api/profile
 * @desc  添加和编辑个人信息接口地址
 * @access 接口私有
 */
router.post('/', passport.authenticate('jwt', { session: false }), async ctx => {

  const { errors, isValid } = validateProfileInput(ctx.request.body);

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;//控制接口内方法所有的逻辑停止执行
  }

  const profileFields = {};
  profileFields.user = ctx.state.user.id;

  if (ctx.request.body.handle) profileFields.handle = ctx.request.body.handle;
  if (ctx.request.body.company)
    profileFields.company = ctx.request.body.company;
  if (ctx.request.body.website)
    profileFields.website = ctx.request.body.website;
  if (ctx.request.body.location)
    profileFields.location = ctx.request.body.location;
  if (ctx.request.body.status) profileFields.status = ctx.request.body.status;

  // skills 数据转换 "html,css,js,vue"
  if (typeof ctx.request.body.skills !== 'undefined') {
    profileFields.skills = ctx.request.body.skills.split(',');
  }
  if (ctx.request.body.bio) profileFields.bio = ctx.request.body.bio;
  if (ctx.request.body.githubusername)
    profileFields.githubusername = ctx.request.body.githubusername;

  profileFields.social = {};

  if (ctx.request.body.wechat)
    profileFields.social.wechat = ctx.request.body.wechat;
  if (ctx.request.body.QQ) profileFields.social.QQ = ctx.request.body.QQ;
  if (ctx.request.body.tengxunkt)
    profileFields.social.tengxunkt = ctx.request.body.tengxunkt;
  if (ctx.request.body.wangyikt)
    profileFields.social.wangyikt = ctx.request.body.wangyikt;

  // 查询数据库
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile.length > 0) {
    // 编辑更新
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },//更新哪一组数据
      { $set: profileFields },//更新的内容
      { new: true }
    );
    ctx.body = profileUpdate;
  } else {//没有查到对应信息，则添加信息
    await new Profile(profileFields).save().then(profile => {
      ctx.status = 200;
      ctx.body = profile;
    });
  }
}
);


/**
 * @route GET api/profile/handle?handle=test
 * @desc  通过handle获取个人信息接口地址
 * @access 接口公开
 */
router.get('/handle', async ctx => {
  const errors = {};
  const handle = ctx.query.handle;
  // console.log(handle);
  const profile = await Profile.find({ handle: handle }).populate('user', [
    'name',
    'avatar'
  ]);
  // console.log(profile);

  if (profile.length < 1) {
    errors.noprofile = '未找到该用户信息';
    ctx.status = 404;
    ctx.body = errors;
  } else {
    ctx.body = profile[0];
  }
});


/**
 * @route GET api/profile/user?user_id=blabla
 * @desc  通过user_id获取个人信息接口地址
 * @access 接口公开
 */
router.get('/user', async ctx => {
  const errors = {};
  const user_id = ctx.query.user_id;
  const profile = await Profile.find({ user: user_id }).populate('user', [
    'name',
    'avatar'
  ]);
  // console.log(profile);

  if (profile.length < 1) {
    errors.noprofile = '未找到该用户信息';
    ctx.status = 404;
    ctx.body = errors;
  } else {
    ctx.body = profile[0];
  }
});


/**
 * @route GET api/profile/all
 * @desc  获取所有人信息接口地址
 * @access 接口公开
 */
router.get('/all', async ctx => {
  const errors = {};
  const profiles = await Profile.find({}).populate('user', ['name', 'avatar']);

  if (profiles.length < 1) {
    errors.noprofile = '没有任何用户信息';
    ctx.status = 404;
    ctx.body = errors;
  } else {
    ctx.body = profiles;
  }
});


/**
 * @route GET api/profile/experience
 * @desc  工作经验接口地址
 * @access 接口是私有的
 */
router.post('/experience', passport.authenticate('jwt', { session: false }), async ctx => {
  const { errors, isValid } = validateExperienceInput(ctx.request.body);

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  const profile = await Profile.find({ user: ctx.state.user.id });

  if (profile.length > 0) {
    const newExp = {
      title: ctx.request.body.title,
      current: ctx.request.body.current,
      company: ctx.request.body.company,
      location: ctx.request.body.location,
      from: ctx.request.body.from,
      to: ctx.request.body.to,
      description: ctx.request.body.description
    };

    const profileUpdate = await Profile.updateOne(//update返回处理条数
      { user: ctx.state.user.id },
      { $push: { experience: newExp } },
      { $sort: 1 }
    );
    // console.log(profileUpdate)

    // ctx.body = profileUpdate;
    if (profileUpdate.ok == 1) {//更新条数
      const profile = await Profile.find({
        user: ctx.state.user.id
      }).populate('user', ['name', 'avatar']);

      if (profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    errors.noprofile = '没有该用户的信息';
    ctx.status = 404;
    ctx.body = errors;
  }
}
);


/**
 * @route GET api/profile/education
 * @desc  教育接口地址
 * @access 接口是私有的
 */
router.post('/education', passport.authenticate('jwt', { session: false }), async ctx => {
  const { errors, isValid } = validateEducationInput(ctx.request.body);

  // 判断是否验证通过
  if (!isValid) {
    ctx.status = 400;
    ctx.body = errors;
    return;
  }
  const profile = await Profile.find({ user: ctx.state.user.id });

  if (profile.length > 0) {
    const newEdu = {
      school: ctx.request.body.school,
      current: ctx.request.body.current,
      degree: ctx.request.body.degree,
      fieldofstudy: ctx.request.body.fieldofstudy,
      from: ctx.request.body.from,
      to: ctx.request.body.to,
      description: ctx.request.body.description
    };

    const profileUpdate = await Profile.updateOne(
      { user: ctx.state.user.id },
      { $push: { education: newEdu } },
      { $sort: 1 }
    );

    // ctx.body = profileUpdate;
    if (profileUpdate.ok == 1) {
      const profile = await Profile.find({
        user: ctx.state.user.id
      }).populate('user', ['name', 'avatar']);

      if (profile) {
        ctx.status = 200;
        ctx.body = profile;
      }
    }
  } else {
    errors.noprofile = '没有该用户的信息';
    ctx.status = 404;
    ctx.body = errors;
  }
}
);


/**
 * @route DELETE api/profile/experience?exp_id=dfasdfa
 * @desc  删除工作经验接口地址
 * @access 接口是私有的
 */
router.delete('/experience', passport.authenticate('jwt', { session: false }), async ctx => {
  const exp_id = ctx.query.exp_id;// 前端要给exp_id的变量给接口
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile[0].experience.length > 0) {
    const removeIndex = profile[0].experience
      .map(item => item.id)
      // 在确定好user下查找特定experience，id值的experience下标
      .indexOf(exp_id);
    // 根据下标删除对应id的experience,注意splice(-1,1)会删除最后一位
    removeIndex != -1 ? profile[0].experience.splice(removeIndex, 1) : {};
    // 更新数据库
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },
      { $set: profile[0] },
      { new: true }
    );
    ctx.body = profileUpdate;
  } else {
    ctx.status = 404;
    ctx.body = { errors: '没有任何数据' };
  }
}
);


/**
 * @route DELETE api/profile/education?edu_id=dfasdfa
 * @desc  删除工作经验接口地址
 * @access 接口是私有的
 */
router.delete('/education', passport.authenticate('jwt', { session: false }), async ctx => {
  const edu_id = ctx.query.edu_id;
  const profile = await Profile.find({ user: ctx.state.user.id });
  if (profile[0].education.length > 0) {
    const removeIndex = profile[0].education
      .map(item => item.id)
      .indexOf(edu_id);
    profile[0].education.splice(removeIndex, 1);
    // 更新数据库
    const profileUpdate = await Profile.findOneAndUpdate(
      { user: ctx.state.user.id },
      { $set: profile[0] },
      { new: true }
    );

    ctx.body = profileUpdate;
  } else {
    ctx.status = 404;
    ctx.body = { errors: '没有任何数据' };
  }
}
);


/**
 * @route DELETE api/profile
 * @desc  删除整个用户接口地址
 * @access 接口是私有的
 */
router.delete('/', passport.authenticate('jwt', { session: false }), async ctx => {
  const profile = await Profile.deleteOne({ user: ctx.state.user.id });
  if (profile.ok == 1) {//判断用户是否有个人信息
    const user = await User.deleteOne({ _id: ctx.state.user.id });
    if (user.ok == 1) {
      ctx.status = 200;
      ctx.body = { success: true };
    }
  } else {
    ctx.status = 404;
    ctx.body = { error: 'profile不存在' };
  }
}
);


module.exports = router.routes();
