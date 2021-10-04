import { Notes } from '../models/notes';

export const notesData: Notes[] = [
  {
    title: 'Hello World',
    content: 'Aliqua quis occaecat amet culpa ex.',
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    title: 'Second Note',
    content:
      'Consectetur enim magna duis laboris veniam. Nostrud fugiat nostrud tempor occaecat aliqua labore amet minim duis aliquip enim commodo eiusmod. Irure esse ut magna voluptate veniam ut amet eu veniam fugiat enim. Non Lorem occaecat labore ad excepteur id id nulla sint exercitation. Qui anim veniam do officia labore ad laboris amet esse esse enim deserunt officia. Dolore laborum deserunt elit ut. Laboris veniam reprehenderit Lorem laboris aliqua commodo.',
    author: 'System',
    date: new Date('09/26/2021'),
  },
  {
    title: 'Third Note',
    content: 'Velit pariatur in dolor ipsum est nostrud in tempor.',
    author: 'System',
    date: new Date('09/30/2021'),
  },
  {
    title: 'Fifth Note',
    content: 'Esse reprehenderit elit exercitation enim aliquip pariatur deserunt laborum velit nisi labore proident.',
    author: 'System',
    date: new Date('10/09/2021'),
  },
];

export default notesData;
