import { MouseEventHandler, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Editor, Element, Node, Transforms } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, RenderLeafProps, Slate, useSlate, withReact } from 'slate-react';
import { IdedNotes } from '../../models/notes';
import { withVerbose } from '../../utils/slate-utils';
import './Preview.css';
import { BiBold, BiItalic, BiUnderline } from 'react-icons/bi';
import { motion, Variants } from 'framer-motion';

export interface ModalLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CardProps {
  note: IdedNotes;
  width: number;
  visible: boolean;
  initialY: number;
  gridPosition?: {
    x: number;
    y: number;
  };
  modalLayout?: ModalLayout;
  heightCallback: (noteId: string, height: number) => void;
}

// @refresh reset
export function PreviewCard({
  note,
  heightCallback,
  width,
  initialY,
  visible,
  gridPosition,
  modalLayout,
}: CardProps): ReactElement {
  const visibility = visible ? 'visible' : 'hidden';
  const ref = useRef<HTMLDivElement>(null);
  const editor = useMemo(() => withVerbose(withMyPlugins(withHistory(withReact(createEditor())))), []);
  const [value, setValue] = useState(note?.descendant);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const onBackgroundClick: MouseEventHandler<HTMLDivElement> = e => {
    console.log('Click Background');
    setIsEditing(false);
    e.stopPropagation();
  };

  const onPreviewClick: MouseEventHandler<HTMLDivElement> = e => {
    console.log('Click Note');
    if (!isEditing) {
      setIsEditing(true);
    }
    e.stopPropagation();
  };

  useEffect(() => {
    if (ref.current) {
      console.log(`Height Changed!!!`);
      heightCallback(note._id, ref.current.offsetHeight);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current?.offsetHeight, note]);

  const varients: Variants = {
    initial: {
      y: initialY,
    },
    grid: {
      height: undefined,
      ...gridPosition,
    },
    modal: {
      ...modalLayout,
    },
  };

  return (
    <div className={isEditing ? 'editor-background' : ''} onClick={onBackgroundClick}>
      <motion.div
        ref={ref}
        className={isEditing ? 'popup-content edit-modal' : 'preview-card'}
        variants={varients}
        style={{ width, visibility }}
        initial='initial'
        animate={isEditing ? 'modal' : 'grid'}
        transition={{ damping: 100 }}
        onClick={onPreviewClick}
      >
        <Slate editor={editor} value={value} onChange={newValue => setValue(newValue)}>
          <Editable className='editor' renderElement={renderElement} renderLeaf={renderLeaf} readOnly={!isEditing} />
          {isEditing && <Toolbar />}
        </Slate>
      </motion.div>
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
