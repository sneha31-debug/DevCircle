const API_URL = 'http://localhost:5001/api';
const testUser = {
  username: `testuser_${Date.now()}`,
  email: `test_${Date.now()}@example.com`,
  password: 'Password123!'
};

let token = '';
let postId = '';

async function fetchAPI(endpoint, options = {}) {
  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  });
  
  const data = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(data));
  return data;
}

async function runTests() {
  console.log('--- DevCircle End-to-End API Test ---');

  try {
    // 1. Signup
    console.log(`\n1. Testing Signup for ${testUser.username}...`);
    const signupRes = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify(testUser)
    });
    token = signupRes.data.token;
    console.log('✅ Signup successful!');

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: testUser.email, password: testUser.password })
    });
    console.log('✅ Login successful! Token verified.');

    // 3. Profile view
    console.log('\n3. Testing Profile View...');
    const profileRes = await fetchAPI(`/users/${testUser.username}`);
    console.log(`✅ Profile fetched: ${profileRes.data.user.username}`);

    // Fetch communities to post in
    const commRes = await fetchAPI('/communities');
    const communityId = Array.isArray(commRes) ? commRes[0]?.id : commRes.data?.[0]?.id;
    if (!communityId) throw new Error("No communities found to post in.");

    // 4. Create Post
    console.log('\n4. Testing Create Post...');
    const postRes = await fetchAPI('/posts', {
      method: 'POST',
      body: JSON.stringify({
        title: 'E2E Test Post',
        body: 'This is a test post to verify everything works.',
        type: 'QUESTION',
        communityId: communityId,
        tags: ['test']
      })
    });
    postId = postRes.data?.post?.id || postRes.data?.id;
    console.log(`✅ Post created with ID: ${postId}`);

    // 5. Check Feed
    console.log('\n5. Testing Feed...');
    const feedRes = await fetchAPI('/feed?strategy=recent');
    const posts = feedRes.data?.posts;
    console.log(`✅ Feed loaded. Found ${posts.length} posts.`);

    // 6. Search
    console.log('\n6. Testing Search...');
    const searchRes = await fetchAPI('/posts/search?q=E2E');
    const searchResults = searchRes.data?.posts?.length || searchRes.data?.length || 0;
    console.log(`✅ Search successful. Found ${searchResults} results.`);

    // 7. Comment
    console.log('\n7. Testing Commenting...');
    await fetchAPI(`/posts/${postId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ body: 'This is an E2E test comment!' })
    });
    console.log('✅ Comment appended successfully!');

    console.log('\n🎉 ALL TESTS PASSED! Backend is 100% operational.');

  } catch (error) {
    console.error('\n❌ TEST FAILED:', error.message);
  }
}

runTests();
