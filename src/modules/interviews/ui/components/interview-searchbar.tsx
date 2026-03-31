import { useInterviewsFilters } from "../../hooks/use-interview-filters";
import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const InterviewSearchbar = () => {
  const [filters, setFilters] = useInterviewsFilters();

  return (
    <InputGroup className="bg-background max-w-72">
      <InputGroupInput
        placeholder="Search..."
        value={filters.search}
        onChange={(e) =>
          setFilters({
            page: filters.page,
            search: e.target.value,
          })
        }
      />
      <InputGroupAddon>
        <SearchIcon />
      </InputGroupAddon>
    </InputGroup>
  );
};

export default InterviewSearchbar;
