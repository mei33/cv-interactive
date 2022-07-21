import React from 'react';

import { DataEntry } from './components/DataEntry/DataEntry';
import { Result } from './components/Result/Result';
import { PREFIX } from './constants';
import { useKeyboard } from './hooks/useKeyboard';
import { Command } from './types';
import { saveCommands, loadCommands } from './utils/commandsStorage';

import './App.css';

function App() {
  const [commandsHistory, setCommandsHistory] = React.useState<Command[]>(
    loadCommands()
  );
  const [commandsEntered, setCommandsEntered] = React.useState<Command[]>([]);
  const lastCommand = React.useRef<Command>('');
  const inputRef = React.useRef<HTMLInputElement>(null);

  useKeyboard({ commandsHistory, inputRef, lastCommand });

  const handleCommandCurrentSubmit = () => {
    if (!inputRef.current) {
      return;
    }

    const command = inputRef.current.value ?? '';
    const commandsEnteredUpdated = [...commandsEntered, command];

    inputRef.current.value = '';

    setTimeout(() => {
      setCommandsEntered(commandsEnteredUpdated);

      if (command) {
        const commandsHistoryUpdated = [...commandsHistory, command];

        setCommandsHistory(commandsHistoryUpdated);
        saveCommands(commandsHistoryUpdated);
      }
    }, 500);
  };

  const handleCommandChange = (command: Command) => {
    lastCommand.current = command;
  };

  return (
    <div className="App">
      <section className="App__results">
        {commandsEntered.map((command, index) => (
          <Result command={command} key={index} />
        ))}
      </section>

      <DataEntry
        ref={inputRef}
        onChange={handleCommandChange}
        onSubmit={handleCommandCurrentSubmit}
      />
    </div>
  );
}

export default App;
