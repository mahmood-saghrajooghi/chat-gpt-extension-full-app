import { forwardRef } from 'react';
import { Page } from '../context';
import { useNavigation } from '../useNavigation';

export interface RouteProps { page: Page, component: React.ForwardRefExoticComponent<any> }

const Route = forwardRef<HTMLDivElement, RouteProps>(({ page, component: Component }, ref) => {
  const { activePage } = useNavigation();
  if(activePage !== page) {
    return null;
  }
  return <Component ref={ref} />;
});

export default Route;
