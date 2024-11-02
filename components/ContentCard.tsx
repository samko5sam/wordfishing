import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { removeHtmlTags } from '@/lib/sanitize';

interface ContentCardProps {
  title: string;
  contentType: "article" | "lyrics";
  id: string;
  createdAt: string;
  content: string;
  artist?: string;
  onClick?: () => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ 
  title, 
  contentType, 
  id, 
  createdAt, 
  content, 
  artist 
}) => {
  return (
    <Link href={contentType === "article" ? `/docs/article/${id}` : `/docs/lyrics/${artist}/${title}`}>
      <Card className="hover:shadow-lg transition-shadow">
        <CardContent className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
          {!!artist && <p className="text-sm text-gray-500 mb-2">by {artist}</p>}
          <p className="text-sm text-gray-500 line-clamp-3">{removeHtmlTags(content)}</p>
          <div className="mt-2 text-xs text-gray-400">
            {new Date(createdAt || "").toLocaleDateString()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ContentCard;
