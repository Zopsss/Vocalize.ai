import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const DataPagination = ({ page, totalPages, onPageChange }: Props) => {
  return (
    <div className="flex items-center justify-between">
      <div className="text-foreground">
        Page {page} of {totalPages}
      </div>
      <ButtonGroup className="h-fit">
        <Button
          variant="outline"
          disabled={page === 1}
          onClick={() => onPageChange(Math.max(1, page - 1))}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          disabled={page === totalPages}
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
        >
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default DataPagination;
