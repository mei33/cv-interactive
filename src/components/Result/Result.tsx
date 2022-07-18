import React from 'react';

import { AvailableCommands, Command } from '../../types';
import { PREFIX } from '../../App';

import './Result.css';

type Props = {
  command: Command;
};

export const Result: React.FC<Props> = ({ command }) => {
  const renderContent = (command: Command) => {
    switch (command) {
      case AvailableCommands.WhoAmI: {
        return 'you are a guest';
      }

      case AvailableCommands.Exit: {
        return 'bye!';
      }

      default:
        return `command not found: ${command}`;
    }
  };

  return (
    <section className="Result">
      {PREFIX}
      {renderContent(command)}
    </section>
  );
};
