export type { AppRouter } from 'trpc/router';

// Export any backend type, object, array etc. that should be shared with frontend
type Square = {
  shape: 'square';
  size: number;
};
type Rectangle = {
  shape: 'rectangle';
  width: number;
  height: number;
};
export type Shape = Square | Rectangle;

export const SharedSquareObject: Shape = {
  shape: 'square',
  size: 50,
};
