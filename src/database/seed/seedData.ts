import type { Roadmap, Module, Topic, Lesson, Question, Difficulty, QuestionStatus } from '../../types';

const now = () => Date.now();

export const roadmaps: Roadmap[] = [
  {
    id: 'rm-dsa', title: 'DSA', description: 'Data Structures & Algorithms — the foundation of every coding interview.',
    phase: 1, order_index: 0, icon: 'binary', color: '#1f5af0',
    total_lessons: 32, total_questions: 150, created_at: now(), updated_at: now(),
  },
  {
    id: 'rm-sysdesign', title: 'System Design', description: 'Scalability, architecture, and distributed systems.',
    phase: 2, order_index: 1, icon: 'server', color: '#16a34a',
    total_lessons: 28, total_questions: 40, created_at: now(), updated_at: now(),
  },
  {
    id: 'rm-cloud', title: 'AWS Cloud', description: 'Cloud infrastructure and services for scalable applications.',
    phase: 3, order_index: 2, icon: 'cloud', color: '#f59e0b',
    total_lessons: 20, total_questions: 30, created_at: now(), updated_at: now(),
  },
  {
    id: 'rm-golang', title: 'Golang Backend', description: 'Go backend engineering, concurrency, and architecture.',
    phase: 4, order_index: 3, icon: 'code', color: '#0891b2',
    total_lessons: 30, total_questions: 25, created_at: now(), updated_at: now(),
  },
  {
    id: 'rm-interview', title: 'Interview Preparation', description: 'Behavioral, mock interviews, and final preparation.',
    phase: 5, order_index: 4, icon: 'briefcase', color: '#8b5cf6',
    total_lessons: 10, total_questions: 20, created_at: now(), updated_at: now(),
  },
];

export const modules: Module[] = [
  {
    id: 'mod-dsa', roadmap_id: 'rm-dsa', title: 'Data Structures & Algorithms',
    description: 'Complete DSA interview preparation covering all major topics.',
    order_index: 0, icon: 'binary', color: '#1f5af0',
    total_topics: 32, total_lessons: 32, total_questions: 150,
    created_at: now(), updated_at: now(),
  },
  {
    id: 'mod-sysdesign', roadmap_id: 'rm-sysdesign', title: 'System Design Fundamentals',
    description: 'Scalability, architecture, and distributed systems concepts.',
    order_index: 0, icon: 'server', color: '#16a34a',
    total_topics: 28, total_lessons: 28, total_questions: 40,
    created_at: now(), updated_at: now(),
  },
  {
    id: 'mod-cloud', roadmap_id: 'rm-cloud', title: 'AWS Services',
    description: 'Core and advanced AWS services for cloud engineering.',
    order_index: 0, icon: 'cloud', color: '#f59e0b',
    total_topics: 20, total_lessons: 20, total_questions: 30,
    created_at: now(), updated_at: now(),
  },
  {
    id: 'mod-golang', roadmap_id: 'rm-golang', title: 'Go Backend Engineering',
    description: 'Go fundamentals, concurrency, and backend architecture.',
    order_index: 0, icon: 'code', color: '#0891b2',
    total_topics: 30, total_lessons: 30, total_questions: 25,
    created_at: now(), updated_at: now(),
  },
  {
    id: 'mod-interview', roadmap_id: 'rm-interview', title: 'Interview Prep',
    description: 'Behavioral questions, mock interviews, and tips.',
    order_index: 0, icon: 'briefcase', color: '#8b5cf6',
    total_topics: 10, total_lessons: 10, total_questions: 20,
    created_at: now(), updated_at: now(),
  },
];

interface TopicSeed {
  id: string;
  module_id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  order_index: number;
  theory: string;
  patterns: string[];
  estimated_time_minutes: number;
  interview_tips: string[];
  common_mistakes: string[];
}

const dsaTopicNames = [
  'Arrays', 'Strings', 'Hashing', 'Binary Search', 'Linked List', 'Stack', 'Queue',
  'Heap', 'Tree', 'BST', 'Trie', 'Graph', 'DFS', 'BFS', 'Backtracking', 'Greedy',
  'Dynamic Programming', 'Bit Manipulation', 'Segment Tree', 'Fenwick Tree',
  'Sliding Window', 'Two Pointer', 'Prefix Sum', 'Math', 'Recursion', 'Sorting',
  'Searching', 'Union Find', 'Monotonic Stack', 'Priority Queue', 'Topological Sort',
  'Shortest Path', 'MST',
];

