import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateSeller } from '@/features/sellers/hooks/use-create-seller';
import { Field } from '@/shared/ui/field';

export function CreateSellerForm() {
  const { submit, error, isSubmitting } = useCreateSeller();
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
        <Field label="Nome" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ex: Lucas Ramos"
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
            placeholder="vendedor@kikos.com.br"
            className="h-10"
          />
        </Field>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link to="/vendedores">Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? 'Salvando…' : 'Salvar Vendedor'}
        </Button>
      </div>
    </form>
  );
}
