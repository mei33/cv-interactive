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
  useEffect(() => {
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

    window.addEventListener('keydown', handleNavigationKeyPress);

    return () => {
      window.removeEventListener('keydown', handleNavigationKeyPress);
    };
  }, [isCommandInProgress, onCaretMove, onCommandSeek, onCommandSuggest]);

  useEffect(() => {
    const handleMultipleKeyPress = ({
      key,
      ctrlKey,
      metaKey,
    }: KeyboardEvent) => {
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

    window.addEventListener('keydown', handleMultipleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleMultipleKeyPress);
    };
  }, [isCommandInProgress, onCommandReset, onCommandsListClear]);

  useEffect(() => {
    const handleKeyPress = () => {
      if (isCommandInProgress) {
        return;
      }

      onInput();
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [isCommandInProgress, onInput]);
};