const sysDesignTopics = [
  'CAP Theorem', 'Scalability', 'Load Balancer', 'Caching', 'Redis', 'NGINX',
  'API Gateway', 'Reverse Proxy', 'Database Replication', 'Sharding', 'Partitioning',
  'Microservices', 'Monolith', 'Event Driven Architecture', 'Kafka', 'RabbitMQ', 'SQS',
  'CQRS', 'Rate Limiter', 'Circuit Breaker', 'Distributed Lock', 'ElasticSearch',
  'Logging', 'Monitoring', 'Prometheus', 'Grafana', 'OpenTelemetry', 'Docker', 'Kubernetes',
  'CI/CD',
];

const awsTopics = [
  'IAM', 'EC2', 'S3', 'VPC', 'CloudFront', 'Route53', 'RDS', 'Auto Scaling',
  'Load Balancer', 'Lambda', 'DynamoDB', 'CloudWatch', 'CloudFormation', 'SNS', 'SQS',
  'ECS', 'EKS', 'Elastic Beanstalk', 'CodePipeline', 'CodeDeploy',
];

const golangTopics = [
  'Go Basics', 'Pointers', 'Interfaces', 'Structs', 'Generics', 'Concurrency',
  'Channels', 'Mutex', 'Context', 'WaitGroup', 'Worker Pool', 'REST API', 'gRPC', 'JWT',
  'OAuth', 'Redis', 'Kafka', 'RabbitMQ', 'MongoDB', 'PostgreSQL', 'Docker', 'Kubernetes',
  'Microservices', 'Hexagonal Architecture', 'Clean Architecture', 'Testing',
  'Benchmarking', 'Profiling', 'Security', 'Rate Limiting',
];

const interviewTopics = [
  'Behavioral Questions', 'STAR Method', 'Mock Interviews', 'Resume Tips',
  'Salary Negotiation', 'Company Research', 'Whiteboarding', 'System Design Interviews',
  'Coding Interview Tips', 'Final Checklist',
];

function makeTopics(moduleId: string, names: string[], startOrder: number): TopicSeed[] {
  return names.map((name, i) => ({
    id: `topic-${moduleId}-${i}`,
    module_id: moduleId,
    title: name,
    description: `${name} — concepts, patterns, and practice problems for interview preparation.`,
    difficulty: i < names.length / 3 ? 'beginner' : i < (names.length * 2) / 3 ? 'intermediate' : 'advanced',
    order_index: startOrder + i,
    theory: `${name} is a fundamental topic in interview preparation. Master the core concepts, understand the patterns, and practice problems to build confidence.`,
    patterns: [name],
    estimated_time_minutes: 30 + (i % 4) * 15,
    interview_tips: [
      `Understand the core ${name} patterns before solving problems.`,
      `Practice explaining your approach out loud.`,
      `Always analyze time and space complexity.`,
    ],
    common_mistakes: [
      `Jumping into code without understanding the problem.`,
      `Not considering edge cases.`,
      `Forgetting to optimize the brute force solution.`,
    ],
  }));
}

export const allTopics: TopicSeed[] = [
  ...makeTopics('mod-dsa', dsaTopicNames, 0),
  ...makeTopics('mod-sysdesign', sysDesignTopics, 0),
  ...makeTopics('mod-cloud', awsTopics, 0),
  ...makeTopics('mod-golang', golangTopics, 0),
  ...makeTopics('mod-interview', interviewTopics, 0),
];

export function topicsToDb(topic: TopicSeed): Topic {
  return {
    id: topic.id,
    module_id: topic.module_id,
    title: topic.title,
    description: topic.description,
    difficulty: topic.difficulty,
    order_index: topic.order_index,
    theory: topic.theory,
    visual_explanation: '',
    examples: '[]',
    complexity: '',
    patterns: JSON.stringify(topic.patterns),
    interview_tips: JSON.stringify(topic.interview_tips),
    common_mistakes: JSON.stringify(topic.common_mistakes),
    estimated_time_minutes: topic.estimated_time_minutes,
    is_favorite: 0,
    resources: '[]',
    created_at: now(),
    updated_at: now(),
  };
}

export function makeLessons(topic: TopicSeed): Lesson[] {
  return [
    {
      id: `${topic.id}-lesson-0`,
      topic_id: topic.id,
      title: `${topic.title}: Theory & Concepts`,
      content: topic.theory,
      order_index: 0,
      estimated_time_minutes: 15,
      is_completed: 0,
      completed_at: null,
      created_at: now(),
      updated_at: now(),
    },
    {
      id: `${topic.id}-lesson-1`,
      topic_id: topic.id,
      title: `${topic.title}: Patterns & Techniques`,
      content: `Key patterns for ${topic.title}: ${topic.patterns.join(', ')}. Understanding these patterns helps you identify the right approach quickly during interviews.`,
      order_index: 1,
      estimated_time_minutes: 20,
      is_completed: 0,
      completed_at: null,
      created_at: now(),
      updated_at: now(),
    },
  ];
}

