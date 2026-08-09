import { InMemoryDealsRepository } from '@/repositories/in-memory/in-memory-deals-repository.js';
import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';

export function makeDealTestSetup() {
  const leadsRepository = new InMemoryLeadsRepository();
  const sellersRepository = new InMemorySellersRepository();
  const dealsRepository = new InMemoryDealsRepository(leadsRepository, sellersRepository);

  async function createRelations() {
    const lead = await leadsRepository.create({
      name: 'Jane Lead',
      email: 'lead@example.com',
    });
    const seller = await sellersRepository.create({
      name: 'John Seller',
      email: 'seller@example.com',
    });

    return { lead, seller };
  }

  async function createDeal() {
    const { lead, seller } = await createRelations();
    const deal = await dealsRepository.create({
      title: 'New gym',
      valueInCents: 10_000,
      leadId: lead.id,
      sellerId: seller.id,
    });

    return { deal, lead, seller };
  }

  return {
    leadsRepository,
    sellersRepository,
    dealsRepository,
    createRelations,
    createDeal,
  };
}
