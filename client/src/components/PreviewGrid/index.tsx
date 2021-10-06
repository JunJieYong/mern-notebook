import { ReactElement, useEffect, useRef, useState } from 'react';
import './PreviewGrid.css';
import { Notes } from '../../models/notes';
import { motion, TargetAndTransition } from 'framer-motion';

interface GridProps {
  notes: Notes[];
}

interface UIData {
  cardsData: UICardData[];
}

interface UICardData {
  card: {
    props: CardProps & { key: number };
  };
  heightPromise: Promise<number>;
}

interface UIColData {
  height: number;
  cardDataIndex: [];
}

function PreviewGrid({ notes }: GridProps): ReactElement {
  const [columnHeights, setColumnHeights] = useState(new Array(4).fill(0));
  const [UICardState, setUICardState] = useState<UICardData[]>([]);

  useEffect(() => {
    console.log('Init');
    const cardsData = notes.map<UICardData>((note, index) => {
      let resolver: (height: number) => void;
      const heightCallback = (height: number) => resolver(height);
      return {
        heightPromise: new Promise<number>(resolve => (resolver = resolve)),
        // card: <PreviewCard {...{ key: index, note, heightCallback, dim: UICardState[index]?.dim }} />,
        card: {
          props: {
            key: index,
            note,
            heightCallback,
            visible: false,
          },
        },
      };
    });
    setUICardState(cardsData);
    Promise.all(cardsData.map(({ heightPromise }) => heightPromise)).then(heights => {
      //prettier-ignore
      setUICardState(cardsData.map<UICardData>((d, i) => ({ ...d, card: {props: {...d.card.props, dim: {height: heights[i]}}}})));
    });
  }, [notes]);

  useEffect(() => {
    if (UICardState.length === 0) {
      console.log(`Awaiting Init `);
      return;
    }

    //prettier-ignore
    if (UICardState.some(({ card: {props: {dim}} }) => !dim?.height)) {
      console.log(`Awaiting Height`);
      return;
    }

    //prettier-ignore
    if ( UICardState.every(({ card: {props: {dim}} }) => dim && dim.posx !== undefined && dim.posy !== undefined && dim.width !== undefined)) {
      console.log(`No Change`);
      return;
    }

    console.log('Running Calculation', UICardState);

    const heights = [...columnHeights];
    const cardState = UICardState.map<UICardData>(d => {
      if (d.card.props.dim === undefined) return d;

      const lowestValueIndex = heights.reduce((lvi, v, i, a) => (v < a[lvi] ? i : lvi), 0);
      const data: UICardData = {
        ...d,
        card: {
          props: {
            ...d.card.props,
            visible: true,
            dim: {
              posx: lowestValueIndex * (240 + 16),
              posy: heights[lowestValueIndex] + 16 ,
              width: 240,
              height: d.card.props.dim.height,
            },
          },
        },
      };
      heights[lowestValueIndex] = heights[lowestValueIndex] + d.card.props.dim.height + 16;
      return data;
    });
    setColumnHeights(heights);
    setUICardState(cardState);
    // debugger;
  }, [UICardState]);

  return (
    <motion.div className='preview-grid'>
      {UICardState.map(({ card: { props } }) => (
        <PreviewCard {...props} />
      ))}
    </motion.div>
  );
}

interface CardProps {
  note: Notes;
  visible?: boolean;
  heightCallback: (height: number) => void;
  dim?: {
    height?: number;
    width?: number;
    posx?: number;
    posy?: number;
  };
}

function PreviewCard({ note, visible, heightCallback, dim }: CardProps): ReactElement<CardProps> {
  const [animate, setAnimate] = useState<TargetAndTransition>();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (ref.current) {
      if (heightCallback) heightCallback(ref.current.offsetHeight);
    }
  }, [ref.current]);

  useEffect(() => {
    const animateProp: TargetAndTransition = {
      x: dim?.posx,
      y: dim?.posy,
      width: dim?.width,
      height: dim?.height,
    };
    setAnimate(animateProp);
  }, [dim, dim?.posx, dim?.posy, dim?.width, dim?.height]);

  console.log(`Redered`);
  return (
    <motion.div ref={ref} className='preview-card' style={{visibility: visible ? 'visible' : 'hidden'}} animate={animate}>
      <div className='preview-header'>
        <div className='preview-title'>{note.title}</div>
      </div>
      <div className='preview-content'>{note.content}</div>
    </motion.div>
  );
}

export default PreviewGrid;
