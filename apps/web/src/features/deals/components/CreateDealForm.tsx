import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  parseCurrencyToCents,
  useCreateDeal,
} from '@/features/deals/hooks/use-create-deal';
import { Field } from '@/shared/ui/field';

export function CreateDealForm() {
  const {
    leads,
    sellers,
    submit,
    error,
    isLoadingOptions,
    isSubmitting,
  } = useCreateDeal();

  const [title, setTitle] = useState('');
  const [leadId, setLeadId] = useState('');
  const [sellerId, setSellerId] = useState('');
  const [valueLabel, setValueLabel] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    const valueInCents = parseCurrencyToCents(valueLabel);

    if (!title.trim() || !leadId || !sellerId) {
      setFormError('Preencha todos os campos obrigatórios');
      return;
    }

    if (valueInCents === null) {
      setFormError('Informe um valor válido maior que zero');
      return;
    }

    await submit({
      title: title.trim(),
      valueInCents,
      leadId,
      sellerId,
    });
  }

  if (isLoadingOptions) {
    return (
      <p className="text-sm text-muted-foreground">
        Carregando leads e vendedores…
      </p>
    );
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Nome do Negócio" htmlFor="title" required>
          <Input
            id="title"
            name="title"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: Academia FitLife - 12 Esteiras"
            className="h-10"
          />
        </Field>

        <Field label="Lead Vinculado" htmlFor="leadId" required>
          <Select value={leadId} onValueChange={setLeadId}>
            <SelectTrigger id="leadId" className="h-10 w-full">
              <SelectValue placeholder="Buscar lead cadastrado..." />
            </SelectTrigger>
            <SelectContent>
              {leads.map((lead) => (
                <SelectItem key={lead.id} value={lead.id}>
                  {lead.name} ({lead.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field label="Valor Estimado (R$)" htmlFor="value" required>
          <Input
            id="value"
            name="value"
            required
            inputMode="decimal"
            value={valueLabel}
            onChange={(event) => setValueLabel(event.target.value)}
            placeholder="R$ 0,00"
            className="h-10"
          />
        </Field>

        <Field label="Vendedor Responsável" htmlFor="sellerId" required>
          <Select value={sellerId} onValueChange={setSellerId}>
            <SelectTrigger id="sellerId" className="h-10 w-full">
              <SelectValue placeholder="Selecionar vendedor" />
            </SelectTrigger>
            <SelectContent>
              {sellers.map((seller) => (
                <SelectItem key={seller.id} value={seller.id}>
                  {seller.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </div>

      {leads.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Cadastre um lead antes de criar um negócio.
        </p>
      ) : null}

      {sellers.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Cadastre um vendedor antes de criar um negócio.
        </p>
      ) : null}

      {formError || error ? (
        <p className="text-sm text-destructive">{formError ?? error}</p>
      ) : null}

      <div className="flex justify-end gap-2">
        <Button asChild variant="outline">
          <Link to="/negocios">Cancelar</Link>
        </Button>
        <Button
          type="submit"
          disabled={
            isSubmitting || leads.length === 0 || sellers.length === 0
          }
        >
          {isSubmitting ? 'Criando…' : 'Criar Negócio'}
        </Button>
      </div>
    </form>
  );
}
