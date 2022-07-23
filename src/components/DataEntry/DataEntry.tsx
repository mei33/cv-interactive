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
  onChange: (command: Command) => void;
  onSubmit: () => void;
};

export const DataEntry = forwardRef<HTMLInputElement, Props>(
  ({ onChange, onSubmit }, ref) => {
    const [caretIndex, setCaretIndex] = useState(0);

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

    const caretPosition = {
      '--index': caretIndex,
    } as CSSProperties;

    return (
      <form className="DataEntry" onSubmit={handleSubmit}>
        <div role="presentation">{PREFIX}</div>
        <div className="DataEntry__interact">
          <div
            className="DataEntry__caret"
            role="presentation"
            style={caretPosition}
          >
            m
          </div>
          <input
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
