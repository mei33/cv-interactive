import {
  AvailableCommands,
  commandsDescription,
  hotkeysDescription,
} from '../constants';
import { contacts, cv } from '../output';
import { Command } from '../types';

export const getCommandOutput = (command: Command): string => {
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

    case AvailableCommands.Contacts: {
      return contacts;
    }

    case AvailableCommands.WhoAmI: {
      return window.navigator.userAgent;
    }

    case AvailableCommands.GoToSite: {
      return 'redirecting…';
    }

    case AvailableCommands.Help: {
      return (
        Object.entries(commandsDescription)
          .map(([key, value]) => `${key} – ${value}`)
          .join('\n') + `\n${hotkeysDescription}\n`
      );
    }

    case AvailableCommands.ThemeChange: {
      return `Whoa! Look at these colors!`;
    }

    default:
      return `command not found: ${command}`;
  }
};
