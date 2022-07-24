import { FC } from 'react';

import { Command } from '../../types';

import './Suggestions.css';

type Props = {
  commands: Command[];
};

export const Suggestions: FC<Props> = ({ commands }) => (
  <ul className="Suggestions">
    {commands.map((command, index) => (
      <li className="Suggestions__item" key={index}>
        {command}
      </li>
    ))}
  </ul>
);
