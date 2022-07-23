import {
  CSSProperties,
  FocusEvent,
  FormEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useState,
} from 'react';

import { PREFIX } from '../../constants';
import { Command } from '../../types';

import './DataEntry.css';

type Props = {
  isInProgress: boolean;
  onChange: (command: Command) => void;
  onSubmit: () => void;
};

export const DataEntry = forwardRef<HTMLInputElement, Props>(
  ({ isInProgress, onChange, onSubmit }, ref) => {
    const [caretIndex, setCaretIndex] = useState(0);

    const caretPosition = {
      '--index': isInProgress ? 0 : caretIndex,
    } as CSSProperties;

    const prefix = isInProgress ? ':' : PREFIX;

    const handleInputEvent = <T extends HTMLInputElement>(
      event: MouseEvent<T> | FocusEvent<T> | KeyboardEvent<T>
    ) => {
      const target: HTMLInputElement = event.target as HTMLInputElement;

      if (target.selectionStart === target.selectionEnd) {
        setCaretIndex(target.selectionStart ?? 0);
      }
    };

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
    };

    return (
      <form className="DataEntry" onSubmit={handleSubmit}>
        <div role="presentation">{prefix}</div>
        <div className="DataEntry__interact">
          <div
            className="DataEntry__caret"
            role="presentation"
            style={caretPosition}
          >
            m
          </div>
          <input
            disabled={isInProgress}
            autoCorrect="off"
            autoFocus
            className="DataEntry__input"
            ref={ref}
            spellCheck={false}
            type="text"
            onChange={({ target }) => onChange(target.value)}
            onClick={handleInputEvent}
            onContextMenu={handleInputEvent}
            onFocus={handleInputEvent}
            onKeyDown={handleInputEvent}
          />
        </div>
      </form>
    );
  }
);
