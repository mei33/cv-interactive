export enum Mode {
  Input,
  Suggestion,
  Output,
}

export const PREFIX = '> ';

export const COMMANDS_LIST_ID = 'commands';

export const LINE_HEIGHT_PX = 19;

export enum AvailableCommands {
  CV = 'cv',
  Contacts = 'contacts',
  Exit = 'exit',
  Help = 'help',
  WhoAmI = 'whoami',
  GoToSite = 'goto site',
  ThemeChange = 'theme change',
}

export const commandsDescription: Record<AvailableCommands, string> = {
  [AvailableCommands.CV]: 'shows full cv',
  [AvailableCommands.Contacts]: 'shows only contacts',
  [AvailableCommands.Exit]: 'finishes session',
  [AvailableCommands.WhoAmI]:
    'shows some info about your browser (just for fun)',
  [AvailableCommands.GoToSite]: 'redirects to Web 2.0 site',
  [AvailableCommands.ThemeChange]: 'switches between dark/light themes',
  [AvailableCommands.Help]: 'shows this message :-)',
};

export const hotkeysDescription = `
← → – to move caret
↑ ↓ – to seek previously entered command
Tab - to get list of suggested commands based on input
⌘ + U - to remove entered command
⌘ + K - to clear history of entered commands
`;

export enum ScrollCommands {
  Up = 'up',
  Down = 'down',
  Exit = 'exit',
}

export enum SeekCommands {
  Prev = 'prev',
  Next = 'next',
}

export enum CaretCommands {
  Prev = 'prev',
  Next = 'next',
}

export enum Theme {
  Dark = 'dark',
  Light = 'light',
}
