import { useNavigation } from '../modules/navigation/useNavigation';
import { PAGES } from '../modules/navigation/context';
import {
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
} from '../command';
import { forwardRef } from 'react';

const Home = forwardRef<React.ComponentType<typeof CommandList>>(() => {
  const { push } = useNavigation();
  return (
    <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandItem
        value='New Prompt'
        onSelect={() => {
          push(PAGES.NEW_PROMPT);
        }}
      >
        New Prompt
      </CommandItem>
      <CommandGroup heading='History'></CommandGroup>
    </CommandList>
  );
});

export default Home;
