import { Button } from "@/components/ui/button";
import { TTSButton } from "@/components/ui/TTSButton";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { Star, StarOff } from "lucide-react";

type Vocab = {
  title: string;
  description: string;
  marked?: boolean;
};

type VocabListItemProps = {
  vocab: Vocab;
  toggleMarked: () => void;
};

function VocabListItem({ vocab, toggleMarked }: VocabListItemProps) {
  return (
    <div className="flex items-center rounded-xl border bg-card text-card-foreground shadow px-4 py-4">
      <TTSButton lang="en" text={vocab.title} />
      <div className="flex-1">
        <strong>{vocab.title}</strong>
      </div>
      <div className="flex-1">
        {vocab.description}
      </div>
      <Button variant="ghost" onClick={toggleMarked}>
        {vocab.marked ? <StarFilledIcon /> : <Star />}
      </Button>
    </div>
  );
}

export default VocabListItem;
