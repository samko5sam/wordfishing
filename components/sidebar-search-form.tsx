import { useState } from 'react';
import { Search } from "lucide-react"

import { Label } from "@/components/ui/label"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar"

type SearchFormProps = {
  onSearch: (query: string) => void;
}

export function SearchForm({ onSearch, ...props }: React.ComponentProps<"form"> & SearchFormProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch(query);
  }

  return (
    <SidebarGroup className="py-0">
      <SidebarGroupContent className="relative">
        <Label htmlFor="search" className="sr-only">
          搜尋
        </Label>
        <SidebarInput
          id="search"
          placeholder="搜尋"
          className="pl-8"
          type='search'
          value={searchQuery}
          onChange={handleSearch}
        />
        <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
