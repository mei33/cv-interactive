import { useEffect } from 'react';

import { SeekCommands } from '../constants';

type Params = {
  isCommandInProgress: boolean;
  onCommandsListClear(): void;
  onInput(): void;
  onCommandReset(): void;
  onCommandSeek(direction: SeekCommands): void;
};

export const useKeyboardHotkeys = ({
  isCommandInProgress,
  onCommandsListClear,
  onCommandSeek,
  onInput,
  onCommandReset,
}: Params) => {
  const handleArrowKeyPress = ({ key }: KeyboardEvent) => {
    if (isCommandInProgress) {
      return;
    }

    switch (key) {
      case 'ArrowUp': {
        onCommandSeek(SeekCommands.Prev);
        return;
      }

      case 'ArrowDown': {
        onCommandSeek(SeekCommands.Next);
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleArrowKeyPress);

    return () => {
      window.removeEventListener('keydown', handleArrowKeyPress);
    };
  }, []);

  const handleMultipleKeyPress = ({ key, ctrlKey, metaKey }: KeyboardEvent) => {
    if (isCommandInProgress) {
      return;
    }

    switch (key) {
      case 'u': {
        if (ctrlKey) {
          onCommandReset();
        }
        return;
      }

      case 'k': {
        if (metaKey) {
          onCommandsListClear();
        }
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleMultipleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleMultipleKeyPress);
    };
  });

  const handleKeyPress = () => {
    if (isCommandInProgress) {
      return;
    }

    onInput();
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  });
};
