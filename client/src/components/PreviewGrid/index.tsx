import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import './PreviewGrid.css';
import { IdedNotes } from '../../models/notes';
import { motion } from 'framer-motion';

const minimumWidth = 240;
const minimumGap = 16;
interface GridProps {
  notes: IdedNotes[];
}

interface ColumnData {
  quantity: number;
  width: number;
  gap: number;
}

interface CardPosition {
  noteId: string;
  x: number;
  y: number;
}

interface CardHeight {
  noteId: string;
  height: number;
}

interface CardProps {
  note: IdedNotes;
  width: number;
  visible: boolean;
  initialY: number;
  position?: Omit<CardPosition, 'noteId'>;
  heightCallback: (noteId: string, height: number) => void;
}

let resizeDebounceId = -1;

const debouncedHeights = {
  timeoutId: -1,
  heights: [] as CardHeight[],
};

function PreviewGrid({ notes }: GridProps): ReactElement {
  const [gridWidth, setGridWidth] = useState<number>();
  const [columnData, setColumnData] = useState<ColumnData>({ width: minimumWidth, gap: minimumGap, quantity: 1 });
  const [cardsHeight, setCardsHeight] = useState<CardHeight[]>([]);
  const previewGrid = useRef<HTMLDivElement>(null);

  const heightCallback = useCallback((noteId: string, height: number) => {
    debouncedHeights.heights.push({ noteId, height });
    if (debouncedHeights.timeoutId === -1) {
      debouncedHeights.timeoutId = window.setTimeout(() => {
        const cardHeights = [...cardsHeight];
        const heights = [...debouncedHeights.heights];
        debouncedHeights.timeoutId = -1;
        heights.forEach(({ noteId, height }) => {
          const index = cardHeights.findIndex(prev => noteId === prev.noteId);
          if (index > -1) cardHeights[index].height = height;
          else cardHeights.push({ noteId, height });
        });
        setCardsHeight(cardHeights);
      }, 200);
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setGridWidth]);

  useEffect(() => {
    const resizeCallback = () => {
      if (resizeDebounceId !== -1) clearTimeout(resizeDebounceId);
      resizeDebounceId = window.setTimeout(() => {
        resizeDebounceId = -1;
        setGridWidth(previewGrid.current?.offsetWidth);
      }, 200);
    };
    window.addEventListener('resize', resizeCallback);
    resizeCallback();
    return () => window.removeEventListener('resize', resizeCallback);
  }, [setGridWidth]);

  useEffect(() => {
    if (gridWidth) {
      const quantity = Math.floor(gridWidth / (minimumWidth + minimumGap));
      const extras = (gridWidth % (minimumWidth + minimumGap)) / quantity;
      const width = minimumWidth + Math.floor(extras);
      const gap = minimumGap;
      setColumnData({ gap, width, quantity });
    }
  }, [gridWidth]);

  const renderCards = () => {
    const colHeights = new Array(columnData.quantity).fill(0);
    const cards = notes.map((note, index) => {
      const heightIndex = cardsHeight.findIndex(({ noteId }) => noteId === note._id);
      const height = heightIndex > -1 ? cardsHeight[heightIndex].height : 0;
      const lowestValueIndex = colHeights.reduce((lvi, v, i, a) => (v < a[lvi] ? i : lvi), 0);
      const x = lowestValueIndex * (columnData.width + columnData.gap);
      const y = colHeights[lowestValueIndex];
      colHeights[lowestValueIndex] += height + 16;
      return (
        <PreviewCard
          key={index}
          note={note}
          initialY={y}
          visible={!!height}
          position={{ x, y }}
          width={columnData.width}
          heightCallback={heightCallback}
        />
      );
    });

    return cards;
  };

  return (
    <motion.div ref={previewGrid} className='preview-grid'>
      {renderCards()}
    </motion.div>
  );
}

function PreviewCard({ note, heightCallback, width, initialY, visible, position }: CardProps): ReactElement<CardProps> {
  const visibility = visible ? 'visible' : 'hidden';
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      console.log(`Height Changed!!!`);
      heightCallback(note._id, ref.current.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current?.offsetHeight, note]);

  return (
    <motion.div
      ref={ref}
      className='preview-card'
      style={{ width, visibility }}
      initial={{ y: initialY }}
      animate={{ ...position }} //Use the animate property
      transition={{
        damping: 100,
      }}
    >
      <div className='preview-header'>
        <div className='preview-title'>{note.title}</div>
      </div>
      <div className='preview-content'>{note.content}</div>
    </motion.div>
  );
}

export default PreviewGrid;
