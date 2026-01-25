import { Dispatch, SetStateAction } from "react";

import {
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
} from "@/components/ui/command";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandItem>Test</CommandItem>
        <CommandItem>Neko-Chan</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  );
};

export default DashboardCommand;
