import React, { FormEvent } from 'react';
import './App.css';
import { Command } from './types';
import { Result } from './components/Result/Result';

export const PREFIX = '> ';

function App() {
  const [commandsList, setCommandsList] = React.useState<Command[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleCommandCurrentSubmit = (event: FormEvent) => {
    event.preventDefault();
    const command = inputRef.current?.value ?? '';

    setTimeout(() => {
      setCommandsList([...commandsList, command]);
    }, 500);
  };

  return (
    <div className="App">
      <section className="App__results">
        {commandsList.map((command, index) => (
          <Result command={command} key={index} />
        ))}
      </section>

      <form className="App_form" onSubmit={handleCommandCurrentSubmit}>
        <span>{PREFIX}</span>
        <input
          autoCorrect="off"
          autoFocus
          className="App__input"
          ref={inputRef}
          spellCheck={false}
          type="text"
        />
      </form>
    </div>
  );
}

export default App;
