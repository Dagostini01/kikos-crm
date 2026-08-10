import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';

import { ScryptHasher } from '../src/cryptography/scrypt-hasher.js';
import { PrismaClient, type DealStatus } from '../src/generated/prisma/client.js';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to run the seed');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg(databaseUrl),
});

const hasher = new ScryptHasher();

const DEMO_PASSWORD = 'admin123456';

const SELLERS = [
  {
    name: 'Ana Souza',
    email: 'ana.souza@kikos-demo.com',
  },
  {
    name: 'Bruno Lima',
    email: 'bruno.lima@kikos-demo.com',
  },
  {
    name: 'Carla Mendes',
    email: 'carla.mendes@kikos-demo.com',
  },
] as const;

const LEADS = [
  {
    name: 'Roberto FitLife',
    email: 'roberto@fitlife-demo.com',
  },
  {
    name: 'Marina PowerGym',
    email: 'marina@powergym-demo.com',
  },
  {
    name: 'Pedro StrongHouse',
    email: 'pedro@stronghouse-demo.com',
  },
  {
    name: 'Juliana MoveMais',
    email: 'juliana@movemais-demo.com',
  },
  {
    name: 'Felipe IronBox',
    email: 'felipe@ironbox-demo.com',
  },
  {
    name: 'Camila Wellness Club',
    email: 'camila@wellness-demo.com',
  },
] as const;

type SeedDeal = {
  title: string;
  valueInCents: number;
  status: DealStatus;
  leadEmail: (typeof LEADS)[number]['email'];
  sellerEmail: (typeof SELLERS)[number]['email'];
  comments: string[];
};

const DEALS: SeedDeal[] = [
  {
    title: 'FitLife — 12 esteiras comerciais',
    valueInCents: 180_000_00,
    status: 'IN_PROGRESS',
    leadEmail: 'roberto@fitlife-demo.com',
    sellerEmail: 'ana.souza@kikos-demo.com',
    comments: [
      'Primeiro contato: academia quer renovar a área cardio até o fim do trimestre.',
      'Cliente pediu proposta com 12 esteiras + frete CIF para SP.',
      'Aguardando retorno do sócio sobre orçamento; follow-up agendado para quinta.',
    ],
  },
  {
    title: 'PowerGym — pack musculação completa',
    valueInCents: 320_000_00,
    status: 'NEW',
    leadEmail: 'marina@powergym-demo.com',
    sellerEmail: 'bruno.lima@kikos-demo.com',
    comments: [
      'Lead chegou pelo Instagram. Interesse em máquinas de musculação para unidade nova.',
    ],
  },
  {
    title: 'StrongHouse — bikes + elípticos',
    valueInCents: 95_000_00,
    status: 'WON',
    leadEmail: 'pedro@stronghouse-demo.com',
    sellerEmail: 'carla.mendes@kikos-demo.com',
    comments: [
      'Negociação fechada com 10% de desconto por pagamento à vista.',
      'Pedido faturado. Entrega prevista em 15 dias úteis.',
    ],
  },
  {
    title: 'MoveMais — reforma da sala funcional',
    valueInCents: 64_500_00,
    status: 'LOST',
    leadEmail: 'juliana@movemais-demo.com',
    sellerEmail: 'ana.souza@kikos-demo.com',
    comments: [
      'Cliente comparou com concorrente e optou por fornecedor local mais barato.',
      'Registrar como perdido. Reabordar em 6 meses na expansão da 2ª unidade.',
    ],
  },
  {
    title: 'IronBox — esteiras + remoergômetros',
    valueInCents: 210_000_00,
    status: 'IN_PROGRESS',
    leadEmail: 'felipe@ironbox-demo.com',
    sellerEmail: 'bruno.lima@kikos-demo.com',
    comments: [
      'Visitamos a unidade: espaço para 8 esteiras e 4 remos.',
      'Cliente quer condição de parcelamento em 6x sem juros.',
      'Enviar tabela atualizada + prazo de instalação e treinamento da equipe.',
    ],
  },
  {
    title: 'Wellness Club — linha cardio premium',
    valueInCents: 275_000_00,
    status: 'NEW',
    leadEmail: 'camila@wellness-demo.com',
    sellerEmail: 'carla.mendes@kikos-demo.com',
    comments: [
      'Lead qualificado: budget aprovado, precisa de visita técnica na próxima semana.',
    ],
  },
];

