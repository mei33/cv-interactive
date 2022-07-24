import { CSSProperties, useEffect, useRef, useState } from 'react';
import { DataEntry, InProgress, OffScreen, Ref, Result } from './components';
import {
  AvailableCommands,
  LINE_HEIGHT_PX,
  SeekCommands,
  Theme,
} from './constants';
import { useKeyboardHotkeys } from './hooks';
import { siteUrl } from './output';
import { Command } from './types';
import { getCommandOutput } from './utils';
import { loadCommands, saveCommands } from './utils/commandsStorage';

import './App.css';

function App() {
  const [commandsHistory, setCommandsHistory] = useState<Command[]>(
    loadCommands()
  );
  const [commandsEntered, setCommandsEntered] = useState<Command[]>([]);
  const [isCommandInProgress, setIsCommandInProgress] = useState(false);
  const lastCommand = useRef<Command>('');
  const seekCommandIndex = useRef<number | null>(null);

  const [isOff, setIsOff] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<Ref>({
    form: () => null,
    input: () => null,
    caret: () => null,
  });

  const [theme, setTheme] = useState<Theme>(Theme.Dark);

  const handleCommandReset = () => {
    entryRef.current.form()?.reset();
  };

  const handleCommandSeek = (direction: SeekCommands) => {
    if (!commandsHistory.length) {
      return;
    }

    entryRef.current.caret(12);

    const input = entryRef.current.input();
    const setCaret = entryRef.current.caret;

    if (!input || !setCaret) {
      return;
    }

    switch (direction) {
      case SeekCommands.Prev: {
        const index = seekCommandIndex.current
          ? seekCommandIndex.current - 1
          : commandsHistory.length - 1;

        const indexToSet = index < 0 ? commandsHistory.length - 1 : index;
        const commandToSet = commandsHistory[indexToSet];

        input.value = commandToSet;
        setCaret(commandToSet.length);

        seekCommandIndex.current = index;
        return;
      }

      case SeekCommands.Next: {
        if (seekCommandIndex.current === null) {
          return;
        }

        const index = seekCommandIndex.current + 1;
        const isIndexValid = index < commandsHistory.length;

        const commandToSet = isIndexValid
          ? commandsHistory[index]
          : lastCommand.current;

        input.value = commandToSet;
        setCaret(commandToSet.length);

        if (isIndexValid) {
          seekCommandIndex.current = index;
        }

        return;
      }
    }
  };

  const handleInput = () => {
    if (entryRef.current.input() === document.activeElement) {
      return;
    }

    entryRef.current.input()?.focus();
  };

  const handleCommandsListClear = () => {
    setCommandsEntered([]);
  };

  useKeyboardHotkeys({
    isCommandInProgress,
    onCommandsListClear: handleCommandsListClear,
    onInput: handleInput,
    onCommandReset: handleCommandReset,
    onCommandSeek: handleCommandSeek,
  });

  const scrollToBottom = () => {
    if (!containerRef.current) {
      return;
    }

    containerRef.current.scrollTo(0, containerRef.current.scrollHeight);
  };

  const handleCommandCurrentSubmit = () => {
    const input = entryRef.current.input();
    if (!input) {
      return;
    }

    const command = input.value ?? '';
    const commandsEnteredUpdated = [...commandsEntered, command];

    handleCommandReset();

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

      case AvailableCommands.ThemeChange: {
        const themeUpdated = theme === Theme.Light ? Theme.Dark : Theme.Light;

        setTheme(themeUpdated);
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
      className={`App App--${theme}`}
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
        isCommandInProgress={isCommandInProgress}
        ref={entryRef}
        onChange={handleCommandChange}
        onSubmit={handleCommandCurrentSubmit}
      />
    </div>
  );
}

export default App;
