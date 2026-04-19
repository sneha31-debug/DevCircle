const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function mutateDataForStrategies() {
  try {
    console.log('Injecting varied dummy data for Strategy UI Verification...');

    const alice = await prisma.user.findFirst({ where: { username: 'alice_dev' } });
    const reactComm = await prisma.community.findFirst({ where: { name: 'React' } });

    if (!alice || !reactComm) throw new Error("Could not find default seeded users or communities.");

    const now = new Date();
    
    // 1. TOP VOTED POST: High upvotes, but very old (so Trending score is very low)
    const oldDate = new Date();
    oldDate.setMonth(now.getMonth() - 1);
    await prisma.post.create({
      data: {
        title: '[TOP VOTED] The History of React Components',
        body: 'This post is literally 30 days old but has massive upvotes. Should be #1 in Top Voted but very low in Trending due to time decay.',
        type: 'ARTICLE',
        authorId: alice.id,
        communityId: reactComm.id,
        upvotes: 500,
        downvotes: 12,
        createdAt: oldDate,
        updatedAt: oldDate
      }
    });

    // 2. TRENDING POST: Moderate upvotes, but extremely new
    const trendingDate = new Date();
    trendingDate.setHours(now.getHours() - 1);
    await prisma.post.create({
      data: {
        title: '[TRENDING] React 19 Compiler just dropped!',
        body: 'I just watched the React Conf stream. The new compiler automatically memoizes everything. Because this is only 1 hour old and has rapid upvotes, HN gravity pushes this to #1 in Trending!',
        type: 'ARTICLE',
        authorId: alice.id,
        communityId: reactComm.id,
        upvotes: 45,
        downvotes: 2,
        createdAt: trendingDate,
        updatedAt: trendingDate
      }
    });

    // 3. RECENT POST: Zero upvotes, but literally created right now
    await prisma.post.create({
      data: {
        title: '[RECENT] Quick question about JSX syntax',
        body: 'I am getting a weird parsing error when trying to map an array without a wrapper element. Should be #1 in Recent since it has zero upvotes and was just posted.',
        type: 'QUESTION',
        authorId: alice.id,
        communityId: reactComm.id,
        upvotes: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('🎉 Added test posts to database successfully!');

  } catch (err) {
    console.error('Failed:', err);
  } finally {
    await prisma.$disconnect();
  }
}

mutateDataForStrategies();
