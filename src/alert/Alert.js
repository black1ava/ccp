import React from 'react';

function Alert(props){
  return (
    <div className={`p-fixed alert-card ${ props.active && 'active' }`}>
      Loading...
      <span onClick={ () => props.toggle() }>&times;</span>
    </div>
  );
}

export default Alert;