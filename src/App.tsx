import { useRef, useState } from 'react';

import { DataEntry } from './components/DataEntry';
import { Result } from './components/Result';
import { useKeyboard } from './hooks/useKeyboard';
import { Command } from './types';
import { saveCommands, loadCommands } from './utils/commandsStorage';

import './App.css';

function App() {
  const [commandsHistory, setCommandsHistory] = useState<Command[]>(
    loadCommands()
  );
  const [commandsEntered, setCommandsEntered] = useState<Command[]>([]);
  const lastCommand = useRef<Command>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboard({ commandsHistory, inputRef, lastCommand, setCommandsEntered });

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
