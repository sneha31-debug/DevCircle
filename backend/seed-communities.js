const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedCommunities() {
  try {
    console.log('Seeding fresh communities and posts...');

    // 1. Get Alice and Bob from the database to act as authors
    const alice = await prisma.user.findFirst({ where: { username: 'alice_dev' } });
    const bob = await prisma.user.findFirst({ where: { username: 'bob_coder' } });
    
    if (!alice || !bob) throw new Error("Could not find default seeded users.");

    // 2. See if React exists, if not create it
    let reactComm = await prisma.community.findFirst({ where: { name: 'React' } });
    if (!reactComm) {
      reactComm = await prisma.community.create({
        data: {
          name: 'React',
          description: 'A community for React developers. Discussions about hooks, components, and state management.',
          moderatorId: alice.id,
          memberCount: 2
        }
      });
      console.log('✅ Created React Community');
    }

    // 3. See if System Design exists
    let systemDesignComm = await prisma.community.findFirst({ where: { name: 'SystemDesign' } });
    if (!systemDesignComm) {
      // The old seeder had 'System Design' with a space. The feed links to /c/SystemDesign (no space).
      // Let's create `SystemDesign` without a space or rename the old one.
      const oldSysD = await prisma.community.findFirst({ where: { name: 'System Design' } });
      if (oldSysD) {
        systemDesignComm = await prisma.community.update({
          where: { id: oldSysD.id },
          data: { name: 'SystemDesign' }
        });
        console.log('✅ Renamed System Design -> SystemDesign to match URLs');
      }
    }

    // 4. Create some posts for React
    await prisma.post.create({
      data: {
        title: 'Best practices for useEffect in 2026? Are we still using it?',
        body: 'I have heard that useEffect is heavily discouraged now in the React 19+ ecosystem in favor of server components and custom transition hooks. How is everyone handling data fetching right now?',
        type: 'QUESTION',
        authorId: bob.id,
        communityId: reactComm.id
      }
    });

    await prisma.post.create({
      data: {
        title: 'Migrating from Redux to Zustand',
        body: 'Just finished moving a massive enterprise application over to Zustand. Here are 3 major performance improvements we noticed immediately...',
        type: 'ARTICLE',
        authorId: alice.id,
        communityId: reactComm.id
      }
    });

    // 5. Create some posts for SystemDesign
    await prisma.post.create({
      data: {
        title: 'How to scale WebSockets to 1 Million concurrent users',
        body: 'When building a real-time collaborative system, you quickly hit limits with single node WebSockets. Should we use Redis Pub/Sub, NATS, or Kafka as the backbone message bus?',
        type: 'QUESTION',
        authorId: alice.id,
        communityId: systemDesignComm.id
      }
    });

    console.log('🎉 Seeding successfully completed! The React and SystemDesign communities now have posts.');

  } catch (err) {
    console.error('Seeding failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

seedCommunities();
