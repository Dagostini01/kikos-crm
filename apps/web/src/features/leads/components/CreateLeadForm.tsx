import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateLead } from '@/features/leads/hooks/use-create-lead';
import { Field } from '@/shared/ui/field';

export function CreateLeadForm() {
  const { submit, error, isSubmitting } = useCreateLead();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submit({
      name: name.trim(),
      email: email.trim(),
    });
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome Completo" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Roberto Carlos da Silva"
            className="h-10"
          />
        </Field>

        <Field label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="contato@empresa.com.br"
            className="h-10"
          />
        </Field>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/leads">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando…' : 'Salvar Lead'}
        </Button>
      </div>
    </form>
  );
}
