import { FC, useEffect } from 'react';

import { AvailableCommands, PREFIX } from '../../constants';
import { Command } from '../../types';
import { getCommandOutput } from '../../utils';

import './Result.css';

type Props = {
  command: Command;
};

export const Result: FC<Props> = ({ command }) => {
  useEffect(() => {
    if (command === AvailableCommands.GoToSite) {
      setTimeout(() => {
        window.location.assign('https://mei33.github.io/');
      }, 1500);
    }
  }, []);

  return (
    <section className="Result">
      {`${PREFIX}${command}`}
      <div dangerouslySetInnerHTML={{ __html: getCommandOutput(command) }} />
    </section>
  );
};
