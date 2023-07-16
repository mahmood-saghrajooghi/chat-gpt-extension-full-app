// Imports
// ========================================================
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../../backend/src/trpc/router';

// Config
// ========================================================
const trpc = createTRPCReact<AppRouter>();

// Exports
// ========================================================
export default trpc;
