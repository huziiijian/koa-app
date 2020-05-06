import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Options from '../../common/Options';
import TextFieldGroup from '../../common/TextFieldGroup';
import TextAreaFieldGroup from '../../common/TextAreaFieldGroup';
import SelectListGroup from '../../common/SelectListGroup';
import InputGroup from '../../common/InputGroup';
import { createProfile, getCurrentProfile } from '../../actions/profileActions';
import isEmpty from '../../validation/is-empty';
class CreateProfile extends Component {
  state = {
    displaySocialInputs: false, handle: '', company: '', website: '', location: '',
    status: '', skills: '', githubusername: '', bio: '', wechat: '', QQ: '',
    tengxunkt: '', wangyikt: '', errors: {}
  };

  componentDidMount() {
    this.props.getCurrentProfile();
  }

  onSubmit = (e) => {
    e.preventDefault();
    const profileData = {
      handle: this.state.handle,
      company: this.state.company,
      website: this.state.website,
      location: this.state.location,
      status: this.state.status,
      skills: this.state.skills,
      githubusername: this.state.githubusername,
      bio: this.state.bio,
      wechat: this.state.wechat,
      QQ: this.state.QQ,
      tengxunkt: this.state.tengxunkt,
      wangyikt: this.state.wangyikt,
    };
    // console.log(profileData);
    this.props.createProfile(profileData, this.props.history);
  }

  // 生命周期函数
  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      })
    }

    if (nextProps.profile.profile) {
      const profile = nextProps.profile.profile;
      console.log(profile)

      profile.company = !isEmpty(profile.company) ? profile.company : '';
      profile.website = !isEmpty(profile.website) ? profile.website : '';
      profile.location = !isEmpty(profile.location) ? profile.location : '';
      profile.githubusername = !isEmpty(profile.githubusername)
        ? profile.githubusername
        : '';
      profile.bio = !isEmpty(profile.bio) ? profile.bio : '';

      profile.social = !isEmpty(profile.social) ? profile.social : {};
      profile.wechat = !isEmpty(profile.social.wechat)
        ? profile.social.wechat
        : '';
      profile.QQ = !isEmpty(profile.social.QQ)
        ? profile.social.QQ
        : '';
      profile.tengxunkt = !isEmpty(profile.social.tengxunkt)
        ? profile.social.tengxunkt
        : '';
      profile.wangyikt = !isEmpty(profile.social.wangyikt)
        ? profile.social.wangyikt
        : '';

      const skillsCSV = profile.skills.join(",");
      this.setState({
        handle: profile.handle,
        company: profile.company,
        website: profile.website,
        location: profile.location,
        status: profile.status,
        skills: skillsCSV,
        githubusername: profile.githubusername,
        bio: profile.bio,
        wechat: profile.wechat,
        QQ: profile.QQ,
        tengxunkt: profile.tengxunkt,
        wangyikt: profile.wangyikt
      })
    }
  }

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const { errors, displaySocialInputs } = this.state;

    let socialInputs;

    if (displaySocialInputs) {
      socialInputs = (
        <div>
          <InputGroup placeholder="微信公众号" name="wechat" icon="fab fa-weixin" value={this.state.wechat}
            onChange={this.onChange} error={errors.wechat} />
          <InputGroup placeholder="QQ" name="QQ" icon="fab fa-qq" value={this.state.QQ}
            onChange={this.onChange} error={errors.QQ} />
          <InputGroup placeholder="腾讯课堂网址" name="tengxunkt" icon="fab fa-wechat" value={this.state.tengxunkt}
            onChange={this.onChange} error={errors.tengxunkt} />
          <InputGroup placeholder="网易云课堂网址" name="wangyikt" icon="fab fa-wechat" value={this.state.wangyikt}
            onChange={this.onChange} error={errors.wangyikt} />
        </div>
      );
    }

    return (
      <div className="create-profile">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center">编辑个人信息</h1>
              <small className="d-block pb-3">* 表示必填项</small>
              <form onSubmit={this.onSubmit}>
                <TextFieldGroup
                  placeholder="* Profile Handle"
                  name="handle" value={this.state.handle}
                  onChange={this.onChange} error={errors.handle}
                  info="此处的handle是在后端接口中需要用来查询数据的, 通常是写你email的名字"
                />
                <SelectListGroup
                  placeholder="Status"
                  name="status" value={this.state.status}
                  onChange={this.onChange}
                  options={Options} error={errors.status}
                  info="请告知我们您目前所从事的岗位"
                />
                <TextFieldGroup
                  placeholder="公司" name="company"
                  value={this.state.company}
                  onChange={this.onChange} error={errors.company}
                  info="可以是你自己的公司或者是你的在职公司"
                />
                <TextFieldGroup
                  placeholder="网址" name="website"
                  value={this.state.website}
                  onChange={this.onChange} error={errors.website}
                  info="你公司网址或者是你在职公司网址"
                />
                <TextFieldGroup
                  placeholder="坐标" name="location"
                  value={this.state.location}
                  onChange={this.onChange} error={errors.location}
                  info="你所在的城市及所在区 (例如. 北京市昌平区)"
                />
                <TextFieldGroup
                  placeholder="* 编程语言技能" name="skills"
                  value={this.state.skills}
                  onChange={this.onChange} error={errors.skills}
                  info="请使用逗号隔开你所掌握的语言 (例如: HTML,CSS,JavaScript,PHP)"
                />
                <TextFieldGroup
                  placeholder="Github 用户名" name="githubusername"
                  value={this.state.githubusername}
                  onChange={this.onChange} error={errors.githubusername}
                  info="如果你希望将你的项目分享给大家, 可以填写你的github用户名"
                />
                <TextAreaFieldGroup
                  placeholder="自我介绍" name="bio"
                  value={this.state.bio}
                  onChange={this.onChange} error={errors.bio}
                  info="简单介绍一下自己"
                />

                <div className="mb-3">
                  <button
                    className="btn btn-light"
                    type="button"
                    onClick={() => {
                      this.setState(prevState => ({
                        displaySocialInputs: !prevState.displaySocialInputs
                      }));
                    }}
                  >
                    添加社交账号
                  </button>
                  <span className="text-muted">选项</span>
                </div>
                {socialInputs}
                <input type="submit" value="提交" className="btn btn-info btn-block mt-4" />
              </form>
            </div>
          </div>
        </div>
      </div >
    )
  }
}

CreateProfile.propTypes = {
  createProfile: PropTypes.func.isRequired,
  getCurrentProfile: PropTypes.func.isRequired,
  profile: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
  profile: state.profile,
  errors: state.errors
})

export default connect(mapStateToProps, { createProfile, getCurrentProfile })(withRouter(CreateProfile));