interface QuestionSeed {
  title: string;
  platform: string;
  difficulty: Difficulty;
  pattern: string;
  companies: string[];
  tags: string[];
  problem_statement: string;
  hints: string[];
  brute_force: string;
  optimized_solution: string;
  time_complexity: string;
  space_complexity: string;
  practice_urls: Record<string, string>;
}

const dsaQuestions: Record<string, QuestionSeed[]> = {
  Arrays: [
    {
      title: 'Two Sum', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Arrays',
      companies: ['Google', 'Amazon', 'Microsoft'], tags: ['array', 'hash-map'],
      problem_statement: 'Given an array of integers and a target, return indices of two numbers that add up to the target.',
      hints: ['Use a hash map to store seen values', 'Check if complement exists'],
      brute_force: 'Check every pair — O(n^2) time, O(1) space.',
      optimized_solution: 'Single pass with hash map storing value→index. O(n) time, O(n) space.',
      time_complexity: 'O(n)', space_complexity: 'O(n)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/two-sum/', neetcode: 'https://neetcode.io/problems/two-sum' },
    },
    {
      title: 'Best Time to Buy and Sell Stock', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Arrays',
      companies: ['Amazon', 'Facebook'], tags: ['array', 'dynamic-programming'],
      problem_statement: 'Find the maximum profit from buying and selling one share of stock.',
      hints: ['Track the minimum price', 'Calculate profit at each step'],
      brute_force: 'Check every pair of buy/sell days — O(n^2).',
      optimized_solution: 'Track minimum price, compute max profit in one pass. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
    },
    {
      title: 'Maximum Subarray (Kadane\'s Algorithm)', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Arrays',
      companies: ['Google', 'Apple'], tags: ['array', 'dynamic-programming'],
      problem_statement: 'Find the contiguous subarray with the largest sum.',
      hints: ['At each index, decide: extend or start fresh', 'Track running max'],
      brute_force: 'Check all subarrays — O(n^2).',
      optimized_solution: 'Kadane\'s algorithm: track current and global max. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/maximum-subarray/' },
    },
  ],
  Strings: [
    {
      title: 'Valid Anagram', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Strings',
      companies: ['Amazon', 'Microsoft'], tags: ['string', 'hash-map'],
      problem_statement: 'Determine if two strings are anagrams of each other.',
      hints: ['Count character frequencies', 'Compare the frequency maps'],
      brute_force: 'Sort both strings and compare — O(n log n).',
      optimized_solution: 'Count characters in one pass, compare maps. O(n) time, O(1) space (26 chars).',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/valid-anagram/' },
    },
    {
      title: 'Longest Palindromic Substring', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Strings',
      companies: ['Google', 'Amazon'], tags: ['string', 'dynamic-programming'],
      problem_statement: 'Find the longest palindromic substring in a given string.',
      hints: ['Expand around center', 'Consider both odd and even length palindromes'],
      brute_force: 'Check all substrings — O(n^3).',
      optimized_solution: 'Expand around each center. O(n^2) time, O(1) space.',
      time_complexity: 'O(n^2)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/longest-palindromic-substring/' },
    },
  ],
  'Linked List': [
    {
      title: 'Reverse Linked List', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Linked List',
      companies: ['Amazon', 'Microsoft', 'Google'], tags: ['linked-list', 'recursion'],
      problem_statement: 'Reverse a singly linked list.',
      hints: ['Use three pointers: prev, curr, next', 'Iterative is cleaner than recursive'],
      brute_force: 'Store values in array, rebuild — O(n) time, O(n) space.',
      optimized_solution: 'Iterative pointer reversal. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/reverse-linked-list/' },
    },
    {
      title: 'Merge Two Sorted Lists', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Linked List',
      companies: ['Amazon', 'Apple'], tags: ['linked-list', 'two-pointer'],
      problem_statement: 'Merge two sorted linked lists into one sorted list.',
      hints: ['Use a dummy head node', 'Compare and link the smaller node'],
      brute_force: 'Collect all values, sort, rebuild — O(n log n).',
      optimized_solution: 'Two-pointer merge. O(n+m) time, O(1) space.',
      time_complexity: 'O(n+m)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/merge-two-sorted-lists/' },
    },
  ],
  'Dynamic Programming': [
    {
      title: 'Climbing Stairs', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Dynamic Programming',
      companies: ['Amazon', 'Google'], tags: ['dp', 'math'],
      problem_statement: 'Count the number of ways to climb n stairs, taking 1 or 2 steps at a time.',
      hints: ['This is Fibonacci', 'Use bottom-up DP'],
      brute_force: 'Recursive without memoization — O(2^n).',
      optimized_solution: 'Bottom-up DP with two variables. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/climbing-stairs/' },
    },
    {
      title: 'Longest Common Subsequence', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Dynamic Programming',
      companies: ['Google', 'Microsoft'], tags: ['dp', 'string'],
      problem_statement: 'Find the length of the longest common subsequence between two strings.',
      hints: ['Build a 2D DP table', 'If chars match, add 1 to diagonal'],
      brute_force: 'Generate all subsequences — O(2^n).',
      optimized_solution: '2D DP table. O(n*m) time, O(n*m) space (optimizable to O(min(n,m))).',
      time_complexity: 'O(n*m)', space_complexity: 'O(n*m)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/longest-common-subsequence/' },
    },
    {
      title: 'Coin Change', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Dynamic Programming',
      companies: ['Amazon', 'Facebook'], tags: ['dp', 'array'],
      problem_statement: 'Find the minimum number of coins needed to make a given amount.',
      hints: ['Build up from amount 0', 'For each amount, try every coin'],
      brute_force: 'Recursive with all combinations — exponential.',
      optimized_solution: 'Bottom-up DP. O(amount * coins) time, O(amount) space.',
      time_complexity: 'O(amount * coins)', space_complexity: 'O(amount)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/coin-change/' },
    },
  ],
  Graph: [
    {
      title: 'Number of Islands', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Graph',
      companies: ['Amazon', 'Google', 'Microsoft'], tags: ['graph', 'dfs', 'bfs'],
      problem_statement: 'Count the number of islands in a 2D grid.',
      hints: ['Use DFS/BFS to mark visited cells', 'Count connected components'],
      brute_force: 'Check every cell, DFS to mark island — O(n*m).',
      optimized_solution: 'DFS/BFS flood fill. O(n*m) time, O(n*m) space (or O(1) if modifying grid).',
      time_complexity: 'O(n*m)', space_complexity: 'O(n*m)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/number-of-islands/' },
    },
    {
      title: 'Course Schedule', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Topological Sort',
      companies: ['Google', 'Amazon'], tags: ['graph', 'topological-sort', 'bfs'],
      problem_statement: 'Determine if all courses can be finished given prerequisites.',
      hints: ['Detect cycles in a directed graph', 'Use Kahn\'s algorithm (BFS)'],
      brute_force: 'DFS with cycle detection — O(V+E).',
      optimized_solution: 'Kahn\'s algorithm (in-degree BFS). O(V+E) time, O(V) space.',
      time_complexity: 'O(V+E)', space_complexity: 'O(V)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/course-schedule/' },
    },
  ],
  'Binary Search': [
    {
      title: 'Binary Search', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Binary Search',
      companies: ['Amazon', 'Microsoft'], tags: ['array', 'binary-search'],
      problem_statement: 'Search for a target in a sorted array.',
      hints: ['Use left and right pointers', 'Compare mid element'],
      brute_force: 'Linear scan — O(n).',
      optimized_solution: 'Binary search. O(log n) time, O(1) space.',
      time_complexity: 'O(log n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/binary-search/' },
    },
    {
      title: 'Search in Rotated Sorted Array', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Binary Search',
      companies: ['Google', 'Amazon'], tags: ['array', 'binary-search'],
      problem_statement: 'Search for a target in a rotated sorted array.',
      hints: ['Determine which half is sorted', 'Check if target is in the sorted half'],
      brute_force: 'Linear scan — O(n).',
      optimized_solution: 'Modified binary search. O(log n) time, O(1) space.',
      time_complexity: 'O(log n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
    },
  ],
  'Sliding Window': [
    {
      title: 'Maximum Average Subarray I', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Sliding Window',
      companies: ['Amazon'], tags: ['array', 'sliding-window'],
      problem_statement: 'Find the maximum average of a contiguous subarray of length k.',
      hints: ['Use a fixed-size sliding window', 'Track running sum'],
      brute_force: 'Check every window — O(n*k).',
      optimized_solution: 'Sliding window with running sum. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/maximum-average-subarray-i/' },
    },
  ],
  'Two Pointer': [
    {
      title: 'Container With Most Water', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'Two Pointer',
      companies: ['Google', 'Amazon'], tags: ['array', 'two-pointer'],
      problem_statement: 'Find two lines that form a container holding the most water.',
      hints: ['Start with widest container', 'Move the shorter line inward'],
      brute_force: 'Check all pairs — O(n^2).',
      optimized_solution: 'Two pointers from ends. O(n) time, O(1) space.',
      time_complexity: 'O(n)', space_complexity: 'O(1)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/container-with-most-water/' },
    },
  ],
  Tree: [
    {
      title: 'Maximum Depth of Binary Tree', platform: 'LeetCode', difficulty: 'beginner', pattern: 'Tree',
      companies: ['Amazon', 'Microsoft'], tags: ['tree', 'dfs', 'recursion'],
      problem_statement: 'Find the maximum depth of a binary tree.',
      hints: ['Use recursive DFS', 'Depth = 1 + max(left, right)'],
      brute_force: 'Recursive DFS — O(n).',
      optimized_solution: 'Recursive or BFS level counting. O(n) time, O(h) space.',
      time_complexity: 'O(n)', space_complexity: 'O(h)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/' },
    },
    {
      title: 'Validate Binary Search Tree', platform: 'LeetCode', difficulty: 'intermediate', pattern: 'BST',
      companies: ['Google', 'Amazon'], tags: ['tree', 'bst', 'dfs'],
      problem_statement: 'Determine if a binary tree is a valid BST.',
      hints: ['Use min/max bounds', 'Each node must be within valid range'],
      brute_force: 'In-order traversal and check sorted — O(n).',
      optimized_solution: 'DFS with min/max bounds. O(n) time, O(h) space.',
      time_complexity: 'O(n)', space_complexity: 'O(h)',
      practice_urls: { leetcode: 'https://leetcode.com/problems/validate-binary-search-tree/' },
    },
  ],
};

