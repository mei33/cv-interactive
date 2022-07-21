import React from 'react';

import { AvailableCommands, Command } from '../../types';

import './Result.css';
import { PREFIX } from '../../constants';

type Props = {
  command: Command;
};

export const Result: React.FC<Props> = ({ command }) => {
  const renderContent = (command: Command) => {
    switch (command) {
      case '': {
        return '';
      }

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
