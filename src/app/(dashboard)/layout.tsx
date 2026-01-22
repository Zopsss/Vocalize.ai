import { SidebarProvider } from "@/components/ui/sidebar";

import DashboardSidebar from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-screen h-screen flex flex-col bg-muted">
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
