import { useEffect } from 'react';

import { CaretCommands, SeekCommands } from '../constants';

type Params = {
  isCommandInProgress: boolean;
  onCommandsListClear(): void;
  onInput(): void;
  onCaretMove(direction: CaretCommands): void;
  onCommandReset(): void;
  onCommandSeek(direction: SeekCommands): void;
  onCommandSuggest(): void;
};

export const useKeyboardHotkeys = ({
  isCommandInProgress,
  onCommandsListClear,
  onCommandSeek,
  onInput,
  onCaretMove,
  onCommandReset,
  onCommandSuggest,
}: Params) => {
  const handleNavigationKeyPress = ({ key }: KeyboardEvent) => {
    if (isCommandInProgress) {
      return;
    }

    switch (key) {
      case 'ArrowUp':
      case 'ArrowDown': {
        const direction =
          key === 'ArrowUp' ? SeekCommands.Prev : SeekCommands.Next;
        onCommandSeek(direction);
        return;
      }

      case 'ArrowLeft':
      case 'ArrowRight': {
        const direction =
          key === 'ArrowLeft' ? CaretCommands.Prev : CaretCommands.Next;
        onCaretMove(direction);
        return;
      }

      case 'Tab': {
        onCommandSuggest();
        return;
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleNavigationKeyPress);

    return () => {
      window.removeEventListener('keydown', handleNavigationKeyPress);
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
  }, []);

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
  }, []);
};
