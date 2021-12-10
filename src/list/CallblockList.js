import React from 'react';

function CallblockList(props){

  return (
    <div className="block-list">
      { props.number }
      <button className="btn btn-destructive" onClick={ () => props.onDelete(props.id) }>Delete</button>
    </div>
  );
}

export default CallblockList;