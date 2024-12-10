import { Button } from "./button";
import { SpeakerModerateIcon } from "@radix-ui/react-icons";

type TTSButtonProps = {
  text: string;
  lang?: string;
};

export function TTSButton({ text, lang }: TTSButtonProps) {
  const isSpeechSynthesisAvailable = typeof window !== 'undefined' && 'speechSynthesis' in window;

  const handleClick = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    if (lang) {
      utterance.lang = lang;
    }
    window.speechSynthesis.speak(utterance);
  };

  if (!isSpeechSynthesisAvailable) {
    return null;
  }

  return (
    <button onClick={handleClick} className="w-5 h-5">
      <SpeakerModerateIcon />
    </button>
  );
}
