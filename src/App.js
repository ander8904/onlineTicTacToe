import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import './App.css';
import { Board, Game, Square } from './components';
import {BrowserRouter as Router} from 'react-router-dom';

import 'bulma/css/bulma.min.css';


export function App() {

  return (
    <>

   
        <Router>
          <Board></Board>
          <Game></Game>
        </Router>
     

    </>
  );
}


export default App;
