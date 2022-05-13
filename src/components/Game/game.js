import { useEffect, useState } from 'react';
import './game.css';

import { calculateWinner } from '../CalculateWinner/calculateWinner';
import { Board } from '../Board/board';
import { Square } from '../Square/square';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
  useLocation,
} from 'react-router-dom';

import io from 'socket.io-client';

const socket = io("http://localhost:9000");

export function Game() {

  const [game, setGame] = useState(Array(9).fill(''));
  const [turnNumber, setTurnNumber] = useState(0);
  const [myTurn, setMyTurn] = useState(true);
  const [winner, setWinner] = useState(false);
  const [xo, setXO] = useState('X');
  const [player, setPlayer] = useState('');
  const [hasOpponent, setHasOpponent] = useState(false);
  const [share, setShare] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paramsRoom = params.get('room');
  const [room, setRoom] = useState(paramsRoom);

  const [turnData, setTurnData] = useState(false);

  const sendTurn = (index) => {
    if (!game[index] && !winner && myTurn && hasOpponent) {
      socket.emit('reqTurn', JSON.stringify({ index, value: xo, room }));
    }
  };

  const sendRestart = () => {
    socket.emit('reqRestart', JSON.stringify({ room }));
  };

  const restart = () => {
    setGame(Array(9).fill(''));
    setWinner(false);
    setTurnNumber(0);
    setMyTurn(false);
  };

  const renderSquare = (index, turn, value) => {


    return (


      <Square
        value={value}
        onClick={(i) => turn(index)}
      />
   

    );
  };

  const handleClick = (index, turn) => {
    /*const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }*/
    game[index] = xo;
    setMyTurn(true);

    /*  this.setState({
        history: history.concat([{
          squares: squares
        }]),
        //stepNumber: history.length,
       // xIsNext: !this.state.xIsNext,*/
  };


  useEffect(() => {
    combinations.forEach((c) => {
      if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== '') {
        setWinner(true);
      }
    });

    if (turnNumber === 0) {
      setMyTurn(xo === 'X' ? true : false);
    }
  }, [game, turnNumber, xo]);

  useEffect(() => {
    socket.on('playerTurn', (json) => {
      setTurnData(json);
    });

    socket.on('restart', () => {
      restart();
    });

    socket.on('opponent_joined', () => {
      setHasOpponent(true);
      setShare(false);
    });
  }, []);

  useEffect(() => {
    if (turnData) {
      const data = JSON.parse(turnData);
      let g = [...game];
      if (!g[data.index] && !winner) {
        g[data.index] = data.value;
        setGame(g);
        setTurnNumber(turnNumber + 1);
        setTurnData(false);
        setMyTurn(!myTurn);
        setPlayer(data.value);
      }
    }
  }, [turnData, game, turnNumber, winner, myTurn]);

  useEffect(() => {
    if (paramsRoom) {
      // means you are player 2
      setXO('O');
      socket.emit('join', paramsRoom);
      setRoom(paramsRoom);
      setMyTurn(false);
    } else {
      // means you are player 1
      const newRoomName = random();
      socket.emit('create', newRoomName);
      setRoom(newRoomName);
      setMyTurn(true);
    }
  }, [paramsRoom]);

  return (
    <div className="container">
      <h5 className='has-text-white p-6'>
        Sala: {room}
      </h5>
    
      <button className="button is-primary is-light ml-6 p-2" onClick={() => setShare(!share)}>
   
        Compartir
      </button>
  
      {share ? (
        <>
     
          <h5 className='has-text-white p-6'>Compartir link: <input type="text" value={`${window.location.href}?room=${room}`} readOnly /></h5> 
        </>
      ) : null}
      <br />
      <br />
      Turno: {myTurn ? 'Turno tuyo' : 'Oponente'}
      <br />
      {hasOpponent ? '' : 'Esperando oponente...'}
      <p>
        {winner || turnNumber === 9 ? (
          <button className="btn" onClick={sendRestart}>
            Reiniciar
          </button>
        ) : null}
        {winner ? <span>GANADOR: {player}</span> : turnNumber === 9 ? <span>Es un empate!</span> : <br />}
      </p>
      <div className='level'>
        <div className='level-item'>
          <div className="box caja game-board">

            <div className=' level is-flex'>
              <div className='level'>
                <div className=' is-danger'>
                  <div className="board-row">

                    {renderSquare(0, sendTurn, game[0])}
                    {renderSquare(1, sendTurn, game[1])}
                    {renderSquare(2, sendTurn, game[2])}
                  </div>
                  <div className="board-row">
                    {renderSquare(3, sendTurn, game[3])}
                    {renderSquare(4, sendTurn, game[4])}
                    {renderSquare(5, sendTurn, game[5])}
                  </div>
                  <div className="board-row">
                    {renderSquare(6, sendTurn, game[6])}
                    {renderSquare(7, sendTurn, game[7])}
                    {renderSquare(8, sendTurn, game[8])}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>


        </div>

  );
}



const Box = ({ index, turn, value }) => {
  return (
    <div className="game is-block">
      <div className='level'>
        <div className='level-item'>
          <div className="game-info">
            <div className='subtitle has-text-white'>{

            }

            </div>
            {/*<ol>{moves}</ol>*/}
          </div>
        </div>
      </div>
      <div className='level'>
        <div className='level-item'>
          <div className="box caja game-board">

            <Board
              squares={value}
              onClick={(i) => turn(index)}
            />
          </div>
        </div>
      </div>

    </div>
    /* <div className="box" onClick={() => turn(index)}>
       {value}
     </div>*/
  );
};

const combinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const random = () => {
  return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};


export default Game;
/*export class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Movimiento #' + move :
        'Al inicio del juego';
      return (

        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    status = 'Inicia jugador: ' + winner;
    if (winner) {
      status = 'Ganador: ' + winner;
    }
    else {
      status = 'Siguiente jugador: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (


      <div className="game is-block">
        <div className='level'>
          <div className='level-item'>
            <div className="game-info">
              <div className='subtitle has-text-white'>{
                status 
                
              }
               
              </div>
              {/*<ol>{moves}</ol>}
            </div>
          </div>
        </div>
        <div className='level'>
          <div className='level-item'>
            <div className="box caja game-board">
           
              <Board props={this.props}
                squares={current.squares}
                onClick={(i) => this.handleClick(i)}
              />
            </div>
          </div>
        </div>

      </div>


    );
  }
}
*/



