import { CSSProperties, useEffect, useRef, useState } from 'react';

import { DataEntry } from './components/DataEntry';
import { InProgress } from './components/InProgress/InProgress';
import { OffScreen } from './components/OffScreen/OffScreen';
import { Result } from './components/Result';
import { AvailableCommands, LINE_HEIGHT_PX } from './constants';
import { useKeyboard } from './hooks/useKeyboard';
import { siteUrl } from './output';
import { Command } from './types';
import { getCommandOutput } from './utils';
import { saveCommands, loadCommands } from './utils/commandsStorage';

import './App.css';

function App() {
  const [commandsHistory, setCommandsHistory] = useState<Command[]>(
    loadCommands()
  );
  const [commandsEntered, setCommandsEntered] = useState<Command[]>([]);
  const [isCommandInProgress, setIsCommandInProgress] = useState(false);
  const [isOff, setIsOff] = useState(false);
  const lastCommand = useRef<Command>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useKeyboard({
    commandsHistory,
    inputRef,
    isInProgress: isCommandInProgress,
    lastCommand,
    setCommandsEntered,
  });

  const scrollToBottom = () => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  };

  const handleCommandCurrentSubmit = () => {
    if (!inputRef.current) {
      return;
    }

    const command = inputRef.current.value ?? '';
    const commandsEnteredUpdated = [...commandsEntered, command];

    inputRef.current.value = '';

    setTimeout(() => {
      scrollToBottom();

      if (command === AvailableCommands.CV) {
        setIsCommandInProgress(true);
      }

      setCommandsEntered(commandsEnteredUpdated);

      if (command) {
        const commandsHistoryUpdated = [...commandsHistory, command];

        setCommandsHistory(commandsHistoryUpdated);
        saveCommands(commandsHistoryUpdated);
      }
    }, 500);
  };

  useEffect(() => {
    if (commandsEntered.length || !isCommandInProgress) {
      scrollToBottom();
    }

    const lastCommand = commandsEntered[commandsEntered.length - 1];

    switch (lastCommand) {
      case AvailableCommands.GoToSite: {
        setTimeout(() => {
          window.location.assign(siteUrl);
        }, 1500);
        return;
      }

      case AvailableCommands.Exit: {
        setTimeout(() => {
          setIsOff(true);
        }, 1500);
        return;
      }
    }
  }, [commandsEntered, isCommandInProgress]);

  const handleCommandChange = (command: Command) => {
    lastCommand.current = command;
  };

  const handleInProgressModeExit = () => {
    setIsCommandInProgress(false);
  };

  if (isOff) {
    return <OffScreen />;
  }

  return (
    <div
      className="App"
      ref={containerRef}
      style={{ '--line-height': `${LINE_HEIGHT_PX}px` } as CSSProperties}
    >
      {!isCommandInProgress && (
        <section className="App__results">
          {commandsEntered.map((command, index) => (
            <Result command={command} key={index} />
          ))}
        </section>
      )}

      {isCommandInProgress && (
        <InProgress
          data={getCommandOutput(commandsEntered[commandsEntered.length - 1])}
          onExit={handleInProgressModeExit}
        />
      )}

      <DataEntry
        ref={inputRef}
        onChange={handleCommandChange}
        onSubmit={handleCommandCurrentSubmit}
        isInProgress={isCommandInProgress}
      />
    </div>
  );
}

export default App;
