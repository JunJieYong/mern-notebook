import { BaseEditor, Descendant, Text } from 'slate';
import { HistoryEditor } from 'slate-history';
import { ReactEditor } from 'slate-react';

type TitleElement = {
  type: 'title';
  children: Text[];
};

type HeadingElement<H extends 1 | 2 | 3 | 4 | 5 | 6> = {
  type: `heading-${H}`;
  children: Descendant[];
};

type ParagraphElement = {
  type: 'paragraph';
  children: Descendant[];
};

type CustomElement = ParagraphElement | TitleElement | HeadingElement<1 | 2 | 3 | 4 | 5 | 6>;

type CustomText = {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
};

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
