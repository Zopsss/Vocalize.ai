import { SidebarProvider } from "@/components/ui/sidebar";

import { DashboardNavbar } from "@/modules/dashboard/ui/components/dashboard-navbar";
import { DashboardSidebar } from "@/modules/dashboard/ui/components/dashboard-sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="w-screen min-h-screen flex flex-col bg-muted">
        <DashboardNavbar />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
