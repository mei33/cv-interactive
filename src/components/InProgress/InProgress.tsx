import React, { CSSProperties, useRef, useState } from 'react';

import { LINE_HEIGHT_PX, ScrollCommands } from '../../constants';
import { useKeyboardScroll } from '../../hooks/useKeyboardScroll';

import './InProgress.css';

type Props = {
  data: string;
  onExit: () => void;
};

export const InProgress: React.FC<Props> = ({ data, onExit }) => {
  const [linesScrolled, setLinesScrolled] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const contentHeight = useRef(0);

  const linesAvailable = Math.floor(containerHeight / LINE_HEIGHT_PX);
  const maxHeight = linesAvailable * LINE_HEIGHT_PX;
  const linesRequired = Math.floor(contentHeight.current / LINE_HEIGHT_PX);

  const handleContainerRefRender = (element: HTMLDivElement) =>
    element?.offsetHeight && setContainerHeight(element.offsetHeight);

  const handleContentRefRender = (element: HTMLDivElement) => {
    if (element?.offsetHeight) {
      contentHeight.current = element.offsetHeight;
    }
  };

  const handleScrollCommand = (command: ScrollCommands) => {
    switch (command) {
      case ScrollCommands.Up: {
        if (linesScrolled > 0) {
          setLinesScrolled(linesScrolled - 1);
        }
        return;
      }

      case ScrollCommands.Down: {
        if (!linesRequired) {
          return;
        }

        const isLinesOutScreen =
          linesRequired - linesAvailable - linesScrolled > 0;

        if (isLinesOutScreen) {
          setLinesScrolled(linesScrolled + 1);
        }
        return;
      }

      case ScrollCommands.Exit: {
        onExit();
        return;
      }
    }
  };

  useKeyboardScroll({
    onCommand: handleScrollCommand,
  });

  return (
    <section
      className="InProgress"
      ref={handleContainerRefRender}
      style={
        {
          '--lines-scrolled': linesScrolled,
          '--max-height': `${maxHeight}px`,
        } as CSSProperties
      }
    >
      <div className="InProgress__scrollContainer">
        <div
          className="InProgress__scrollContent"
          dangerouslySetInnerHTML={{ __html: data }}
          ref={handleContentRefRender}
        ></div>
      </div>
    </section>
  );
};
