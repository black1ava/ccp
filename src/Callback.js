import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import CallbackList from './list/CallbackList';
import { AlertContext } from './App';


function Callback(){
  const [callbacks, setCallbacks] = useState([]);
  const [updateTime, setUpdateTime] = useState('');
  const alertContext = useContext(AlertContext);

  async function fetchFunc(){
    const data = await axios.get('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/callback');
    setCallbacks(data.data);
    setUpdateTime((new Date()).toString());
    alertContext.toggle();
  }

  useEffect(function(){
    async function func(){
      const data = await axios.get('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/callback');
      setCallbacks(data.data);
      setUpdateTime((new Date()).toString());
      alertContext.toggle();
    }

    alertContext.toggle();
    func();

    const refreshInterval = setInterval(function(){
      alertContext.toggle();
      func();
    }, 60 * 1000);

    return function(){
      clearInterval(refreshInterval);
    }
  }, []);

  async function handleRefresh(){
    alertContext.toggle();
    fetchFunc();
  }

  async function handleUpdate(id, status){
    try {
      alertContext.toggle();
      await axios.post('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/callback', { id, update: status });
      fetchFunc();
    }catch(e){
      console.error(e);
    }
  }

  async function handleDelete(id){
    try {
      alertContext.toggle();
      await axios.delete('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/callback', { data: { id }});
      fetchFunc();
    }catch(e){
      console.error(e);
    }
  }

  const callbackList = callbacks.sort((a, b) => b.details.time - a.details.time).map(function(callback){
    return <CallbackList 
      key={ callback.id } 
      id={ callback.id }
      number={ callback.details.number }
      src={ callback.details.src }
      date={ callback.details.date }
      status={ callback.details.done }
      onUpdate={ handleUpdate }
      onDelete={ handleDelete }
    />;
  });

  return(
    <div className="card">
      <div className="p-fixed">
        <div className="card-header">
          <h1>Callback</h1>
          <button className="btn btn-secondary" onClick={ handleRefresh }>Refresh</button>
        </div>
        <p>Update at: { updateTime }</p>
      </div>
      <div className="list">
        { callbackList }
      </div>
    </div>
  );
}

export default Callback;