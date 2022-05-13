import React from 'react';
import './square.css'

export function Square(props) {
    return (
      
        <button className="square is-clickable" onClick={props.onClick}>
          {props.value}
        </button>
    );
  }
