import React from 'react';

const Member = (props) => {
  console.log(props.route.path)
  return (
    <div className='content'>Member</div>
  );
}

export default Member
