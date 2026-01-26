"use client";

import { PanelLeftIcon, PanelRightCloseIcon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { useSidebar } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { DashboardCommand } from "./dashboard-command";

export const DashboardNavbar = () => {
  const { open, toggleSidebar } = useSidebar();

  const [isSearchbarOpen, setIsSearchbarOpen] = useState(false);

  const isMac =
    typeof navigator !== "undefined" &&
    navigator.platform.toUpperCase().includes("MAC");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      // Ignore inputs / editable elements
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target instanceof HTMLElement && e.target.isContentEditable)
      ) {
        return;
      }

      const isMac = navigator.platform.toUpperCase().includes("MAC");

      if (
        e.key.toLowerCase() === "k" &&
        (isMac ? e.metaKey : e.ctrlKey && e.shiftKey)
      ) {
        e.preventDefault();
        setIsSearchbarOpen((prev) => !prev);
      } else if (
        e.key.toLowerCase() === "b" &&
        (isMac ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        toggleSidebar();
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [toggleSidebar]);

  return (
    <>
      <DashboardCommand open={isSearchbarOpen} setOpen={setIsSearchbarOpen} />
      <nav className="flex items-center px-2 gap-x-2 py-4 bg-background">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={toggleSidebar}
              className="cursor-pointer hover:bg-muted-foreground/7 hover:text-muted-foreground"
            >
              {open ? <PanelLeftIcon /> : <PanelRightCloseIcon />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>⌘ B</TooltipContent>
        </Tooltip>

        <Button
          className="flex items-center justify-between cursor-pointer w-72 bg-muted-foreground/4 hover:bg-muted-foreground/4"
          variant={"secondary"}
          onClick={() => setIsSearchbarOpen((prev) => !prev)}
        >
          <SearchIcon className="text-muted-foreground/60" />
          <p className="text-xs text-muted-foreground/70 font-sans text-left w-full">
            Search
          </p>
          <Kbd className="bg-muted-foreground/6 py-1 px-2">
            {isMac ? "⌘ K" : "Ctrl ⇧ K"}
          </Kbd>
        </Button>
      </nav>
    </>
  );
};
