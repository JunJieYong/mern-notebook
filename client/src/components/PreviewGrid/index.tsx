import { ReactElement, useEffect, useRef, useState } from 'react';
import './PreviewGrid.css';
import { Notes } from '../../models/notes';
import { motion, Target, TargetAndTransition } from 'framer-motion';

const minimumWidth = 240;
const minimumGap = 16;
interface GridProps {
  notes: Notes[];
}

interface UICardData {
  note: Notes;
  heightPromise?: Promise<number>;
  contentHeight?: number;
  heightCallback?: (height: number) => void;
}

interface ColumnData {
  quantity: number;
  width: number;
  gap: number;
}

interface Dimension {
  visible: boolean;
  height: number;
  width: number;
  posx: number;
  posy: number;
}

function PreviewGrid({ notes }: GridProps): ReactElement {
  const [gridWidth, setGridWidth] = useState<number>();
  const [columnData, setColumnData] = useState<ColumnData>({ width: minimumWidth, gap: minimumGap, quantity: 1 });
  const [cardsData, setCardsData] = useState<UICardData[]>([]);
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const previewGrid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Setting up width changed callback');
    const resizeCallback = () => setGridWidth(previewGrid.current?.offsetWidth);
    window.addEventListener('resize', resizeCallback);
    resizeCallback();
    return () => {
      console.log('Removed Resize listener');
      window.removeEventListener('resize', resizeCallback);
    };
  }, [setGridWidth]);

  useEffect(() => {
    console.log('Notes Changed');

    const { heightPromises, cardDatas } = notes.reduce(
      (accumulator, note, index) => {
        let resolver: (h: number) => void = () => {};
        //prettier-ignore
        const { contentHeight: prevHeight, heightCallback: prevCallback, heightPromise: prevPromise } = 
          cardsData[index] ?? { contentHeight: undefined, heightCallback: undefined, heightPromise: undefined };

        const heightCallback =
          prevCallback !== undefined ? undefined : prevCallback ? prevCallback : (h: number) => resolver(h);
        const heightPromise =
          prevHeight !== undefined
            ? Promise.resolve(prevHeight)
            : prevPromise
            ? prevPromise
            : new Promise<number>(resolve => (resolver = resolve));

        const cardData: UICardData = { note, heightCallback, heightPromise, contentHeight: prevHeight };
        accumulator.heightPromises.push(heightPromise);
        accumulator.cardDatas.push(cardData);
        return accumulator;
      },
      { heightPromises: [], cardDatas: [] } as { heightPromises: Promise<number>[]; cardDatas: UICardData[] },
    );

    (window as any).hp = heightPromises;
    setCardsData(cardDatas);

    Promise.all(heightPromises).then(heights =>
      setCardsData(cardDatas.map((cd, i) => ({ ...cd, contentHeight: heights[i] }))),
    );
  }, [notes.map(({ title, content }) => `${title.length},${content.length}`).join()]);

  useEffect(() => {
    console.log(`Content Height / Width Changed`);

    if (!gridWidth) {
      console.log(`Missing Grid Width`);
      return;
    }

    (window as any).notesContentHeight = cardsData.map(({ contentHeight }) => !contentHeight);
    if (cardsData.some(({ contentHeight }) => !contentHeight)) {
      console.log(`Missing Content Height`);
      if (cardsData.reduce((a, { contentHeight }, i) => (!contentHeight ? [...a, i] : a), [] as number[]).length > 4)
        debugger;
      return;
    }

    console.log('Calculating Position');

    const numCol = Math.floor(gridWidth / 240);
    console.log(`Number of Columns: ${numCol}`);

    const heights = new Array(numCol).fill(0);
    const dims = cardsData.map<Dimension>(card => {
      const lowestValueIndex = heights.reduce((lvi, v, i, a) => (v < a[lvi] ? i : lvi), 0);
      const dim = {
        visible: true,
        posx: lowestValueIndex * (240 + 16),
        posy: heights[lowestValueIndex],
        width: 240,
        height: card.contentHeight ?? 0,
      };
      heights[lowestValueIndex] += card.contentHeight ? card.contentHeight + 16 : 0;
      return dim;
    });
    setDimensions(dims);
  }, [gridWidth, cardsData.map(({ contentHeight }) => contentHeight).join()]);

  return (
    <motion.div ref={previewGrid} className='preview-grid'>
      {cardsData.map((card, index) => (
        <PreviewCard key={index} {...card} dim={dimensions[index]} />
      ))}
    </motion.div>
  );
}

interface CardProps {
  note: Notes;
  heightCallback?: (height: number) => void;
  dim?: Dimension;
}

function PreviewCard({ note, heightCallback, dim }: CardProps): ReactElement<CardProps> {
  const [animateProperty, setAnimateProperty] = useState<Target>();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (heightCallback) {
        console.log(`Height Changed!!!`);
        heightCallback(ref.current.offsetHeight);
      }
    }
  }, [ref.current, heightCallback]);

  useEffect(() => {
    //When dim or dim?.posx or dim?.posy or dim?.width or dim?.height changed
    //Set the animate property
    setAnimateProperty({
      x: dim?.posx,
      y: dim?.posy,
      width: dim?.width,
      height: dim?.height,
      visibility: dim?.visible ? 'visible' : 'hidden',
    });
  }, [dim, dim?.posx, dim?.posy, dim?.width, dim?.height]);

  return (
    <motion.div
      ref={ref}
      className='preview-card'
      animate={animateProperty} //Use the animate property
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
