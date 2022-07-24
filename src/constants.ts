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
}

export const commandsDescription: Record<AvailableCommands, string> = {
  [AvailableCommands.CV]: 'shows full cv',
  [AvailableCommands.Contacts]: 'shows only contacts',
  [AvailableCommands.Exit]: 'finishes session',
  [AvailableCommands.WhoAmI]:
    'shows some info about your browser (just for fun)',
  [AvailableCommands.GoToSite]: 'redirects to Web 2.0 site',
  [AvailableCommands.Help]: 'shows this message :-)',
};

export enum ScrollCommands {
  Up = 'up',
  Down = 'down',
  Exit = 'exit',
}

export enum SeekCommands {
  Prev = 'prev',
  Next = 'next',
}
