# koa+mongo+react+redux

## 后端接口

### users

@route POST api/users/register

@route POST api/users/login

@route GET api/users/current

***
### profile

@route GET api/profile

@route POST api/profile

@route GET api/profile/handle?handle=test

@route GET api/profile/user?user_id=blabla

@route GET api/profile/all

@route GET api/profile/experience

@route GET api/profile/education

@route DELETE api/profile/experience?exp_id=dfasdfa

@route DELETE api/profile/education?edu_id=dfasdfa

@route DELETE api/profile

***
### posts

@route POST api/posts

@route POST api/posts/all

@route POST api/posts?id=asdfasdf

@route DELETE api/posts?id=adsfasdfasf

@route POST api/posts/like?id=afdsfadfasf

@route POST api/posts/cancel_like?id=afdsfadfasf

@route POST api/posts/comment?id=afdsfadfasf

@route DELETE api/posts/comment?id=afdsfadfasf&comment_id=dsfasdfasfd

 
