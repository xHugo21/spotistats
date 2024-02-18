"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

let timeInterval: string = "4w"; // TODO: manage on value change DropdownRadioGroup

export default function Home() {
  return (
    <main className="p-24">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">Time Interval</Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>Select One</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={timeInterval}>
            <DropdownMenuRadioItem value="4w">4 weeks</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="6m">6 months</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="at">All Time</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </main>
  );
}
