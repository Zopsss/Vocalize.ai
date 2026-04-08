import { useInterviewsFilters } from "../../hooks/use-interview-filters";
import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

export const InterviewSearchbar = () => {
  const [filters, setFilters] = useInterviewsFilters();

  return (
    <InputGroup className="bg-background max-w-72">
      <InputGroupInput
        placeholder="Search..."
        value={filters.search}
        onChange={(e) => setFilters({ search: e.target.value, page: 1 })}
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};
