import { useAgentsFilters } from "../../hooks/use-agents-filters";
import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

const AgentsSearchbar = () => {
  const [filters, setFilters] = useAgentsFilters();

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

export default AgentsSearchbar;
