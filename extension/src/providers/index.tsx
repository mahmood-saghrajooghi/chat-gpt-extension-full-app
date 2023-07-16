import QueryProvider from "./queryPreovider"
import TRPCProvider from "./trpcProvider"

const RootProvider = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <TRPCProvider>{children}</TRPCProvider>
  </QueryProvider>
)

export default RootProvider
