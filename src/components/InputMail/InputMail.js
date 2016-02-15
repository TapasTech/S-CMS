import React from 'react';
import { Select } from 'tapas-ui';

import styles from './style.less';

const Option = Select.Option;

export default class MailInput extends React.Component {
  static propTypes = {
    bubbleValue: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      options: []
    };
  }

  render() {
    return (
      <Select combobox
        style = {{width: '100%', height: 34}}
        onChange = {::this.handleChange}
        filterOption = {false}
        searchPlaceholder = '邮箱'>
        {this.state.options}
      </Select>
    );
  }

  handleChange(value) {
    // bubble value of this mail input
    this.props.bubbleValue(value);
    const mailProvider = [
      'gmail.com',
      '163.com',
      'qq.com',
      'outlook.com'
    ];

    let options;
    if (!value || value.indexOf('@') > -1) {
      options =[];
    } else {
      options = mailProvider.map( domain => {
        const email = `${value}@${domain}`;
        return <Option key={email}>{email}</Option>;
      });
    }

    this.setState({
      options: options
    });
  }
}
