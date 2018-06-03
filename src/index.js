/*
 * Simple tic-tac-toe clone built with React.
 * TODO s:
 * 1. Add a toggle button that lets you sort the moves in either ascending or descending order.
 * 2. When someone wins, highlight the three squares that caused the win.
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
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}


/* Board (normal React component) */
class Board extends React.Component {
  // function to render a single square
  renderSquare (i)
  {
    return (
      <Square
        key={"square" + i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  // render function
  render ()
  {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      let squares = [];
      for (let j = 0; j < 3; j++) {
        squares.push(this.renderSquare(3 * i + j));
      }
      rows.push(<div className="board-row" key={"row" + i}>{squares}</div>);
    }

    return <div>{rows}</div>;
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
    if (calculateWinner(squares) || squares[i]) {
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
      // update the state number and xIsNext
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  // function to jump to a certain state
  jumpTo (step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  // render function
  render ()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to move #" + move + " ([" + step.row + ", " + step.col + "])" :
        "Go to game start";

      // current move is bold
      let btn;
      if (move === this.state.stepNumber) {
        btn = <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button>;
      } else {
        btn = <button onClick={() => this.jumpTo(move)}>{desc}</button>;
      }

      return <li key={move}>{btn}</li>
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a];
    }
  }

  // if all squares are filled in and no win state is matched
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      // game has not yet ended
      return null;
    }
  }

  // otherwise it's a draw
  return "None. It's a draw.";

}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
