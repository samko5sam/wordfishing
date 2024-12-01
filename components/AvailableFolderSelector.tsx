import { useAvailableFolders } from '@/hooks/use-vocabularies';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dispatch, SetStateAction } from 'react';

type Props = {
  selectedFolder: string;
  setSelectedFolder: Dispatch<SetStateAction<string>>;
}

export const AvailableFolderSelector = ({
  selectedFolder,
  setSelectedFolder
}: Props) => {
  const { availableFolders, isFolderLoading } = useAvailableFolders();

  return (
    <div>
      {isFolderLoading ? (
        <p>載入中...</p>
      ) : (
        <Select
          value={selectedFolder}
          onValueChange={(e) => {
            console.log(e);
            setSelectedFolder(e);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="選擇資料夾" />
          </SelectTrigger>
          <SelectContent>
            {availableFolders.map((folder) => (
              <SelectItem key={folder.id} value={folder.id}>
                {folder.folderName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
};