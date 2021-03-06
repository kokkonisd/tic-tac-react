/*
 * Simple tic-tac-toe clone built with React.
*/

// import React and the css file
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/* Square (functional component) */
function Square (props)
{
  return (
    // return a button with the click handler passed on from the parent
    <td>
    <button className={"square " + props.color} onClick={props.onClick}>
      {props.value}
    </button>
    </td>
  );
}


/* Board (normal React component) */
class Board extends React.Component {
  // function to render a single square
  renderSquare (i, win)
  {
    return (
      <Square
        key={"square" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        color={win}
      />
    );
  }

  // render function
  render ()
  {
    let count = 0;
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        let color = null;
        if (this.props.win[count] === 3 * i + j) {
          color = "win";
          count++;
        }
        squares.push(this.renderSquare(3 * i + j, color));
      }
      rows.push(<tr className="board-row" key={"row" + i}>{squares}</tr>);
    }

    return <table className="mx-auto text-center"><tbody>{rows}</tbody></table>;
  }
}


/* Game (normal React component) */
class Game extends React.Component {
  // class constructor
  constructor (props)
  {
    // super call
    super(props);
    // state initialization
    this.state = {
      // fill the history with an empty board
      history: [{
        squares: Array(9).fill(null),
      }],
      // no winning combination by default
      win: Array(3).fill(null),
      // history is not reversed by default
      reverseHistory: false,
      // step count starts at 0
      stepNumber: 0,
      // X goes first
      xIsNext: true,
    }
  }

  // click handler for the squares
  handleClick (i)
  {
    // get all the history up until the most recent move
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    // get the current state of the board
    const current = history[history.length - 1];
    // get the squares
    const squares = current.squares.slice();

    // if the game has ended no clicks should be possible
    if (calculateWinner(squares).winner || squares[i]) {
      return;
    }

    // set the square to be an X or an O depending on the xIsNext variable
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // update the state
    this.setState({
      // add a new history state to history
      history: history.concat([{
        squares: squares,
        row: Math.floor(i / 3) + 1,
        col: i % 3 + 1,
      }]),
      // update win state
      win: calculateWinner(squares).color,
      // update the state number and xIsNext
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // function to jump to a certain state
  jumpTo (step)
  {
    // get history up to step
    const history = this.state.history.slice(0, step + 1);
    // get the squares on step
    const squares = history[history.length - 1].squares.slice();
    // update state
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      win: calculateWinner(squares).color,
    });
  }

  // render function
  render ()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const endgame = calculateWinner(current.squares);

    // reverse the history if specified
    const historyToMoves = this.state.reverseHistory ?
      history.slice(0).reverse() : history.slice(0);

    const moves = historyToMoves.map((step, move) => {
      // reverse the move numbers if specified
      move = this.state.reverseHistory ? history.length - move - 1 : move;
      // get move description
      const desc = move ?
        "Go to move #" + move + " ([" + step.row + ", " + step.col + "])" :
        "Go to game start";

      // current move is bold
      let btn;
      if (move === this.state.stepNumber) {
        btn = <button className="btn btn-primary" onClick={() => this.jumpTo(move)}>{desc}</button>;
      } else {
        btn = <button className="btn btn-secondary" onClick={() => this.jumpTo(move)}>{desc}</button>;
      }

      return <li key={move}>{btn}</li>
    });

    let status;
    if (endgame.winner) {
      status = 'Winner: ' + endgame.winner;
      if (endgame.color) {
        current.squares.win = endgame.color;
      }
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game row">
        <div className="game-board col-xl-8 col-lg-8 col-md-7 col-sm-12 col-xs-12 col-12">
          <Board
            squares={current.squares}
            win={this.state.win}
            onClick={(i) => this.handleClick(i)}
          />
          <div className="status display-4">{status}</div>
          <button className="btn btn-primary reverse-btn" onClick={() => this.setState({reverseHistory: !this.state.reverseHistory})}>
            Reverse history order
          </button>
        </div>
        <div className="game-info col-xl-4 col-lg-4 col-md-5 col-sm-12 col-xs-12 col-12">
          <div className="moves mx-auto text-justify lead"><ol>{moves}</ol></div>
        </div>
        <div className="text-center mx-auto signature">
          made by <a className="name" href="https://github.com/kokkonisd">kokkonisd</a> using <a className="source" href="https://reactjs.org/">react.js</a>
        </div>
      </div>

    );
  }
}

// function to calculate the winner
function calculateWinner (squares)
{
  // win states
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  // check if any of the win states is true
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return { winner: squares[a], color: [a, b, c] };
    }
  }

  // if all squares are filled in and no win state is matched
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      // game has not yet ended
      return { winner: null, color: Array(3).fill(null) };
    }
  }

  // otherwise it's a draw
  return { winner: "None. It's a draw.", color: Array(3).fill(null) };

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
