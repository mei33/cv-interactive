import { useEffect } from 'react';

import { ScrollCommands } from '../constants';

type Params = {
  onCommand: (command: ScrollCommands) => void;
};

export const useKeyboardScroll = ({ onCommand }: Params) => {
  const handleKeyPress = ({ key }: KeyboardEvent) => {
    switch (key) {
      case 'ArrowUp': {
        onCommand(ScrollCommands.Up);
        return;
      }

      case 'ArrowDown':
      case 'Enter': {
        onCommand(ScrollCommands.Down);
        return;
      }

      case 'q': {
        onCommand(ScrollCommands.Exit);
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });
};
