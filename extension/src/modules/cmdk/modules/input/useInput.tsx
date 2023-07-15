import { useContext } from 'react';
import { InputContext } from '~modules/cmdk/modules/input/context';

export default function useInput() {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error('useInput must be used within a InputProvider');
  }
  return context;
}
