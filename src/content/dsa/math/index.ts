import type { TopicContent } from '../../types';

export const mathContent: TopicContent = {
  slug: 'dsa/math', title: 'Math', category: 'dsa',
  theory: `# Math for Interviews\n\n## GCD / LCM\n\n\`\`\`go\nfunc gcd(a, b int) int { for b != 0 { a, b = b, a%b }; return a }\nfunc lcm(a, b int) int { return a / gcd(a, b) * b }\n\`\`\`\n\n## Prime Sieve (Sieve of Eratosthenes)\n\n\`\`\`go\nfunc sieve(n int) []bool {\n    isPrime := make([]bool, n+1)\n    for i := range isPrime { isPrime[i] = true }\n    isPrime[0], isPrime[1] = false, false\n    for i := 2; i*i <= n; i++ {\n        if isPrime[i] {\n            for j := i*i; j <= n; j += i { isPrime[j] = false }\n        }\n    }\n    return isPrime\n}\n\`\`\`\nO(n log log n)\n\n## Modular Arithmetic\n\n\`\`\`go\nconst MOD = 1_000_000_007\nresult = (a + b) % MOD\nresult = (a * b) % MOD\n// Modular inverse (Fermat's little theorem, MOD prime):\nfunc modPow(base, exp, mod int) int {\n    result := 1; base %= mod\n    for exp > 0 {\n        if exp%2 == 1 { result = result*base%mod }\n        base = base*base%mod; exp >>= 1\n    }\n    return result\n}\n\`\`\`\n\n## Fast Exponentiation\n\nO(log n) by squaring repeatedly.\n`,
  examples: `# Math — Examples\n\n## Count Primes\n\n\`\`\`go\nfunc countPrimes(n int) int {\n    if n < 2 { return 0 }\n    sieve := sieve(n-1)\n    count := 0\n    for _, p := range sieve { if p { count++ } }\n    return count\n}\n\`\`\`\n\n## Power (Fast Exponentiation)\n\n\`\`\`go\nfunc myPow(x float64, n int) float64 {\n    if n < 0 { x = 1/x; n = -n }\n    var pow func(float64, int) float64\n    pow = func(x float64, n int) float64 {\n        if n == 0 { return 1 }\n        half := pow(x, n/2)\n        if n%2 == 0 { return half*half }\n        return half*half*x\n    }\n    return pow(x, n)\n}\n\`\`\``,
  patterns: `# Math Patterns\n\n## 1. GCD/LCM — Euclidean algorithm\n## 2. Prime checking — trial division O(√n)\n## 3. Prime sieve — batch prime computation O(n log log n)\n## 4. Modular arithmetic — prevent overflow in combinatorics\n## 5. Fast power — modular exponentiation O(log n)\n## 6. Combinatorics — C(n,k) = C(n-1,k-1) + C(n-1,k) or precompute factorials`,
  interviewTips: `# Interview Tips — Math\n\n1. Always apply MOD to prevent overflow in large combinatorics.\n2. Fast exponentiation: use bit manipulation (exp >>= 1) for cleaner code.\n3. GCD is the building block for fraction simplification, LCM, and cyclic period problems.\n4. Trial division for primality: only check up to √n.`,
  commonMistakes: `# Common Mistakes — Math\n\n1. Integer overflow in modular multiplication — multiply before applying mod.\n2. Sieve starting inner loop at i² not 2i — wastes time.\n3. Off-by-one in prime sieve — set isPrime[0] and [1] to false.\n4. Negative exponents in power function — handle negative n separately.`,
  revision: `# Math — Quick Revision\n\n| Function | Algorithm | Complexity |\n|----------|-----------|----------|\n| GCD | Euclidean | O(log min(a,b)) |\n| LCM | a/gcd * b | O(log n) |\n| Is prime | Trial div | O(√n) |\n| All primes ≤ n | Sieve | O(n log log n) |\n| a^n mod m | Fast pow | O(log n) |\n`,
  codeExamples: [{ language: 'go', label: 'GCD + Sieve + Fast Power', code: `func gcd(a, b int) int {
	for b != 0 { a, b = b, a%b }
	return a
}

func sieve(n int) []bool {
	ip := make([]bool, n+1)
	for i := 2; i <= n; i++ { ip[i] = true }
	for i := 2; i*i <= n; i++ {
		if ip[i] { for j := i*i; j <= n; j += i { ip[j] = false } }
	}
	return ip
}

func modPow(base, exp, mod int) int {
	res, b := 1, base%mod
	for exp > 0 {
		if exp%2 == 1 { res = res * b % mod }
		b = b * b % mod
		exp >>= 1
	}
	return res
}` }],
  resources: [
    { title: 'Number Theory — CP-Algorithms', url: 'https://cp-algorithms.com/algebra/sieve-of-eratosthenes.html', type: 'article', free: true },
    { title: 'Math — GfG', url: 'https://www.geeksforgeeks.org/mathematical-algorithms/', type: 'article', free: true },
    { title: 'LeetCode Math Tag', url: 'https://leetcode.com/tag/math/', type: 'docs', free: true },
  ],
  quiz: [
    { id: 'mth-q1', question: 'Euclidean GCD algorithm has what time complexity?', options: ['O(n)', 'O(log(min(a,b)))', 'O(√n)', 'O(1)'], correctIndex: 1, explanation: 'Each step reduces the larger number by at least half. After O(log n) steps, one value becomes 0.' },
    { id: 'mth-q2', question: 'The Sieve of Eratosthenes has what time complexity?', options: ['O(n²)', 'O(n log n)', 'O(n log log n)', 'O(n)'], correctIndex: 2, explanation: 'The sieve marks each composite exactly once. Total operations ≈ n(1/2 + 1/3 + 1/5 + ...) = O(n log log n).' },
    { id: 'mth-q3', question: 'Fast exponentiation (a^n) runs in:', options: ['O(n)', 'O(n/2)', 'O(log n)', 'O(1)'], correctIndex: 2, explanation: 'At each step we halve the exponent. After log₂n steps the exponent reaches 0.' },
    { id: 'mth-q4', question: 'To check if n is prime by trial division, you only need to check factors up to:', options: ['n/2', 'n-1', '√n', 'log n'], correctIndex: 2, explanation: 'If n has a factor > √n, it must have a corresponding factor < √n. So checking up to √n is sufficient.' },
  ],
  questions: [
    {
      id: 'lc-9',
      title: "Palindrome Number",
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Math',
      companies: ["Amazon", "Google", "Microsoft", "Apple"],
      tags: ["math"],
      problemStatement: "Given an integer x, return true if x is a palindrome, and false otherwise. Solve without converting to string.",
      examples: [{"input": "x = 121", "output": "true"}, {"input": "x = -121", "output": "false"}, {"input": "x = 10", "output": "false"}],
      constraints: ["-2^31 <= x <= 2^31 - 1", "Follow up: solve without string conversion"],
      hints: ["Reverse half the number and compare", "Negative numbers are not palindromes"],
      bruteForce: "Convert to string and reverse \u2014 O(n) space.",
      optimizedSolution: "Reverse half: build reversed number, compare with remaining. O(log n)/O(1).",
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func isPalindrome(x int) bool {
    if x < 0 || (x % 10 == 0 && x != 0) { return false }
    reverted := 0
    for x > reverted {
        reverted = reverted*10 + x%10
        x /= 10
    }
    return x == reverted || x == reverted/10
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/palindrome-number/"},
      related: ["Reverse Integer", "Valid Palindrome"],
      dryRun: {
        title: "Palindrome Number \u2014 Half Reverse",
        input: "x = 12321",
        result: "Return true",
        steps: [
          { line: 2, description: "x=12321, not negative, not ending in 0. Initialize reverted=0.", variables: [{"name": "x", "value": "12321"}, {"name": "reverted", "value": "0"}], dataState: "x = 12321\nreverted = 0\nx > reverted? 12321 > 0 \u2713" },
          { line: 5, description: "Iter 1: reverted = 0*10 + 1 = 1. x = 1232.", variables: [{"name": "x", "value": "1232"}, {"name": "reverted", "value": "1"}], dataState: "x = 1232\nreverted = 1\nx > reverted? 1232 > 1 \u2713" },
          { line: 5, description: "Iter 2: reverted = 1*10 + 2 = 12. x = 123.", variables: [{"name": "x", "value": "123"}, {"name": "reverted", "value": "12"}], dataState: "x = 123\nreverted = 12\nx > reverted? 123 > 12 \u2713" },
          { line: 5, description: "Iter 3: reverted = 12*10 + 3 = 123. x = 12.", variables: [{"name": "x", "value": "12"}, {"name": "reverted", "value": "123"}], dataState: "x = 12\nreverted = 123\nx > reverted? 12 > 123? NO, stop" },
          { line: 7, description: "x == reverted/10? 12 == 123/10 = 12? Yes! Return true (odd digits).", variables: [{"name": "result", "value": "true"}], dataState: "x = 12, reverted = 123\n12 == 123/10 = 12 \u2713\nResult: true (odd-digit palindrome)" },
        ],
      },
    },
    {
      id: 'lc-50',
      title: "Pow(x, n)",
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Math / Fast Exponentiation',
      companies: ["Amazon", "Google", "Meta", "Microsoft"],
      tags: ["math", "recursion", "divide-conquer"],
      problemStatement: "Implement pow(x, n), which calculates x raised to the power n (i.e., x^n).",
      examples: [{"input": "x = 2.00000, n = 10", "output": "1024.00000"}, {"input": "x = 2.00000, n = -2", "output": "0.25000"}],
      constraints: ["-100.0 < x < 100.0", "-2^31 <= n <= 2^31-1", "n is integer"],
      hints: ["Use fast exponentiation: x^n = (x^(n/2))^2", "If n is odd, multiply by x once more"],
      bruteForce: "Multiply x n times \u2014 O(n).",
      optimizedSolution: "Fast exponentiation (exponentiation by squaring). O(log n)/O(log n).",
      timeComplexity: 'O(log n)',
      spaceComplexity: 'O(log n)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func myPow(x float64, n int) float64 {
    if n < 0 {
        x = 1 / x
        n = -n
    }
    return fastPow(x, n)
}

func fastPow(x float64, n int) float64 {
    if n == 0 { return 1 }
    half := fastPow(x, n/2)
    if n%2 == 0 {
        return half * half
    }
    return half * half * x
}`,
        },
      ],
      practiceUrls: {"LeetCode": "https://leetcode.com/problems/powx-n/"},
      related: ["Sqrt(x)", "Super Pow"],
      dryRun: {
        title: "Pow(x, n) \u2014 Fast Exponentiation",
        input: "x = 2, n = 10",
        result: "Result = 1024",
        steps: [
          { line: 5, description: "fastPow(2, 10): n=10 even. half = fastPow(2, 5)", variables: [{"name": "x", "value": "2"}, {"name": "n", "value": "10"}], dataState: "pow(2, 10)\n  10 even, half = pow(2, 5)" },
          { line: 5, description: "fastPow(2, 5): n=5 odd. half = fastPow(2, 2). Return half*half*2", variables: [{"name": "x", "value": "2"}, {"name": "n", "value": "5"}], dataState: "pow(2, 5)\n  5 odd, half = pow(2, 2)\n  return half * half * 2" },
          { line: 5, description: "fastPow(2, 2): n=2 even. half = fastPow(2, 1). Return half*half", variables: [{"name": "x", "value": "2"}, {"name": "n", "value": "2"}], dataState: "pow(2, 2)\n  2 even, half = pow(2, 1)\n  return half * half" },
          { line: 5, description: "fastPow(2, 1): n=1 odd. half = fastPow(2, 0) = 1. Return 1*1*2 = 2", variables: [{"name": "x", "value": "2"}, {"name": "n", "value": "1"}, {"name": "result", "value": "2"}], dataState: "pow(2, 1)\n  1 odd, half = pow(2, 0) = 1\n  return 1*1*2 = 2" },
          { line: 8, description: "Unwind: pow(2,2) = 2*2 = 4. pow(2,5) = 4*4*2 = 32. pow(2,10) = 32*32 = 1024.", variables: [{"name": "result", "value": "1024"}], dataState: "Unwinding:\npow(2,2) = 2*2 = 4\npow(2,5) = 4*4*2 = 32\npow(2,10) = 32*32 = 1024 \u2713" },
        ],
      },
    },
  ],
};
