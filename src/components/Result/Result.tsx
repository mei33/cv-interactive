import { FC } from 'react';

import { AvailableCommands, PREFIX } from '../../constants';
import { Command } from '../../types';
import { getCommandOutput } from '../../utils';

import './Result.css';

type Props = {
  command: Command;
};

export const Result: FC<Props> = ({ command }) => {
  const renderContent = (command: Command) => {
    switch (command) {
      case '': {
        return '';
      }

      case AvailableCommands.WhoAmI: {
        return getCommandOutput(AvailableCommands.WhoAmI);
      }

      case AvailableCommands.Exit: {
        return 'bye!';
      }

      case AvailableCommands.CV: {
        return getCommandOutput(AvailableCommands.CV);
      }

      case AvailableCommands.Help: {
        return getCommandOutput(AvailableCommands.Help);
      }

      default:
        return `command not found: ${command}`;
    }
  };

  return (
    <section className="Result">
      {`${PREFIX}${command}`}
      <div>{renderContent(command)}</div>
    </section>
  );
};
