import { CSSProperties, MouseEventHandler, ReactElement, useEffect, useMemo, useRef, useState } from 'react';
import { createEditor, Editor, Element, Node, Transforms, Text } from 'slate';
import { withHistory } from 'slate-history';
import { Editable, RenderElementProps, RenderLeafProps, Slate, useSlate, withReact } from 'slate-react';
import { IdedNotes } from '../../models/notes';
import { withVerbose } from '../../utils/slate-utils';
import './Preview.css';
import { BiBold, BiItalic, BiTrash, BiUnderline } from 'react-icons/bi';
import { motion, Variants } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { confirmDeleteNote, editNotes, notesSelector, NotesStatus, saveNote } from '../../slices/noteSlice';

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
  const dispatch = useAppDispatch();
  const visibility = visible ? 'visible' : 'hidden';
  const ref = useRef<HTMLDivElement>(null);
  const editor = useMemo(() => {
    const editor = withVerbose(withMyPlugins(withHistory(withReact(createEditor()))));
    return editor;
  }, []);
  const [noteValue, setNoteValue] = useState(note?.descendant);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { editingId, status } = useAppSelector(notesSelector);
  const [debId, setDebId] = useState<number>();

  useEffect(() => {
    if (status === NotesStatus.Editing && (editingId === note._id || note._id === 'new')) setIsEditing(true);
    else setIsEditing(false);
  }, [note._id, status, editingId]);

  const onBackgroundClick: MouseEventHandler<HTMLDivElement> = e => {
    console.log('Click Background');
    dispatch(
      saveNote({
        _id: note._id,
        descendant: noteValue,
        history: editor.history,
      }),
    );
    e.stopPropagation();
  };

  const onPreviewClick: MouseEventHandler<HTMLDivElement> = e => {
    console.log('Click Note');
    if (!isEditing) {
      dispatch(editNotes(note));
    }
    e.stopPropagation();
  };

  const onTrashClick: MouseEventHandler<HTMLDivElement> = e => {
    dispatch(confirmDeleteNote({ id: note._id }));
    e.stopPropagation();
  };

  useEffect(() => {
    if (debId) clearTimeout(debId);
    setDebId(
      window.setTimeout(() => {
        if (ref.current) {
          console.log(`Height Changed!!!`);
          heightCallback(note._id, ref.current.offsetHeight);
          setDebId(-1);
        }
      }, 700),
    );
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

  const style: CSSProperties = isEditing ? {visibility} : { width, visibility, minWidth: width, maxWidth: width }

  return (
    <div className={isEditing ? 'editor-background' : ''} onClick={onBackgroundClick}>
      <motion.div
        ref={ref}
        className={isEditing ? 'edit-modal' : 'preview-card'}
        variants={varients}
        style={style}
        initial='initial'
        animate={isEditing ? 'modal' : 'grid'}
        transition={{ damping: 100 }}
        onClick={onPreviewClick}
      >
        <Slate editor={editor} value={noteValue} onChange={newValue => setNoteValue(newValue)}>
          {isEditing || <div className='trash' onClick={onTrashClick} children={<BiTrash />} />}
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
      //prettier-ignore
      return <h3 className='editor-title' {...attributes}>{children}</h3>;
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
          if (slateIndex === 0 && child.type !== 'title') {
            Transforms.setNodes(editor, { type: 'title' }, { at: childPath });
          } else if (slateIndex !== 0 && child.type === 'title') {
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
  const node = Array.from(Editor.nodes(editor, { match: n => !Editor.isEditor(n) && Element.isElement(n) }))[0]?.[0] as
    | Element
    | undefined;
  const [headingExpand, setHeadingExpand] = useState(false);
  console.log('Toolbar', node);

  const renderHeadingBtn = () => {
    return new Array(7).fill(undefined).map((v, i) => {
      const h = i as 0 | 1 | 2 | 3 | 4 | 5 | 6;
      const active = h === 0 ? !node?.type?.startsWith('heading') : node?.type === `heading-${h}`;
      return (
        (headingExpand || active) && (
          <motion.div
            layout='position'
            className={h !== 0 && active ? 'active' : ''}
            onMouseDown={e => {
              e.preventDefault();
              if (!active) {
                const type = (h === 0 ? 'paragraph' : `heading-${h}`) as Element['type'];
                Transforms.setNodes(editor, { type });
              }
            }}
          >
            <span>
              <strong>{h ? `H${h}` : `P`}</strong>
            </span>
          </motion.div>
        )
      );
    });
  };

  const formats: (keyof Omit<Text, 'text'>)[] = ['bold', 'italic', 'underline'];
  const renderMarkBtn = (): ReactElement[] =>
    formats.map((format, i) => {
      return (
        <div
          className={marks?.[format] ? 'active' : ''}
          onMouseDown={e => {
            e.preventDefault();
            marks?.[format] ? Editor.removeMark(editor, format) : Editor.addMark(editor, format, true);
          }}
        >
          {format === 'bold' ? <BiBold /> : format === 'italic' ? <BiItalic /> : <BiUnderline />}
        </div>
      );
    });

  return (
    <div
      className='editor-toolbar'
      onMouseEnter={() => setHeadingExpand(true)}
      onMouseLeave={() => setHeadingExpand(false)}
    >
      {renderMarkBtn()}
      <motion.div layout className='headings'>
        {renderHeadingBtn()}
      </motion.div>
    </div>
  );
}

export default PreviewCard;
