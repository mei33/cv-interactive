import { FC } from 'react';

import { PREFIX } from '../../constants';
import { Command } from '../../types';
import { getCommandOutput } from '../../utils';

import './Result.css';

type Props = {
  command: Command;
};

export const Result: FC<Props> = ({ command }) => (
  <section className="Result">
    {`${PREFIX}${command}`}
    <div dangerouslySetInnerHTML={{ __html: getCommandOutput(command) }} />
  </section>
);
