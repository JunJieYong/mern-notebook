import { ReactElement, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Element, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, RenderLeafProps, Slate, useSlate, withReact } from 'slate-react';
import { IdedNotes } from '../../models/notes';
import { withVerbose } from '../../utils/slate-utils';
import './Preview.css';
import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi';

interface CardProps {
  note?: IdedNotes;
  width: number;
  visible: boolean;
  initialY: number;
  position?: {
    x: number;
    y: number;
  };
  heightCallback: (noteId: string, height: number) => void;
}

const initialValue: Descendant[] = [
  {
    type: 'title',
    children: [{ text: 'Hello World' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing ' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Bold', bold: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Italic', italic: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Underline', underline: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Bold Italic', bold: true, italic: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Bold Underline', bold: true, underline: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Bold Underline', bold: true, underline: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Italic Underline', italic: true, underline: true }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Testing Bold Italic Underline', bold: true, italic: true, underline: true }],
  },
];

export function PreviewCard({ note, heightCallback, width, initialY, visible, position }: CardProps): ReactElement {
  const editor = useMemo(() => withVerbose(withMyPlugins(withHistory(withReact(createEditor())))), []);
  // const renderElement = useCallback((props: RenderElementProps) =>  <Element {...props} />, []);
  const [value, setValue] = useState(initialValue);

  return (
    <div className='popup-content edit-modal'>
      <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
        <Editable className='editor' renderElement={renderElement} renderLeaf={renderLeaf} />
        <Toolbar />
      </Slate>
    </div>
  );
}

function renderElement({ attributes, children, element }: RenderElementProps): ReactElement {
  switch (element.type) {
    case 'title':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-1':
      return <h1 {...attributes}>{children}</h1>;
    case 'heading-2':
      return <h2 {...attributes}>{children}</h2>;
    case 'heading-3':
      return <h3 {...attributes}>{children}</h3>;
    case 'heading-4':
      return <h4 {...attributes}>{children}</h4>;
    case 'heading-5':
      return <h5 {...attributes}>{children}</h5>;
    case 'heading-6':
      return <h6 {...attributes}>{children}</h6>;
    case 'paragraph':
      return <p {...attributes}>{children}</p>;
  }
}

function renderLeaf({ attributes, children, leaf }: RenderLeafProps): ReactElement {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  if (leaf.italic) {
    children = <i>{children}</i>;
  }
  if (leaf.underline) {
    children = <u>{children}</u>;
  }
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }
  return <span {...attributes}>{children}</span>;
}

export function withMyPlugins(editor: Editor): Editor {
  const { normalizeNode } = editor;

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      //Forced Layout
      for (const [child, childPath] of Node.children(editor, path)) {
        const slateIndex = childPath[0];
        if (Element.isElement(child)) {
          if (slateIndex === 0 && child.type != 'title') {
            Transforms.setNodes(editor, { type: 'title' }, { at: childPath });
          } else if (slateIndex !== 0 && child.type == 'title') {
            Transforms.setNodes(editor, { type: 'paragraph' }, { at: childPath });
          }
        }
      }
    }
    return normalizeNode([node, path]);
  };
  return editor;
}

function Toolbar(): ReactElement {
  const editor = useSlate();
  const marks = Editor.marks(editor);

  return (
    <div className='editor-toolbar'>
      <div className={marks?.bold ? 'active' : ''}>
        <BiBold />
      </div>
      <div className={marks?.italic ? 'active' : ''}>
        <BiItalic />
      </div>
      <div className={marks?.underline ? 'active' : ''}>
        <BiUnderline />
      </div>
      <div>
        <span>
          <strong>H1</strong>
        </span>
      </div>
    </div>
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
