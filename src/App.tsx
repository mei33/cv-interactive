import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import {
  DataEntry,
  Help,
  InProgress,
  OffScreen,
  Ref,
  Result,
  Suggestions,
} from './components';
import {
  AvailableCommands,
  CaretCommands,
  LINE_HEIGHT_PX,
  Mode,
  SeekCommands,
  Theme,
} from './constants';
import { useKeyboardHotkeys } from './hooks';
import { siteUrl } from './output';
import { Command } from './types';
import { getCommandOutput, loadCommands, saveCommands } from './utils';

import './App.css';

function App() {
  const [mode, setMode] = useState(Mode.Input);

  const [commandsHistory, setCommandsHistory] = useState<Command[]>(
    loadCommands()
  );
  const [commandsEntered, setCommandsEntered] = useState<Command[]>([
    AvailableCommands.Help,
  ]);
  const [suggestionsList, setSuggestionsList] = useState<Command[]>([]);
  const lastCommand = useRef<Command>('');
  const seekCommandIndex = useRef<number | null>(null);

  const [isOff, setIsOff] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const entryRef = useRef<Ref>({
    form: () => null,
    input: () => null,
    caretGet: () => 0,
    caretSet: () => null,
  });

  const [theme, setTheme] = useState<Theme>(Theme.Dark);

  const isCommandInProgress = useMemo(() => mode === Mode.Output, [mode]);

  const handleCommandReset = () => {
    entryRef.current.form()?.reset();
    setSuggestionsList([]);
  };

  const handleCommandSeek = (direction: SeekCommands) => {
    if (!commandsHistory.length) {
      return;
    }

    const input = entryRef.current.input();
    const setCaret = entryRef.current.caretSet;

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

  const handleCaretMove = (direction: CaretCommands) => {
    const caretIndexCurrent = entryRef.current.caretGet();

    switch (direction) {
      case CaretCommands.Prev: {
        if (caretIndexCurrent) {
          entryRef.current.caretSet(caretIndexCurrent - 1);
        }
        return;
      }

      case CaretCommands.Next: {
        const input = entryRef.current.input();

        if (!input) {
          return;
        }

        const indexNext = caretIndexCurrent + 1;

        if (indexNext <= input.value.length) {
          entryRef.current.caretSet(indexNext);
        }
        return;
      }
    }
  };

  const handleCommandSuggest = () => {
    const input = entryRef.current.input();

    if (!input || !input.value) {
      return;
    }

    const suggestions = Object.values(AvailableCommands).filter((cmd) =>
      cmd.startsWith(input.value.toLowerCase())
    );

    setSuggestionsList(suggestions);

    setMode(suggestions.length ? Mode.Suggestion : Mode.Input);
  };

  useKeyboardHotkeys({
    isCommandInProgress,
    onCommandsListClear: handleCommandsListClear,
    onInput: handleInput,
    onCaretMove: handleCaretMove,
    onCommandReset: handleCommandReset,
    onCommandSeek: handleCommandSeek,
    onCommandSuggest: handleCommandSuggest,
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
    const commandToExecute = command.toLowerCase();
    const commandsEnteredUpdated = [...commandsEntered, command];

    handleCommandReset();

    setTimeout(() => {
      scrollToBottom();

      if (commandToExecute === AvailableCommands.CV) {
        setMode(Mode.Output);
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
    if (commandsEntered.length || mode === Mode.Input) {
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
    setMode(Mode.Input);
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
      <Help className="App__tooltip" />

      {!isCommandInProgress && (
        <section className="App__results">
          {commandsEntered.map((command, index) => (
            <Result command={command.toLowerCase()} key={index} />
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

      {mode === Mode.Suggestion && <Suggestions commands={suggestionsList} />}
    </div>
  );
}

export default App;
