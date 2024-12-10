import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { removeHtmlTags } from "@/lib/sanitize";
import { ContentActionDropdown } from "./ContentActionDropdown";

interface ContentCardProps {
  title: string;
  contentType: "articles" | "lyrics" | "text";
  id: string;
  createdAt: string;
  content: string;
  artist?: string;
  onClick?: () => void;
  onDeleteSuccess?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({
  title,
  contentType,
  id,
  createdAt,
  content,
  artist,
  onDeleteSuccess
}) => {
  const redirectUrl = () => {
    switch (contentType) {
      case "articles":
        return `/docs/article/${id}`
      case "text":
        return `/docs/text/${id}`
      case "lyrics":
        return `/docs/lyrics/${artist}/${title}`;
      default:
        return '';
    }
  }
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <Link
          href={redirectUrl()}
        >
          <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
          {!!artist && (
            <p className="text-sm text-gray-500 mb-2">by {artist}</p>
          )}
          <p className="text-sm text-gray-500 line-clamp-3">
            {removeHtmlTags(content)}
          </p>
        </Link>
        <div className="mt-2 text-xs text-gray-400 flex flex-row justify-between items-end">
          <span>{new Date(createdAt || "").toLocaleDateString()}</span>
          <div>
            <ContentActionDropdown contentType={contentType} documentId={id} onDeleteSuccess={onDeleteSuccess} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentCard;
