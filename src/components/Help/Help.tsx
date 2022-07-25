import { FC } from 'react';

import './Help.css';

type Props = {
  className: string;
};

export const Help: FC<Props> = ({ className }) => {
  const handleClick = () => {
    alert(
      'It is an Terminal emulator made just for fun. Type anything you want - already shipped commands and hotkeys are available on `help` command. You can read about a process of creation of this app in my blog @ https://medium.com/@mei33.pw/'
    );
  };

  return (
    <button
      className={`Help ${className}`}
      title="What is it?"
      type="button"
      onClick={handleClick}
    >
      ?
    </button>
  );
};
