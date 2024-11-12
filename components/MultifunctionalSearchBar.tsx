/* eslint-disable react-hooks/exhaustive-deps */
"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Link, TextCursorInput, Loader2, Music2 } from "lucide-react";
import { useDebounce } from "@uidotdev/usehooks";
import { lyricsApiRoot } from "@/constants/Constants";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from 'next/navigation';
import { Textarea } from "@/components/ui/textarea";

interface Suggestion {
  id: string | number;
  title: string;
  artist: {
    name: string;
  }
}

export default function MultifunctionalSearchBar() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [inputTypeInfer, setInputTypeInfer] = useState<"search" | "link" | "text">("search");
  const [icon, setIcon] = useState(<Search />);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debouncedQuery = useDebounce(inputValue, 300);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const suggestionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const searchbarRef = useRef<HTMLDivElement>(null);

  // Determine the icon and action based on the input type
  const updateIconAndAction = (value: string) => {
    setInputValue(value);

    if (isValidUrl(value)) {
      setInputTypeInfer("link");
      setIcon(<Link />);
    } else if (value.length > 50) {
      setInputTypeInfer("text");
      setIcon(<TextCursorInput />);
    } else {
      setInputTypeInfer("search");
      setIcon(<Search />);
    }
  };

  // URL validation
  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  // Fetch suggestions
  const fetchSuggestions = async () => {
    if (debouncedQuery) {
      setLoading(true);
      try {
        if (inputTypeInfer === "search") { // This checks if it's a search-type input
          const response = await fetch(`${lyricsApiRoot}/suggest/${debouncedQuery}`);
          const data = await response.json();
          console.log(data);
          setSuggestions(data.data);
          setShowSuggestions(true);
        } else if (inputTypeInfer === "text") {
          // Call another API if needed for long text
          setShowSuggestions(false);
        } else if (inputTypeInfer === "link") {
          setSuggestions([]); // No suggestions for URLs
          setShowSuggestions(false);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        setSuggestions([]);
        setShowSuggestions(false);
      } finally {
        setLoading(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  // Handle different actions on submit
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    if (isValidUrl(inputValue)) {
      console.log("URL: " + inputValue); // Open URL
      router.push(`/import/article?url=${inputValue}`)
    } else if (inputValue.length > 100) {
      alert("Long text detected. Performing a long text analysis.");
      // Add custom action for long text
    } else if (selectedIndex !== -1) {
      const suggestion = suggestions[selectedIndex];
      console.log(`Searching for "${suggestion.title}"`);
      // Perform lyrics
    } else {
      console.log("Search");
      window.open(`https://duckduckgo.com/?start=1&q=${inputValue}&ia=web`);
      // perform search
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key.toLowerCase() === "arrowdown") {
      e.preventDefault()
      setSelectedIndex(prev => (prev < suggestions.length - 1 ? prev + 1 : prev))
    } else if (e.key.toLowerCase() === "arrowup") {
      e.preventDefault()
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
    } else if (e.key.toLowerCase() === "enter" && selectedIndex !== -1) {
      handleSuggestionSelect(suggestions[selectedIndex])
      e.preventDefault()
    } else if (e.key.toLowerCase() === "enter" && inputTypeInfer !== "text"){
      e.preventDefault()
      handleSubmit()
    }
  }

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    setShowSuggestions(false)
    console.log(`Selected: ${suggestion.title} by ${suggestion.artist.name}`)
    // Navigate to docs page first, it will redirect to import if needed
    router.push(`/docs/lyrics/${suggestion.artist.name}/${suggestion.title}`);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchbarRef.current && !searchbarRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  useEffect(() => {
    fetchSuggestions();
  }, [debouncedQuery]);
  useEffect(() => {
    if (selectedIndex !== -1 && suggestionRefs.current[selectedIndex]) {
      suggestionRefs.current[selectedIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    }
  }, [selectedIndex])
  
  return (
    <form onSubmit={handleSubmit} className="flex items-end w-full max-w-lg mx-auto mt-4 px-4">
      <div className="relative w-full max-w-lg mx-auto" ref={searchbarRef}>

      <Textarea
        placeholder="搜尋歌詞、輸入網址或貼上文章內容"
        value={inputValue}
        onKeyDown={handleKeyDown}
        onChange={(e) => updateIconAndAction(e.target.value)}
        onFocus={() => {
          if (suggestions.length) setShowSuggestions(true);
        }}
        rows={inputTypeInfer === "text" ? 12 : 12}
        className={inputTypeInfer === "text" ? "p-4 w-full resize-none whitespace-pre-wrap" : "rounded-l-full px-6 h-[48px] w-full py-[15px] text-[14px] resize-none overflow-hidden min-h-0"}
      />

      {showSuggestions && (
        <div className="absolute w-full mt-1 bg-white border rounded-md shadow-lg z-10">
          <ScrollArea className="h-[300px]">
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.id.toString()}
                  ref={(el: HTMLDivElement | null) => {
                    suggestionRefs.current[index] = el;
                  }}
                  className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer ${
                    index === selectedIndex ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  onMouseEnter={() => setSelectedIndex(index)}
                >
                  <Music2 className="mr-2 h-4 w-4" />
                  <span>{suggestion.title} - {suggestion.artist.name}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">找不到推薦...</div>
            )}
          </ScrollArea>
        </div>
      )}
      </div>
      <Button type="submit" className="rounded-r-full p-6">
        {loading ? <Loader2 className="animate-spin" /> : icon}
      </Button>
    </form>
  );
}
