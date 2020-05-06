import React, { Component } from 'react'
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';
import { deleteExperience } from '../../actions/profileActions';

class Experience extends Component {
  onDeleteClick(id) {
    this.props.deleteExperience(id);
  }
  render() {
    const experience = this.props.experience.map(exp => (
      <tr key={exp._id}>
        <td>{exp.company}</td>
        <td>{exp.title}</td>
        <td>
          {exp.from} 至 {exp.to === '' ? '至今' : exp.to}
        </td>
        <td>
          <button
            onClick={this.onDeleteClick.bind(this, exp._id)}
            className="btn btn-danger"
          >
            删除
          </button>
        </td>
      </tr>
    ));

    return (
      <div>
        <h4 className="mb-4">个人履历</h4>
        <table className="table">
          <thead>
            <tr>
              <th>公司</th>
              <th>职位</th>
              <th>年份</th>
              <th />
            </tr>
            {experience}
          </thead>
        </table>
      </div>
    )
  }
}

Experience.propTypes = {
  deleteExperience: PropTypes.func.isRequired
}

export default connect(null, { deleteExperience })(Experience);
