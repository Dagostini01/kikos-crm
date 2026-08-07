<p align="center">
  <img src="assets/banner.png" alt="Kikos Carreira Tech — Desenvolvedor Full Stack" width="100%" />
</p>

# Desafio Técnico — Desenvolvedor(a) Fullstack (Kikos Fitness)

Este repositório contém o desafio técnico do processo seletivo para a vaga de **Desenvolvedor(a) TypeScript · Fullstack** na Kikos Fitness. O objetivo é avaliar como você pensa, organiza e constrói uma aplicação fullstack do zero — não existe uma única resposta certa.

## Sobre a Kikos Fitness

Há 35 anos a Kikos Fitness proporciona bem-estar e saúde para os brasileiros através de equipamentos e acessórios fitness, com 20 lojas físicas espalhadas pelo país. Agora estamos construindo uma nova plataforma de tecnologia do zero, e buscamos pessoas que queiram ajudar a definir arquitetura, padrões e cultura de engenharia desde o início.

## Sobre a vaga

- **Cargo:** Desenvolvedor(a) TypeScript · Fullstack
- **Modalidade:** 100% remoto (Brasil)
- **Stack do time:** TypeScript end-to-end, [Effect-TS](https://effect.website/), programação funcional, Node.js no backend, React no frontend, infraestrutura em AWS/Kubernetes
- **O que valorizamos:** TypeScript sólido (generics, tipos de união/interseção, inferência), afinidade com programação funcional, código correto por construção (imutabilidade, composição, tratamento explícito de erros) e autonomia para trabalho remoto
- **Diferenciais:** experiência com Effect-TS, linguagens funcionais (Haskell, Scala, Elixir, F#) ou fp-ts

Vaga completa e candidatura: <https://kikosfitness.pandape.infojobs.com.br/Detail/3553626>

## O desafio

Construa um **CRM simples**, com frontend e backend, cobrindo o fluxo básico de gestão de leads e negócios de um time de vendas.

Você tem **liberdade total de escolha de stack** (linguagem, framework, banco de dados, etc.). Não é obrigatório usar a stack do time — mas familiaridade com TypeScript/React/Node é um diferencial natural, já que é o que usamos no dia a dia.

A entrega deve ser em formato **monorepo**: frontend e backend no mesmo repositório.

## Referência visual (Figma)

Para facilitar o desenvolvimento do frontend, disponibilizamos um protótipo no Figma com as telas de referência do CRM (login, kanban, lista de leads, criar lead, criar negócio e detalhes do negócio).

**Acesse o Figma:** [Kiko — CRM](https://www.figma.com/design/torONxnd1LUOplv6f9ccgA/Kiko---CRM?node-id=0-1&t=yr7jZCStmDApx68T-1)

[![Preview do board kanban — Kiko CRM](assets/figma-crm-preview.png)](https://www.figma.com/design/torONxnd1LUOplv6f9ccgA/Kiko---CRM?node-id=0-1&t=yr7jZCStmDApx68T-1)

O design é uma **referência visual**, não um requisito de implementação pixel-perfect. Você tem liberdade para adaptar layout, componentes e interações — o importante é cobrir as funcionalidades obrigatórias.

## Funcionalidades obrigatórias

- **Login / logout** — autenticação básica de usuário.
- **Criar lead** — cadastro de um lead (contato/prospect) no sistema.
- **Criar negócio** — criação de um negócio (deal/oportunidade) vinculado a um lead.
- **Status do negócio** — o negócio deve ter um status ao longo do funil (ex.: novo → em andamento → ganho/perdido).
- **Marcar como ganho ou perdido** — ação explícita para encerrar um negócio, definindo o resultado.
- **Atrelar a um vendedor (seller)** — todo negócio deve estar associado a um vendedor responsável.
- **Comentários** — possibilidade de adicionar comentários em um lead e/ou negócio (ex.: histórico de interações).
- **Board (kanban)** — o frontend deve apresentar os negócios em um board com uma coluna por status, permitindo transicionar um negócio entre colunas (ex.: arrastar e soltar, ou outra ação de UI) e realizar as demais ações (ver detalhes, comentar, marcar como ganho/perdido) a partir dele.

## Diferencial (bônus)

Conectar a aplicação a alguma funcionalidade de **IA** é um diferencial, não um requisito. A escolha de como usar IA é livre — algumas ideias, sem ser prescritivo:

- Resumo automático dos comentários de um negócio
- Sugestão do próximo passo com um lead/negócio
- Chatbot de apoio ao vendedor
- Classificação/priorização automática de leads (lead scoring)

Outro diferencial é **hospedar a aplicação** (frontend e backend) em algum serviço (ex.: Vercel, Railway, Render, Fly.io, etc.) e enviar o link ao vivo junto com o repositório — não é obrigatório, mas facilita bastante a avaliação.

## Stack técnica

Livre escolha. Use o que você tiver mais confiança para entregar um bom resultado — linguagem, framework de frontend, framework de backend, banco de dados, etc.

## Uso de IA no desenvolvimento

É permitido (e incentivado) usar ferramentas de IA — Copilot, ChatGPT, Claude, Cursor, etc. — durante o desenvolvimento do desafio. O que avaliamos é o resultado final e as suas decisões técnicas, não como o código foi digitado.

## O que será avaliado

- Qualidade, organização e legibilidade do código
- Arquitetura e separação de responsabilidades entre frontend e backend
- Uso correto de tipagem e tratamento de erros
- Organização do histórico de commits
- Documentação da solução entregue (README explicando como rodar o projeto e as decisões técnicas tomadas)
- Funcionamento ponta a ponta das funcionalidades obrigatórias
- Testes automatizados (diferencial, não obrigatório)
- Usabilidade básica do frontend
- Diferenciais: uso de programação funcional, familiaridade com Effect-TS, qualidade da integração de IA (se implementada), aplicação hospedada e acessível online

## Como entregar

1. Crie um repositório próprio (público) do zero com sua solução, como monorepo (frontend e backend no mesmo repositório).
2. Inclua no seu repositório um README explicando como rodar o projeto localmente (backend, frontend, banco de dados, variáveis de ambiente, etc.) e as principais decisões técnicas tomadas.
3. Envie o link do repositório para **<sidnei.pacheco@kikos.com.br>**.

## Prazo

Não há prazo fixo para entrega. Ainda assim, recomendamos não se estender demais — o ideal é um projeto enxuto que cubra bem o essencial, em vez de um projeto incompleto tentando cobrir tudo.

## Dúvidas

Qualquer dúvida sobre o desafio, entre em contato: **<sidnei.pacheco@kikos.com.br>**