async function upsertAdmin() {
  const passwordHash = await hasher.hash(DEMO_PASSWORD);
  const existing = await prisma.user.findUnique({
    where: { email: 'admin@admin.com.br' },
  });

  if (existing) {
    console.log('• Admin já existe: admin@admin.com.br');
    return existing;
  }

  const admin = await prisma.user.create({
    data: {
      name: 'Admin Demo',
      email: 'admin@admin.com.br',
      passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('• Admin criado: admin@admin.com.br / admin123456');
  return admin;
}

async function upsertSellers() {
  const sellers = [];

  for (const seller of SELLERS) {
    const row = await prisma.seller.upsert({
      where: { email: seller.email },
      update: { name: seller.name },
      create: seller,
    });
    sellers.push(row);
  }

  console.log(`• ${sellers.length} vendedores demo`);
  return sellers;
}

async function upsertLeads() {
  const leads = [];

  for (const lead of LEADS) {
    const row = await prisma.lead.upsert({
      where: { email: lead.email },
      update: { name: lead.name },
      create: lead,
    });
    leads.push(row);
  }

  console.log(`• ${leads.length} leads demo`);
  return leads;
}

async function resetDemoDeals(leadIds: string[]) {
  const existingDeals = await prisma.deal.findMany({
    where: { leadId: { in: leadIds } },
    select: { id: true },
  });

  const dealIds = existingDeals.map((deal) => deal.id);

  if (dealIds.length > 0) {
    await prisma.comment.deleteMany({
      where: { dealId: { in: dealIds } },
    });
    await prisma.deal.deleteMany({
      where: { id: { in: dealIds } },
    });
  }

  await prisma.comment.deleteMany({
    where: { leadId: { in: leadIds } },
  });
}

async function createDealsAndComments(
  sellersByEmail: Map<string, string>,
  leadsByEmail: Map<string, string>,
  authorId: string,
) {
  for (const deal of DEALS) {
    const leadId = leadsByEmail.get(deal.leadEmail);
    const sellerId = sellersByEmail.get(deal.sellerEmail);

    if (!leadId || !sellerId) {
      throw new Error(`Missing relations for deal "${deal.title}"`);
    }

    const created = await prisma.deal.create({
      data: {
        title: deal.title,
        valueInCents: deal.valueInCents,
        status: deal.status,
        leadId,
        sellerId,
      },
    });

    for (const [index, content] of deal.comments.entries()) {
      await prisma.comment.create({
        data: {
          content,
          dealId: created.id,
          authorId,
          createdAt: new Date(Date.now() - (deal.comments.length - index) * 86_400_000),
        },
      });
    }
  }

  console.log(`• ${DEALS.length} negócios demo com comentários`);
}

async function main() {
  console.log('Seeding demo data…');

  const admin = await upsertAdmin();
  const sellers = await upsertSellers();
  const leads = await upsertLeads();

  const sellersByEmail = new Map(sellers.map((s) => [s.email, s.id]));
  const leadsByEmail = new Map(leads.map((l) => [l.email, l.id]));

  await resetDemoDeals(leads.map((lead) => lead.id));
  await createDealsAndComments(sellersByEmail, leadsByEmail, admin.id);

  console.log('\nPronto. Login: admin@admin.com.br / admin123456');
  console.log(
    'Dica IA: abra "FitLife — 12 esteiras comerciais" ou "IronBox — esteiras + remoergômetros".',
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
