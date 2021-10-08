import { motion } from "framer-motion";
import { ReactElement, useRef, useEffect, useMemo, useState } from "react";
import { createEditor, Descendant } from "slate";
import { withReact } from "slate-react";
import { IdedNotes } from "../../models/notes";

import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}


interface CardProps {
  note?: IdedNotes;
  width: number;
  visible: boolean;
  initialY: number;
  position?: {
    x: number,
    y: number
  };
  heightCallback: (noteId: string, height: number) => void;
}

export function PreviewCard({ note, heightCallback, width, initialY, visible, position }: CardProps): ReactElement {



  return (
    <motion.div>

    </motion.div>
  );
}

export default PreviewCard;



// export function PreviewCard({ note, heightCallback, width, initialY, visible, position }: CardProps): ReactElement {
//   const visibility = visible ? 'visible' : 'hidden';
//   const ref = useRef<HTMLDivElement>(null);
//   useEffect(() => {
//     if (ref.current) {
//       console.log(`Height Changed!!!`);
//       heightCallback(note._id, ref.current.offsetHeight);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [ref.current?.offsetHeight, note]);

//   return (
//     <motion.div
//       ref={ref}
//       className='preview-card'
//       style={{ width, visibility }}
//       initial={{ y: initialY }}
//       animate={{ ...position }} //Use the animate property
//       transition={{
//         damping: 100,
//       }}
//     >
//       <div className='preview-header'>
//         <div className='preview-title'>{note.title}</div>
//       </div>
//       <div className='preview-content'>{note.content}</div>
//     </motion.div>
//   );
// }

// export default PreviewCard;