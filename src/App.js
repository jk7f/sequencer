import React, { Component } from "react";
import "./App.css";
let audioCtx = null;
const hzTable = [392, 415, 440, 466, 493, 523, 554, 587, 622, 659, 698, 740];

class App extends Component {
  state = {
    step: 0,
    grid: [],
    sounds: []
  };
  componentDidMount = () => {
    const grid = Array(12);
    grid.fill(Array(12), 0, 12);
    grid.forEach(item => {
      item.fill(0, 0, 12);
    });
    this.setState(
      {
        grid
      },
      () => {
        this.loop();
      }
    );
  };

  toggle = (row, col) => {
    const { grid } = this.state;
    const newGrid = JSON.parse(JSON.stringify(grid));
    if (!audioCtx) {
      audioCtx = new window.AudioContext();
    }
    newGrid[row][col] = !newGrid[row][col];

    this.setState({
      grid: newGrid
    });
  };

  loop = () => {
    const { step, grid, sounds } = this.state;

    sounds.forEach(sound => {
      sound.stop(0);
    });

    const batchedSounds = [];
    grid.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (step === colIndex && col) {
          batchedSounds.push(rowIndex);
        }
      });
    });

    if (batchedSounds.length > 0) {
      this.emitSound(batchedSounds);
    }
    this.setState(
      {
        step: step >= 11 ? 0 : step + 1
      },
      () => {
        setTimeout(() => {
          this.loop();
        }, 200);
      }
    );
  };

  emitSound = sounds => {
    const emittedSounds = [];
    sounds.forEach(sound => {
      const emitter = audioCtx.createOscillator();
      emitter.frequency.setValueAtTime(hzTable[sound], audioCtx.currentTime);
      emitter.start(0);
      emitter.connect(audioCtx.destination);
      emittedSounds.push(emitter);
    });
    this.setState({
      sounds: emittedSounds
    });
  };

  getColClass = (col, colIndex, step) => {
    if (col && colIndex === step) {
      return "col active";
    } else if (col) {
      return "col toggled";
    } else if (colIndex === step) {
      return "col step";
    }
    return "col";
  };

  render() {
    const { grid, step } = this.state;
    return (
      <div className="App">
        {grid.map((row, rowIndex) => (
          <div key={"row" + rowIndex} className="row">
            {row.map((col, colIndex) => (
              <div
                key={"col" + colIndex + "row" + rowIndex}
                className={this.getColClass(col, colIndex, step)}
                onClick={() => this.toggle(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }
}

export default App;
