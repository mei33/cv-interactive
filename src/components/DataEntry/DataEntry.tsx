import {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  FormEvent,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';

import { PREFIX } from '../../constants';
import { Command } from '../../types';

import './DataEntry.css';

type Props = {
  isCommandInProgress: boolean;
  onChange: (command: Command) => void;
  onSubmit: () => void;
};

type CaretIndex = number;

export type Ref = {
  form(): HTMLFormElement | null;
  input(): HTMLInputElement | null;
  caretSet(index: CaretIndex): void;
  caretGet(): CaretIndex;
};

export const DataEntry = forwardRef<Ref, Props>(
  ({ isCommandInProgress, onChange, onSubmit }, ref) => {
    const formRef = useRef<HTMLFormElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [caretIndex, setCaretIndex] = useState<CaretIndex>(0);

    useImperativeHandle(ref, () => ({
      form() {
        return formRef.current;
      },
      input() {
        return inputRef.current;
      },
      caretSet(index: number) {
        setCaretIndex(index);
      },
      caretGet() {
        return caretIndex;
      },
    }));

    const caretPosition = {
      '--index': isCommandInProgress ? 0 : caretIndex,
    } as CSSProperties;

    const prefix = isCommandInProgress ? ':' : PREFIX;

    const handleInputEvent = <T extends HTMLInputElement>(
      event: MouseEvent<T> | FocusEvent<T> | KeyboardEvent<T> | ChangeEvent<T>
    ) => {
      const target: HTMLInputElement = event.target as HTMLInputElement;

      if (target.selectionStart === target.selectionEnd) {
        setCaretIndex(target.selectionStart ?? 0);
      }
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
      handleInputEvent(event);
      onChange(event.target.value);
    };

    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
    };

    const handleReset = () => {
      setCaretIndex(0);
    };

    return (
      <form
        className="DataEntry"
        ref={formRef}
        onSubmit={handleSubmit}
        onReset={handleReset}
      >
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
            disabled={isCommandInProgress}
            autoCorrect="off"
            autoFocus
            className="DataEntry__input"
            ref={inputRef}
            spellCheck={false}
            type="text"
            onChange={handleChange}
            onClick={handleInputEvent}
            onContextMenu={handleInputEvent}
            onFocus={handleInputEvent}
          />
        </div>
      </form>
    );
  }
);
