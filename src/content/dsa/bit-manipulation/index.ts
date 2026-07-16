import type { TopicContent } from '../../types';

export const bitManipulationContent: TopicContent = {
  slug: 'dsa/bit-manipulation', title: 'Bit Manipulation', category: 'dsa',
  theory: `# Bit Manipulation\n\n## Basic Operations\n\n| Operation | Symbol | Effect |\n|-----------|--------|--------|\n| AND | & | 1 only if both 1 |\n| OR | \\| | 1 if either 1 |\n| XOR | ^ | 1 if different |\n| NOT | ^ | flip all bits |\n| Left shift | << | multiply by 2 |\n| Right shift | >> | divide by 2 |\n\n## Common Tricks\n\n\`\`\`go\nn & (n-1)      // clear lowest set bit\nn & (-n)       // isolate lowest set bit\nn | (n-1)      // set all bits from lowest set bit\nn ^ n == 0    // number XOR itself = 0\na ^ b ^ a = b // XOR trick for swapping / finding missing number\n(n >> k) & 1  // get bit k\nn | (1 << k)  // set bit k\nn &^ (1 << k) // clear bit k (Go: &^)\nn ^ (1 << k)  // toggle bit k\n\`\`\`\n\n## Power of Two\n\n\`\`\`go\nfunc isPowerOfTwo(n int) bool { return n > 0 && (n & (n-1)) == 0 }\n\`\`\`\n`,
  examples: `# Bit Manipulation — Examples\n\n## Single Number (XOR)\n\n\`\`\`go\nfunc singleNumber(nums []int) int {\n    res := 0\n    for _, v := range nums { res ^= v }\n    return res\n}\n// All pairs cancel: a^a=0; result = single element\n\`\`\`\n\n## Count Bits\n\n\`\`\`go\nfunc countBits(n int) []int {\n    dp := make([]int, n+1)\n    for i := 1; i <= n; i++ {\n        dp[i] = dp[i>>1] + (i & 1)\n    }\n    return dp\n}\n// dp[i] = dp[i/2] + LSB of i\n\`\`\`\n\n## Reverse Bits\n\n\`\`\`go\nfunc reverseBits(num uint32) uint32 {\n    var res uint32\n    for i := 0; i < 32; i++ {\n        res = (res << 1) | (num & 1)\n        num >>= 1\n    }\n    return res\n}\n\`\`\``,
  patterns: `# Bit Manipulation Patterns\n\n## 1. XOR cancel — find unique element, missing number\n## 2. n & (n-1) — clear LSB, count set bits (Hamming weight)\n## 3. Bitmask subsets — enumerate all 2^n subsets\n## 4. Bitmask DP — track states as bit fields\n## 5. Bit shifting — divide/multiply by powers of 2\n\n\`\`\`go\n// Hamming weight (count set bits)\nfunc hammingWeight(n int) int {\n    count := 0\n    for n != 0 { n &= n-1; count++ }\n    return count\n}\n\`\`\``,
  interviewTips: `# Interview Tips — Bit Manipulation\n\n1. XOR properties: a^0=a, a^a=0, commutative and associative.\n2. \`n & (n-1)\` removes the lowest set bit — useful for counting set bits in O(set bits).\n3. For bitmask enumeration: iterate i from 0 to (1<<n)-1.\n4. In Go, use \`&^\` for bit clear (AND NOT).`,
  commonMistakes: `# Common Mistakes — Bit Manipulation\n\n1. Signed integer right shift — >> sign-extends in most languages. Use unsigned or mask.\n2. Operator precedence — & has lower precedence than ==: write \`(n & 1) == 0\`, not \`n & 1 == 0\`.\n3. Overflow when shifting — check bit count matches integer size.\n4. Using int32 when uint32 needed (Reverse Bits problem).`,
  revision: `# Bit Manipulation — Quick Revision\n\n| Trick | Code |\n|-------|------|\n| Clear lowest bit | n & (n-1) |\n| Isolate lowest bit | n & (-n) |\n| Power of two check | n>0 && n&(n-1)==0 |\n| XOR find unique | reduce with ^ |\n| kth bit | (n>>k)&1 |\n| Set kth bit | n|(1<<k) |\n`,
  codeExamples: [{ language: 'go', label: 'Single Number & Hamming Weight', code: `func singleNumber(nums []int) int {
	res := 0
	for _, v := range nums { res ^= v }
	return res
}

func hammingWeight(n int) int {
	count := 0
	for n != 0 {
		n &= n - 1 // clear lowest set bit
		count++
	}
	return count
}` }],
  resources: [
    { title: 'Bit Manipulation — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Bit Tricks — GfG', url: 'https://www.geeksforgeeks.org/bits-manipulation-important-tactics/', type: 'article', free: true },
    { title: 'LeetCode Bit Manipulation Tag', url: 'https://leetcode.com/tag/bit-manipulation/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'bm-q1', question: 'What does n & (n-1) accomplish?', options: ['Sets the lowest bit', 'Clears the lowest set bit', 'Flips all bits', 'Doubles n'], correctIndex: 1, explanation: 'n-1 flips the lowest set bit and all bits below it. ANDing with n clears those bits, leaving n with its lowest set bit removed.' },
    { id: 'bm-q2', question: 'XOR of a number with itself equals:', options: ['The number', '0', 'All ones (0xFFFF)', '1'], correctIndex: 1, explanation: 'Every bit XOR\'d with itself gives 0. This is the basis of Single Number — all paired elements cancel out.' },
    { id: 'bm-q3', question: 'How do you check if the kth bit of n is set?', options: ['n & k', 'n | (1 << k)', '(n >> k) & 1', 'n ^ k'], correctIndex: 2, explanation: 'Shift n right by k places so the kth bit is now in position 0, then AND with 1 to isolate it.' },
    { id: 'bm-q4', question: 'What is the time complexity of counting set bits using n & (n-1)?', options: ['O(log n)', 'O(n)', 'O(number of set bits)', 'O(1)'], correctIndex: 2, explanation: 'Each iteration clears one set bit. Loop runs exactly as many times as there are set bits — O(s) where s is the Hamming weight.' },
  ],
  questions: [
    {
      id: 'lc-136',
      title: "Single Number",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Bit Manipulation',
      companies: ["Amazon", "Google", "Microsoft", "Apple"],
      tags: ["bit-manipulation", "hash-set"],
      problemStatement: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. Must be O(n) time and O(1) space.",
      examples: [{"input": "nums = [2,2,1]", "output": "1"}, {"input": "nums = [4,1,2,1,2]", "output": "4"}],
      constraints: ["1 <= nums.length <= 3*10^4", "-3*10^4 <= nums[i] <= 3*10^4", "Each element appears twice except one"],
      hints: ["XOR all numbers: a ^ a = 0, a ^ 0 = a", "XOR is commutative and associative"],
      bruteForce: "Hash set to track pairs \u2014 O(n) space.",
      optimizedSolution: "XOR all elements. Duplicates cancel out. O(n)/O(1).",
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func singleNumber(nums []int) int {
    result := 0
    for _, n := range nums {
        result ^= n
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/single-number/"},
      related: ["Single Number II", "Single Number III"],
      dryRun: {
        title: "Single Number \u2014 XOR All",
        input: "nums = [4,1,2,1,2]",
        result: "Result = 4",
        steps: [
          { line: 2, description: "Initialize result = 0", variables: [{"name": "result", "value": "0"}], dataState: "nums = [4, 1, 2, 1, 2]\nresult = 0" },
          { line: 4, description: "n=4: result = 0 ^ 4 = 4", variables: [{"name": "n", "value": "4"}, {"name": "result", "value": "4"}], dataState: "nums = [4, 1, 2, 1, 2]\n       ^\nresult = 0 ^ 4 = 4 (100)" },
          { line: 4, description: "n=1: result = 4 ^ 1 = 5", variables: [{"name": "n", "value": "1"}, {"name": "result", "value": "5"}], dataState: "nums = [4, 1, 2, 1, 2]\n          ^\nresult = 4 ^ 1 = 5 (101)" },
          { line: 4, description: "n=2: result = 5 ^ 2 = 7", variables: [{"name": "n", "value": "2"}, {"name": "result", "value": "7"}], dataState: "nums = [4, 1, 2, 1, 2]\n             ^\nresult = 5 ^ 2 = 7 (111)" },
          { line: 4, description: "n=1: result = 7 ^ 1 = 6 (1 cancels out)", variables: [{"name": "n", "value": "1"}, {"name": "result", "value": "6"}], dataState: "nums = [4, 1, 2, 1, 2]\n                ^\nresult = 7 ^ 1 = 6 (110)\n1 appears twice, cancels!" },
          { line: 4, description: "n=2: result = 6 ^ 2 = 4 (2 cancels out)", variables: [{"name": "n", "value": "2"}, {"name": "result", "value": "4"}], dataState: "nums = [4, 1, 2, 1, 2]\n                   ^\nresult = 6 ^ 2 = 4 (100)\n2 appears twice, cancels!" },
          { line: 6, description: "Return result = 4 (the single number!)", variables: [{"name": "result", "value": "4"}], dataState: "Result: 4 \u2713\n(All pairs XORed to 0, only 4 remains)" },
        ],
      },
    },
    {
      id: 'lc-190',
      title: "Reverse Bits",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Bit Manipulation',
      companies: ["Amazon", "Microsoft", "Apple"],
      tags: ["bit-manipulation"],
      problemStatement: "Reverse bits of a given 32-bit unsigned integer. Return the reversed value.",
      examples: [{"input": "n = 00000010100101000001111010011100", "output": "964176192 (00111001011110000010100101000000)"}],
      constraints: ["The input is a 32-bit unsigned integer", "0 <= n < 2^32"],
      hints: ["Process bit by bit: extract last bit, add to result, shift", "Or use divide and conquer with bit masks"],
      bruteForce: "Convert to string, reverse, convert back.",
      optimizedSolution: "Bit-by-bit: res = (res<<1) | (n&1), n >>= 1, 32 times. O(32)/O(1).",
      timeComplexity: 'O(1)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func reverseBits(n uint32) uint32 {
    var result uint32 = 0
    for i := 0; i < 32; i++ {
        result = (result << 1) | (n & 1)
        n >>= 1
    }
    return result
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/reverse-bits/"},
      related: ["Number of 1 Bits", "Missing Number"],
      dryRun: {
        title: "Reverse Bits \u2014 Bit by Bit",
        input: "n = 13 (binary: ...1101)",
        result: "Reversed = ...1011 shifted",
        steps: [
          { line: 2, description: "Initialize result = 0. n = 13 (binary: 1101)", variables: [{"name": "result", "value": "0"}, {"name": "n", "value": "13 (1101)"}], dataState: "n = 13 = ...00001101\nresult = 0" },
          { line: 4, description: "i=0: result = (0<<1)|(13&1) = 0|1 = 1. n = 13>>1 = 6.", variables: [{"name": "i", "value": "0"}, {"name": "result", "value": "1 (1)"}, {"name": "n", "value": "6 (110)"}], dataState: "n&1 = 1 (last bit of 1101)\nresult = 0|1 = 1\nn = 6 (110)" },
          { line: 4, description: "i=1: result = (1<<1)|(6&1) = 2|0 = 2. n = 6>>1 = 3.", variables: [{"name": "i", "value": "1"}, {"name": "result", "value": "2 (10)"}, {"name": "n", "value": "3 (11)"}], dataState: "n&1 = 0 (last bit of 110)\nresult = 2|0 = 2\nn = 3 (11)" },
          { line: 4, description: "i=2: result = (2<<1)|(3&1) = 4|1 = 5. n = 3>>1 = 1.", variables: [{"name": "i", "value": "2"}, {"name": "result", "value": "5 (101)"}, {"name": "n", "value": "1 (1)"}], dataState: "n&1 = 1 (last bit of 11)\nresult = 4|1 = 5\nn = 1 (1)" },
          { line: 4, description: "i=3: result = (5<<1)|(1&1) = 10|1 = 11. n = 1>>1 = 0.", variables: [{"name": "i", "value": "3"}, {"name": "result", "value": "11 (1011)"}, {"name": "n", "value": "0"}], dataState: "n&1 = 1 (last bit of 1)\nresult = 10|1 = 11\nn = 0" },
          { line: 4, description: "Continue shifting result left for remaining 28 bits (n=0, all zeros)", variables: [{"name": "result", "value": "11 << 28"}], dataState: "i=4..31: result keeps shifting left\nfinal = 11 << 28" },
          { line: 6, description: "Return result (reversed 32-bit number)", variables: [{"name": "result", "value": "reversed"}], dataState: "Result: 1101 reversed = 1011 (padded)\nOriginal last bit is now first \u2713" },
        ],
      },
    },
  ],
};
