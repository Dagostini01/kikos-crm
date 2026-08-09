import { ArrowRight } from 'lucide-react';
import { useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type CommentFormProps = {
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
};

export function CommentForm({ isSubmitting, onSubmit }: CommentFormProps) {
  const [content, setContent] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = content.trim();

    if (!trimmed) {
      return;
    }

    await onSubmit(trimmed);
    setContent('');
  }

  return (
    <form className="flex items-end gap-2" onSubmit={handleSubmit}>
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Escreva um comentário ou atualize as tratativas..."
        className="min-h-20 flex-1 resize-none"
        required
      />
      <Button
        type="submit"
        size="icon"
        disabled={isSubmitting || !content.trim()}
        aria-label="Enviar comentário"
      >
        <ArrowRight />
      </Button>
    </form>
  );
}
