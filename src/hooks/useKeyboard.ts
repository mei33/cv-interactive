import React from 'react';

import { Command } from '../types';

type Params = {
  commandsHistory: Command[];
  inputRef: React.RefObject<HTMLInputElement>;
  lastCommand: React.MutableRefObject<Command>;
};

export const useKeyboard = ({
  commandsHistory,
  inputRef,
  lastCommand,
}: Params) => {
  const seekCommandIndex = React.useRef<number | null>(null);

  const handleKeyPress = (event: KeyboardEvent) => {
    if (!inputRef.current) {
      return;
    }

    if (!commandsHistory.length) {
      return;
    }

    switch (event.key) {
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

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });
};
