import Cmdk from './cmdk';
import { NavigationProvider } from './modules/navigation/context';
import { InputProvider } from './modules/input/context';

export default function Main() {
  return (
    <NavigationProvider>
      <InputProvider>
        <Cmdk />
      </InputProvider>
    </NavigationProvider>
  );
}
