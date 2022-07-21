import { COMMANDS_LIST_ID } from '../constants';
import { Command } from '../types';

export const loadCommands = (): Command[] =>
  localStorage.getItem(COMMANDS_LIST_ID)?.split(',') ?? [];

export const saveCommands = (commands: Command[]) =>
  localStorage.setItem(COMMANDS_LIST_ID, commands.join(','));
