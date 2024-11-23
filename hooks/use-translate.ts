import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";

export const useTranslate = () => {
  const { toast } = useToast();
  const [translatedText, setTranslatedText] = useState('');
  const [loading, setLoading] = useState(false);

  const translate = async (text: string, to: string, from?: string) => {
    try {
      setLoading(true);
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text, to, from }),
      });

      if (response.ok) {
        const data = await response.json();
        setTranslatedText(data[0].translations[0].text);
      } else {
        console.error("Translation failed");
        if (response.status == 401) {
          toast({
            title: "請先登入帳號",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('');
    } finally {
      setLoading(false);
    }
  };

  return { translatedText, translate, translationLoading: loading };
};
