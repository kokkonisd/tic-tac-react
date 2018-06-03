/*
 * Simple tic-tac-toe clone built with React.
 * TODO s:
 * 1. Display the location for each move in the format (col, row) in the move history list.
 * 2. Bold the currently selected item in the move list.
 * 3. Add a toggle button that lets you sort the moves in either ascending or descending order.
 * 4. When someone wins, highlight the three squares that caused the win.
 * 5. When no one wins, display a message about the result being a draw.
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


class Game extends React.Component {
  constructor (props)
  {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick (i)
  {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo (step)
  {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render ()
  {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        "Go to move #" + move :
        "Go to game start";

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
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

function calculateWinner (squares)
{
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

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
