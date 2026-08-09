import { MessageSquare } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Comment } from '@/features/comments/model/types';
import { CommentForm } from '@/features/deals/components/CommentForm';

type DealCommentsProps = {
  comments: Comment[];
  isSubmitting: boolean;
  onSubmit: (content: string) => Promise<void>;
};

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
}

function formatTimestamp(value: string) {
  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function DealComments({
  comments,
  isSubmitting,
  onSubmit,
}: DealCommentsProps) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-base">Comentários</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex max-h-[28rem] flex-1 flex-col gap-3 overflow-y-auto pr-1">
          {comments.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Nenhum comentário ainda
            </p>
          ) : (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="rounded-lg border border-border/60 bg-muted/20 p-3"
              >
                <div className="mb-2 flex items-center gap-2">
                  <Avatar size="sm">
                    <AvatarFallback>
                      {initials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {comment.author.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTimestamp(comment.createdAt)}
                    </p>
                  </div>
                  <MessageSquare className="size-3.5 text-muted-foreground" />
                </div>
                <p className="text-sm leading-relaxed text-foreground/90">
                  {comment.content}
                </p>
              </article>
            ))
          )}
        </div>

        <CommentForm isSubmitting={isSubmitting} onSubmit={onSubmit} />
      </CardContent>
    </Card>
  );
}
