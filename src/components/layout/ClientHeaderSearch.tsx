import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export const ClientHeaderSearch = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setIsExpanded(false);
      setSearchQuery("");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to search page with query
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsExpanded(false);
    }
  };

  return (
    <div className="relative flex items-center">
      {isExpanded ? (
        <form onSubmit={handleSearch} className="flex items-center gap-1">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Search projects, requests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-48 sm:w-64 transition-all duration-200"
            onBlur={() => {
              setTimeout(() => {
                if (!searchQuery.trim()) {
                  setIsExpanded(false);
                }
              }, 100);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleSearchToggle}
            className="h-9 w-9 hover:bg-accent/50 shrink-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </form>
      ) : (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSearchToggle}
          className="h-9 w-9 hover:bg-accent/50 transition-all duration-200"
          aria-label="Search"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};