import React, { Component } from 'react';
import PropTypes from 'prop-types';
import isEmpty from '../../validation/is-empty';

class ProfileAbout extends Component {
  render() {
    const { profile } = this.props;

    // 获取名字
    const name = profile.user.name.trim().split(' ')[0];

    // 个人技能
    const skills = profile.skills.map((skill, index) => (
      <div key={index} className="p-3">
        <i className="fa fa-check" /> {skill}
      </div>
    ));

    return (
      <div className="row">
        <div className="col-md-12">
          <div className="card card-body bg-light mb-3">
            <h3 className="text-center text-info">{name}的个人介绍</h3>
            <p className="lead">
              {isEmpty(profile.bio) ? (
                <span>{name} 没有填写介绍信息</span>
              ) : (
                  <span>{profile.bio}</span>
                )}
            </p>
            <hr />
            <h3 className="text-center text-info">个人技能</h3>
            <div className="row">
              <div className="d-flex flex-wrap justify-content-center align-items-center">
                {skills}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

ProfileAbout.propTypes = {
  profile: PropTypes.object.isRequired
};

export default ProfileAbout;