import { AvailableCommands } from './constants';
import { cv, help } from './output';
import { Command } from './types';

export const getCommandOutput = (command: Command) => {
  switch (command) {
    case '': {
      return '';
    }

    case AvailableCommands.Exit: {
      return 'bye!';
    }

    case AvailableCommands.CV: {
      return cv;
    }

    case AvailableCommands.Help: {
      return help;
    }

    case AvailableCommands.WhoAmI: {
      return window.navigator.userAgent;
    }

    case AvailableCommands.GoToSite: {
      return 'redirecting...';
    }

    default:
      return `command not found: ${command}`;
  }
};
