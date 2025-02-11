import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import { Button } from "@/components/ui/button";

export function CustomDropdownMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          {/* Icon or text for the button */}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onSelect={() => console.log("Item 1 selected")}>
          Item 1
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => console.log("Item 2 selected")}>
          Item 2
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}