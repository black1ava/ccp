import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';

import CallblockList from './list/CallblockList';
import { AlertContext } from './App';

function CallBlock(){
  const [blockNumbers, setBlockNumbers] = useState([]);
  const [number, setNumber] = useState('');
  const alertContext = useContext(AlertContext);

  async function fetchFunc(){
    const data = await axios.get('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/block-number');
    setBlockNumbers(data.data.Items);
    alertContext.toggle();
  }

  useEffect(function(){
    alertContext.toggle();
    fetchFunc();
  }, []);

  function handleChange(e){
    setNumber(e.target.value);
  }

  function handleSubmit(e){
    e.preventDefault();

    async function addNumber(number){
      try {
        alertContext.toggle();
        await axios.post('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/block-number', { number });
        fetchFunc();

        setNumber('');
      }catch(e){
        console.error(e);
      }
    }

    addNumber(number);
  }

  function handleDelete(id){
    async function deleteBlockNumber(id){
      try {
        alertContext.toggle();
        await axios.delete('https://xuy8ve4zq2.execute-api.us-east-1.amazonaws.com/v1/block-number', { data: { id } });
        fetchFunc();
      }catch(e){
        console.error(e);
      }
    }

    deleteBlockNumber(id);
  }

  const blockNumberList = blockNumbers.map(number => <CallblockList number={ number.number } key={ number.id } id={ number.id } onDelete={ handleDelete }/>);

  return(
    <div className="card">
      <form onSubmit={ handleSubmit }>
        <input 
          type="tel" 
          placeholder="Input a phone number to block" 
          value={ number } 
          onChange={ handleChange }
        />
        <button className="btn btn-primary">Add</button>
      </form>
      <div className="list">
        { blockNumberList }
      </div>
    </div>
  );
}

export default CallBlock;