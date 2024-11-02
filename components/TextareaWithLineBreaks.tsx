import { useState, ChangeEvent, FC } from 'react';
import { Textarea } from '@/components/ui/textarea';

interface TextAreaWithLineBreaksProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaWithLineBreaks: FC<TextAreaWithLineBreaksProps> = ({ onChange, ...props }) => {
  const [text, setText] = useState('');

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    if (onChange) {
      onChange(e); // Call the passed onChange prop if it exists
    }
  };

  return (
    <Textarea
      value={text}
      onChange={handleTextChange}
      style={{ whiteSpace: 'pre-wrap' }}
      {...props}
    />
  );
};

export default TextAreaWithLineBreaks;
