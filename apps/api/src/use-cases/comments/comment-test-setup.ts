import { InMemoryCommentsRepository } from '@/repositories/in-memory/in-memory-comments-repository.js';
import { InMemoryDealsRepository } from '@/repositories/in-memory/in-memory-deals-repository.js';
import { InMemoryLeadsRepository } from '@/repositories/in-memory/in-memory-leads-repository.js';
import { InMemorySellersRepository } from '@/repositories/in-memory/in-memory-sellers-repository.js';
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository.js';

export function makeCommentTestSetup() {
  const leadsRepository = new InMemoryLeadsRepository();
  const sellersRepository = new InMemorySellersRepository();
  const usersRepository = new InMemoryUsersRepository();
  const dealsRepository = new InMemoryDealsRepository(
    leadsRepository,
    sellersRepository,
  );
  const commentsRepository = new InMemoryCommentsRepository(usersRepository);

  async function createAuthor() {
    return usersRepository.create({
      name: 'Auth User',
      email: 'author@example.com',
      passwordHash: 'hashed:123456',
      role: 'MEMBER',
    });
  }

  async function createLead() {
    return leadsRepository.create({
      name: 'Jane Lead',
      email: 'lead@example.com',
    });
  }

  async function createDeal() {
    const lead = await createLead();
    const seller = await sellersRepository.create({
      name: 'John Seller',
      email: 'seller@example.com',
    });
    const deal = await dealsRepository.create({
      title: 'New gym',
      valueInCents: 10_000,
      leadId: lead.id,
      sellerId: seller.id,
    });

    return { lead, seller, deal };
  }

  return {
    leadsRepository,
    sellersRepository,
    usersRepository,
    dealsRepository,
    commentsRepository,
    createAuthor,
    createLead,
    createDeal,
  };
}
