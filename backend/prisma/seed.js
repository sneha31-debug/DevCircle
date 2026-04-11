// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Users ──────────────────────────────────────────────────────
  const passwordHash = await bcrypt.hash('Password123!', 12);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@devcircle.dev' },
    update: {},
    create: {
      username: 'admin',
      email: 'admin@devcircle.dev',
      passwordHash,
      bio: 'Platform administrator',
      role: 'ADMIN',
      reputationScore: 1000,
    },
  });

  const alice = await prisma.user.upsert({
    where: { email: 'alice@devcircle.dev' },
    update: {},
    create: {
      username: 'alice_dev',
      email: 'alice@devcircle.dev',
      passwordHash,
      bio: 'Full stack developer. Loves React and Node.js.',
      reputationScore: 450,
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: 'bob@devcircle.dev' },
    update: {},
    create: {
      username: 'bob_coder',
      email: 'bob@devcircle.dev',
      passwordHash,
      bio: 'Backend engineer. PostgreSQL enthusiast.',
      reputationScore: 320,
    },
  });

  const carol = await prisma.user.upsert({
    where: { email: 'carol@devcircle.dev' },
    update: {},
    create: {
      username: 'carol_js',
      email: 'carol@devcircle.dev',
      passwordHash,
      bio: 'JavaScript wizard. Open source contributor.',
      reputationScore: 210,
    },
  });

  console.log('✅ Users seeded');

  // ── Tags ───────────────────────────────────────────────────────
  const tagNames = ['javascript', 'nodejs', 'react', 'postgresql', 'prisma', 'async', 'oop', 'rest-api', 'system-design', 'docker'];
  const tags = {};
  for (const name of tagNames) {
    tags[name] = await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('✅ Tags seeded');

  // ── Communities ────────────────────────────────────────────────
  const jsComm = await prisma.community.upsert({
    where: { name: 'JavaScript' },
    update: {},
    create: {
      name: 'JavaScript',
      description: 'Everything about JavaScript — frontend, backend, tooling.',
      moderatorId: alice.id,
      memberCount: 3,
    },
  });

  const sysDesignComm = await prisma.community.upsert({
    where: { name: 'System Design' },
    update: {},
    create: {
      name: 'System Design',
      description: 'Architecture, scalability, and system design discussions.',
      moderatorId: bob.id,
      memberCount: 2,
    },
  });

  // Community memberships
  for (const [userId, communityId] of [
    [alice.id, jsComm.id],
    [bob.id, jsComm.id],
    [carol.id, jsComm.id],
    [alice.id, sysDesignComm.id],
    [bob.id, sysDesignComm.id],
  ]) {
    await prisma.communityMember.upsert({
      where: { userId_communityId: { userId, communityId } },
      update: {},
      create: { userId, communityId },
    }).catch(() => {}); // ignore duplicates
  }

  console.log('✅ Communities seeded');

  // ── Posts ──────────────────────────────────────────────────────
  const post1 = await prisma.post.create({
    data: {
      title: 'How does async/await work under the hood in JavaScript?',
      body: 'I understand how to use async/await but I want to understand what the JavaScript engine actually does when it encounters these keywords. Can someone explain the event loop connection?',
      type: 'QUESTION',
      authorId: carol.id,
      communityId: jsComm.id,
      upvotes: 12,
      downvotes: 1,
      tags: {
        create: [
          { tag: { connect: { id: tags['javascript'].id } } },
          { tag: { connect: { id: tags['async'].id } } },
        ],
      },
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: 'Getting Started with Prisma ORM and PostgreSQL',
      body: `# Getting Started with Prisma

Prisma is a next-generation ORM that makes database access easy. Here's how to set it up with PostgreSQL.

## Installation

\`\`\`bash
npm install prisma @prisma/client
npx prisma init
\`\`\`

## Define your schema in prisma/schema.prisma and run migrations.

Prisma provides type-safe database access and an intuitive data model.`,
      type: 'ARTICLE',
      authorId: alice.id,
      communityId: jsComm.id,
      readTimeMinutes: 5,
      upvotes: 28,
      downvotes: 2,
      tags: {
        create: [
          { tag: { connect: { id: tags['prisma'].id } } },
          { tag: { connect: { id: tags['postgresql'].id } } },
        ],
      },
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: 'Which backend framework do you prefer for Node.js?',
      body: 'Curious what the community prefers for building REST APIs in Node.js.',
      type: 'POLL',
      authorId: bob.id,
      communityId: jsComm.id,
      upvotes: 15,
      downvotes: 0,
      tags: {
        create: [
          { tag: { connect: { id: tags['nodejs'].id } } },
          { tag: { connect: { id: tags['rest-api'].id } } },
        ],
      },
      pollOptions: {
        create: [
          { optionText: 'Express.js', voteCount: 34 },
          { optionText: 'Fastify', voteCount: 18 },
          { optionText: 'NestJS', voteCount: 12 },
          { optionText: 'Hono', voteCount: 6 },
        ],
      },
    },
  });

  console.log('✅ Posts seeded');

  // ── Comments ───────────────────────────────────────────────────
  const comment1 = await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: alice.id,
      body: "Async/await is syntactic sugar over Promises. When the JS engine hits `await`, it pauses the async function, registers a microtask for the resolved value, and returns control to the event loop. When the awaited promise resolves, the function resumes from where it left off.",
      upvotes: 8,
    },
  });

  await prisma.comment.create({
    data: {
      postId: post1.id,
      authorId: bob.id,
      parentCommentId: comment1.id,
      body: "Great explanation! Worth adding that this is why async code doesn't block the main thread — the event loop handles everything.",
      upvotes: 3,
    },
  });

  await prisma.comment.create({
    data: {
      postId: post2.id,
      authorId: carol.id,
      body: "This is a great intro! One thing to add — Prisma Studio is incredible for visually managing your data during development.",
      upvotes: 5,
    },
  });

  console.log('✅ Comments seeded');
  console.log('\n🎉 Database seeded successfully!\n');
  console.log('Test accounts (password: Password123!):');
  console.log('  admin@devcircle.dev  (ADMIN)');
  console.log('  alice@devcircle.dev  (MEMBER)');
  console.log('  bob@devcircle.dev    (MEMBER)');
  console.log('  carol@devcircle.dev  (MEMBER)');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
