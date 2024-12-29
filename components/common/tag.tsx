import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Tag = () => {
  return (
    <Popover>
      <PopoverTrigger>
        <Button variant={"link"} className="h-max w-max p-0 text-sm">
          Tag followers
        </Button>
      </PopoverTrigger>

      <PopoverContent>
        <h1>Search content</h1>
      </PopoverContent>
    </Popover>
  );
};

export default Tag;
