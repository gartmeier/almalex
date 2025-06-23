import { AppSidebar } from "~/components/app-sidebar";
import { SidebarProvider } from "~/components/ui/sidebar";

export function loader() {}

export async function clientLoader() {}

export function HydrationFallback() {}

export default function Chat() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main></main>
    </SidebarProvider>
  );
}
