import React from 'react';

export default class AddMember extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>AddMember</div>
    );
  }
}
