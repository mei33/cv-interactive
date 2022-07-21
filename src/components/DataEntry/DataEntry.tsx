import React, { FormEvent } from 'react';

import { PREFIX } from '../../constants';
import { Command } from '../../types';

import './DataEntry.css';

type Props = {
  onChange: (command: Command) => void;
  onSubmit: () => void;
};

export const DataEntry = React.forwardRef<HTMLInputElement, Props>(
  ({ onChange, onSubmit }, ref) => {
    const handleSubmit = (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
    };

    return (
      <form className="DataEntry" onSubmit={handleSubmit}>
        <span>{PREFIX}</span>
        <input
          autoCorrect="off"
          autoFocus
          className="DataEntry__input"
          ref={ref}
          spellCheck={false}
          type="text"
          onChange={({ target }) => onChange(target.value)}
        />
      </form>
    );
  }
);
