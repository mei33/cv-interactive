import { RefObject, MutableRefObject, useEffect, useRef } from 'react';

import { Command } from '../types';

type Params = {
  commandsHistory: Command[];
  inputRef: RefObject<HTMLInputElement>;
  lastCommand: MutableRefObject<Command>;
  setCommandsEntered: Function;
};

export const useKeyboard = ({
  commandsHistory,
  inputRef,
  lastCommand,
  setCommandsEntered,
}: Params) => {
  const seekCommandIndex = useRef<number | null>(null);

  const handleArrowKeyPress = ({ key }: KeyboardEvent) => {
    if (!inputRef.current) {
      return;
    }

    if (!commandsHistory.length) {
      return;
    }

    switch (key) {
      case 'ArrowUp': {
        const index = seekCommandIndex.current
          ? seekCommandIndex.current - 1
          : commandsHistory.length - 1;

        if (index < 0) {
          const indexLast = commandsHistory.length - 1;

          inputRef.current.value = commandsHistory[indexLast];
          seekCommandIndex.current = indexLast;
          break;
        }

        inputRef.current.value = commandsHistory[index];
        seekCommandIndex.current = index;
        break;
      }

      case 'ArrowDown': {
        if (seekCommandIndex.current === null) {
          return;
        }

        const index = seekCommandIndex.current + 1;

        if (index > commandsHistory.length - 1) {
          inputRef.current.value = lastCommand.current;
          break;
        }

        inputRef.current.value = commandsHistory[index];
        seekCommandIndex.current = index;
        break;
      }

      default: {
        break;
      }
    }
  };

  const handleMultipleKeyPress = ({ key, ctrlKey, metaKey }: KeyboardEvent) => {
    if (!inputRef.current) {
      return;
    }

    switch (key) {
      case 'u': {
        if (ctrlKey) {
          inputRef.current.value = '';
        }
        return;
      }

      case 'k': {
        if (metaKey) {
          setCommandsEntered([]);
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleArrowKeyPress);

    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress);
    };
  });

  useEffect(() => {
    window.addEventListener('keydown', handleMultipleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleMultipleKeyPress);
    };
  });
};
