import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import Header from "./Header";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      <Header />
      <ScrollArea className="flex-grow">
        <main className="container mx-auto px-4 py-8 animate-fade-in min-h-[calc(100vh-6rem)]">
          {children}
        </main>
      </ScrollArea>
    </div>
  );
};

export default Layout;
