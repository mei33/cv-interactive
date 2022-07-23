import { AvailableCommands } from './constants';
import { cv, help } from './output';
import { Command } from './types';

export const getCommandOutput = (command: Command) => {
  switch (command) {
    case AvailableCommands.CV: {
      return cv;
    }

    case AvailableCommands.Help: {
      return help;
    }

    default: {
      return '';
    }
  }
};
