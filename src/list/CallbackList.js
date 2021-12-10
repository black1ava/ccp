import React from 'react';

function CallbackList(props){
  return(
    <div className={ props.status ? 'completed' : 'incompleted' }>
      <div className="inline">
        <h3>{ props.number }</h3>
        <div className="btn-group">
          <button className="btn btn-secondary" onClick={ () => props.onUpdate(props.id, !props.status) }>
            { props.status ? 'uncheck' : 'check' }
          </button>
          <button className="btn btn-destructive" onClick={ () => props.onDelete( props.id ) }>Delete</button>
        </div>
      </div>
      <p>Source: { props.src }</p>
      <p>Date: { props.date }</p>
    </div>
  );
}

export default CallbackList;