export function makeQuestions(topic: TopicSeed): Question[] {
  const seeds = dsaQuestions[topic.title] ?? [];
  return seeds.map((seed, i) => {
    const status: QuestionStatus = 'not_started';
    return {
      id: `${topic.id}-q-${i}`,
      topic_id: topic.id,
      title: seed.title,
      platform: seed.platform,
      difficulty: seed.difficulty,
      pattern: seed.pattern,
      companies: JSON.stringify(seed.companies),
      tags: JSON.stringify(seed.tags),
      problem_statement: seed.problem_statement,
      examples: '[]',
      constraints: '',
      hints: JSON.stringify(seed.hints),
      brute_force: seed.brute_force,
      optimized_solution: seed.optimized_solution,
      time_complexity: seed.time_complexity,
      space_complexity: seed.space_complexity,
      related_problems: '[]',
      video_url: '',
      practice_urls: JSON.stringify(seed.practice_urls),
      status,
      is_bookmarked: 0,
      is_favorite: 0,
      is_solved: 0,
      attempts: 0,
      personal_notes: '',
      estimated_time_minutes: 20,
      last_attempted_at: null,
      created_at: now(),
      updated_at: now(),
    };
  });
}

export const achievements = [
  { id: 'ach-streak-7', type: 'streak', title: 'Week Warrior', description: 'Maintain a 7-day streak', icon: 'flame', threshold: 7 },
  { id: 'ach-streak-30', type: 'streak', title: 'Monthly Master', description: 'Maintain a 30-day streak', icon: 'flame', threshold: 30 },
  { id: 'ach-streak-100', type: 'streak', title: 'Centurion', description: 'Maintain a 100-day streak', icon: 'flame', threshold: 100 },
  { id: 'ach-streak-365', type: 'streak', title: 'Year of Consistency', description: 'Maintain a 365-day streak', icon: 'crown', threshold: 365 },
  { id: 'ach-questions-100', type: 'questions', title: 'Century Solver', description: 'Solve 100 questions', icon: 'check-circle', threshold: 100 },
  { id: 'ach-questions-500', type: 'questions', title: 'Problem Crusher', description: 'Solve 500 questions', icon: 'check-circle', threshold: 500 },
  { id: 'ach-questions-1000', type: 'questions', title: 'Question Legend', description: 'Solve 1000 questions', icon: 'award', threshold: 1000 },
  { id: 'ach-xp-1000', type: 'xp', title: 'XP Collector', description: 'Earn 1000 XP', icon: 'star', threshold: 1000 },
  { id: 'ach-xp-5000', type: 'xp', title: 'XP Master', description: 'Earn 5000 XP', icon: 'star', threshold: 5000 },
  { id: 'ach-lessons-50', type: 'lessons', title: 'Lesson Learner', description: 'Complete 50 lessons', icon: 'book-open', threshold: 50 },
  { id: 'ach-lessons-100', type: 'lessons', title: 'Scholar', description: 'Complete 100 lessons', icon: 'book-open', threshold: 100 },
];
