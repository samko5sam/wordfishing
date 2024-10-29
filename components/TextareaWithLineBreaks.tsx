import { useState, ClipboardEvent, ChangeEvent, FC } from 'react';
import { Textarea } from './ui/textarea';

interface TextAreaWithLineBreaksProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextAreaWithLineBreaks: FC<TextAreaWithLineBreaksProps> = ({ onChange, ...props }) => {
  const [text, setText] = useState('');

  const handlePaste = (e: ClipboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    setText((prevText) => prevText + pastedText);
  };

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
      onPaste={handlePaste}
      style={{ whiteSpace: 'pre-wrap' }}
      {...props}
    />
  );
};

export default TextAreaWithLineBreaks;