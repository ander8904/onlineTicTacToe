import React from 'react';

import './board.css'
import { Square } from '../Square/square';



export class Board extends React.Component {

 
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
     
      if (!this.props.squares) {
        return  <div className='level'>
        <div className='level-item'>
        <h3 className='title has-text-white p-6'>TIC TAC TOE</h3>
        </div>
      </div>;
      }
        return (
          <div className=' level is-flex is-justify-content-center is-align-content-center'>
            <div className='level'>
          <div className=' is-danger'>
            <div className="board-row">
              {this.renderSquare(0)}
              {this.renderSquare(1)}
              {this.renderSquare(2)}
            </div>
            <div className="board-row">
              {this.renderSquare(3)}
              {this.renderSquare(4)}
              {this.renderSquare(5)}
            </div>
            <div className="board-row">
              {this.renderSquare(6)}
              {this.renderSquare(7)}
              {this.renderSquare(8)}
            </div>
          </div>
          </div>
          </div>
        );
      
    }
  }
  

