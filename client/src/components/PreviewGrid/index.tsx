import { ReactElement, useEffect, useRef, useState } from 'react';
import './PreviewGrid.css';
import { IdedNotes, Notes } from '../../models/notes';
import { motion, Target, TargetAndTransition } from 'framer-motion';

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

type HeightPromise = Promise<number>;
type HeightCallback = (height: number) => void;

interface CardResolver {
  noteId: string;
  resolver: HeightCallback;
}

interface CardHeight {
  noteId: string;
  height: number;
}

interface CardProps {
  note: Notes;
  width: number;
  visible: boolean;
  initialY: number;
  position?: Omit<CardPosition, 'noteId'>;
  heightCallback?: HeightCallback;
}

function PreviewGrid({ notes }: GridProps): ReactElement {
  const [gridWidth, setGridWidth] = useState<number>();
  const [columnData, setColumnData] = useState<ColumnData>({ width: minimumWidth, gap: minimumGap, quantity: 1 });
  const [cardResolvers, setCardResolvers] = useState<CardResolver[]>([]);
  const [cardsHeight, setCardsHeight] = useState<CardHeight[]>([]);
  const previewGrid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const resizeCallback = () => setGridWidth(previewGrid.current?.offsetWidth);
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

  useEffect(() => {
    const heightPromises: [string, Promise<number>][] = [];
    const newResolvers = [...cardResolvers];
    notes.forEach(note => {
      let resolver: (h: number) => void = () => {};
      const callbackIndex = newResolvers.findIndex(prev => prev.noteId === note._id);
      const promise = new Promise<number>(resolve => (resolver = resolve));
      heightPromises.push([note._id, promise]);

      if (callbackIndex > -1) newResolvers[callbackIndex] = { noteId: note._id, resolver };
      else newResolvers.push({ noteId: note._id, resolver });
    });

    setCardResolvers(newResolvers);

    Promise.all(heightPromises.map(([noteId, promise]) => promise.then(height => ({ noteId, height })))).then(
      heights => {
        const newCardsHeight = [...cardsHeight];
        heights.forEach(cur => {
          const index = newCardsHeight.findIndex(prev => cur.noteId === prev.noteId);
          if (index > -1) newCardsHeight[index].height = cur.height;
          else newCardsHeight.push({ ...cur });
        });
        setCardsHeight(newCardsHeight);
      },
    );
  }, [notes, columnData.width, columnData.quantity, columnData.gap]);

  const renderCards = () => {
    const colHeights = new Array(columnData.quantity).fill(0);
    const cards = notes.map((note, index) => {
      const resolverIndex = cardResolvers.findIndex(({ noteId }) => noteId === note._id);
      const resolver = resolverIndex > -1 ? cardResolvers[resolverIndex].resolver : undefined;

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
          heightCallback={resolver}
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
  const [animateProperty, setAnimateProperty] = useState<Target>();
  const visibility = visible ? 'visible' : 'hidden';
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (heightCallback) {
        console.log(`Height Changed!!!`);
        heightCallback(ref.current.offsetHeight);
      }
    }
  }, [ref.current, note, heightCallback]);

  return (
    <motion.div
      ref={ref}
      className='preview-card'
      style={{ width }}
      initial={{ y: initialY }}
      animate={{ ...position, visibility }} //Use the animate property
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
