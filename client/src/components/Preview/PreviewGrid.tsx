import { ReactElement, useCallback, useEffect, useRef, useState } from 'react';
import './Preview.css';
import { IdedNotes } from '../../models/notes';
import { motion } from 'framer-motion';
import PreviewCard, { ModalLayout } from './PreviewCard';
import { clearNewNote, newNoteTempId, notesSelector, NotesStatus } from '../../slices/noteSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

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

interface CardHeight {
  noteId: string;
  height: number;
}

let resizeDebounceId = -1;

const debouncedHeights = {
  timeoutId: -1,
  heights: [] as CardHeight[],
};

function PreviewGrid({ notes }: GridProps): ReactElement {
  const dispatch = useAppDispatch();
  const [modalLayout, setModalLayout] = useState<ModalLayout>();
  const [gridWidth, setGridWidth] = useState<number>();
  const [columnData, setColumnData] = useState<ColumnData>({ width: minimumWidth, gap: minimumGap, quantity: 1 });
  const [cardsHeight, setCardsHeight] = useState<CardHeight[]>([]);
  const previewGrid = useRef<HTMLDivElement>(null);
  const { editingId, status } = useAppSelector(notesSelector);

  useEffect(() => {
    if (status !== NotesStatus.Editing) {
      dispatch(clearNewNote());
    }
  }, [dispatch, status]);

  const heightCallback = useCallback(
    (noteId: string, height: number) => {
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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [setGridWidth, notes.map(({_id}) => _id).join()]
  );

  useEffect(() => {
    const resizeCallback = () => {
      if (resizeDebounceId !== -1) clearTimeout(resizeDebounceId);
      resizeDebounceId = window.setTimeout(() => {
        resizeDebounceId = -1;
        setGridWidth(previewGrid.current?.offsetWidth);
        const { innerWidth: sWidth, innerHeight: sHeight } = window;
        const width = sWidth * 0.6,
          height = sHeight * 0.6;
        const x = sWidth * 0.2,
          y = sHeight * 0.2;
        setModalLayout({ x, y, width, height });
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
    const cards = notes
      .filter(({ _id }) => _id !== newNoteTempId || (editingId === newNoteTempId && status === NotesStatus.Editing))
      .map((note) => {
        console.log('\tRendering Card');
        const heightIndex = cardsHeight.findIndex(({ noteId }) => noteId === note._id);
        const height = heightIndex > -1 ? cardsHeight[heightIndex].height : 0;
        const lowestValueIndex = colHeights.reduce((lvi, v, i, a) => (v < a[lvi] ? i : lvi), 0);
        const x = lowestValueIndex * (columnData.width + columnData.gap);
        const y = colHeights[lowestValueIndex];
        colHeights[lowestValueIndex] += height + 16;
        return (
          <PreviewCard
            key={note._id}
            note={note}
            initialY={y}
            visible={!!height}
            gridPosition={{ x, y }}
            modalLayout={modalLayout}
            width={columnData.width}
            heightCallback={heightCallback}
          />
        );
      });

    if (previewGrid.current) previewGrid.current.style.height = `${Math.max(...colHeights) + 100}px`;
    return cards;
  };

  return (
    <motion.div ref={previewGrid} className='preview-grid'>
      {renderCards()}
    </motion.div>
  );
}

export default PreviewGrid;
