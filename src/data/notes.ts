import { Notes } from '../models/notes';

export const notesData: Notes[] = [
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'First Note' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Laboris anim duis duis consequat ea est dolore commodo commodo amet elit commodo dolor.' }],
      },
    ],
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'Second Note' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Elit non commodo ipsum cupidatat pariatur cillum quis sunt.' },
          { text: 'Deserunt deserunt anim aliqua ullamco.' },
        ],
      },
    ],
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    descendant: [
      {
        type: 'title',
        children: [{ text: 'Third Note' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Laboris anim duis duis consequat ea est dolore commodo commodo amet elit commodo dolor.' },
          { text: 'Ut officia velit aute est nulla dolor.', bold: true },
          { text: 'Ut enim occaecat nulla tempor.', italic: true },
          { text: 'Velit qui ut eiusmod pariatur enim ut ex pariatur culpa.', underline: true },
        ],
      },
    ],
    author: 'System',
    date: new Date('09/30/2021'),
  },
];

export default notesData;
