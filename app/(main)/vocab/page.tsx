import * as React from 'react';
import { AppSidebar } from '@/components/vocab-sidebar';
import { FolderIcon } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';

// Placeholder vocabulary data
const vocabularyData = [
  {
    id: 1,
    word: 'Vocabulary',
    definition: 'A collection of words that an individual knows',
    folder: 'general',
  },
  {
    id: 2,
    word: 'Lexicon',
    definition: 'The vocabulary of a person, language, or branch of knowledge',
    folder: 'general',
  },
  {
    id: 3,
    word: 'Semantics',
    definition: 'The study of meaning in language',
    folder: 'linguistics',
  },
  {
    id: 4,
    word: 'Morphology',
    definition: 'The study of the forms of words and how they are formed',
    folder: 'linguistics',
  },
  {
    id: 5,
    word: 'Vocabulary',
    definition: 'A collection of words that an individual knows',
    folder: 'general',
  },
  {
    id: 6,
    word: 'Lexicon',
    definition: 'The vocabulary of a person, language, or branch of knowledge',
    folder: 'general',
  },
  {
    id: 7,
    word: 'Semantics',
    definition: 'The study of meaning in language',
    folder: 'linguistics',
  },
  {
    id: 8,
    word: 'Morphology',
    definition: 'The study of the forms of words and how they are formed',
    folder: 'linguistics',
  },
];

// Placeholder vocabulary folder data
const vocabularyFolders = [
  {
    title: '一般',
    url: '/vocab/general',
  },
  {
    title: '語言學',
    url: '/vocab/linguistics',
  },
  {
    title: '自然科學',
    url: '/vocab/science',
  },
  {
    title: '歷史',
    url: '/vocab/history',
  },
];

export default function VocabularyPage() {
  return (
    <div className="flex-1 flex h-full overflow-hidden">
      <AppSidebar folders={vocabularyFolders} className="border-r pt-[48px]" />
      <div className="flex-1 max-h-full overflow-y-scroll">
        <div className='p-4'>
          <SidebarTrigger className='p-4' />
        </div>
        <div className='px-8'>
          <h1 className="text-2xl font-bold mb-4">單字庫</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {vocabularyData.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-100 rounded-lg dark:bg-gray-800 shadow p-4 relative">
                <h2 className="text-lg font-bold dark:text-gray-200">{item.word}</h2>
                <p className='mb-8 dark:text-gray-200'>{item.definition}</p>
                <span className="absolute bottom-2 text-gray-500 dark:text-gray-130 mt-2 flex flex-row items-center gap-2">
                  <FolderIcon size={16} /> {item.folder}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
