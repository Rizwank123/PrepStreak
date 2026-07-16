import type { TopicContent } from '../../types';

export const hashingContent: TopicContent = {
  slug: 'dsa/hashing',
  title: 'Hashing',
  category: 'dsa',
  theory: `# Hashing

## Hash Functions

Map arbitrary keys to fixed-size indices. Ideal properties: uniform distribution, fast computation, deterministic.

## Collision Resolution

**Chaining** — each bucket holds a linked list of entries. Worst case O(n) all keys hash to same bucket.

**Open Addressing** — probe for next empty slot (linear/quadratic/double-hash probing).

## Go Map Internals

Go's \`map\` uses a hash table with buckets of 8 entries. Load factor ~6.5 triggers rehash. Average O(1) get/set, O(n) worst case (rare with good hash).

## Complexity

| Operation | Average | Worst |
|-----------|---------|-------|
| Insert | O(1) | O(n) |
| Lookup | O(1) | O(n) |
| Delete | O(1) | O(n) |

## When to Use

- Count frequencies
- Check membership in O(1)
- Two-sum complement lookup
- Group by key (anagram groups)
- Memoization (DP cache)
`,

  examples: `# Hashing — Examples

## Two Sum

\`\`\`go
func twoSum(nums []int, target int) []int {
    seen := make(map[int]int)
    for i, v := range nums {
        if j, ok := seen[target-v]; ok { return []int{j, i} }
        seen[v] = i
    }
    return nil
}
\`\`\`

## Subarray Sum Equals K

\`\`\`go
func subarraySum(nums []int, k int) int {
    count := 0
    prefixCount := map[int]int{0: 1}
    sum := 0
    for _, v := range nums {
        sum += v
        count += prefixCount[sum-k]
        prefixCount[sum]++
    }
    return count
}
\`\`\`

## Longest Consecutive Sequence

\`\`\`go
func longestConsecutive(nums []int) int {
    set := make(map[int]bool)
    for _, n := range nums { set[n] = true }
    best := 0
    for n := range set {
        if !set[n-1] { // start of sequence
            length := 1
            for set[n+length] { length++ }
            if length > best { best = length }
        }
    }
    return best
}
\`\`\`
`,

  patterns: `# Hashing Patterns

## 1. Frequency Count
\`map[T]int\` — count occurrences, detect duplicates, anagram check.

## 2. Complement Lookup
Store seen values; for each new element look up its complement.

## 3. Prefix Sum + Hash Map
Store prefix sum counts to find subarrays summing to k.

## 4. Set Membership
\`map[T]bool\` — O(1) contains check instead of O(n) linear scan.

## 5. Group by Key
Canonical form as map key — e.g., sorted string, frequency array.
`,

  interviewTips: `# Interview Tips — Hashing

1. Hash maps trade **O(n) space** for **O(1) time** — always mention this.
2. For frequency problems, \`[26]int\` beats a map if alphabet is small.
3. **Map zero-value** in Go is 0 for int — safe to increment without checking.
4. Always clarify if hash collisions need to be handled (they don't in LeetCode).
5. For prefix-sum + hash map, initialise \`{0:1}\` to handle subarrays starting at index 0.
`,

  commonMistakes: `# Common Mistakes — Hashing

1. **Iterating map in order** — Go maps have random iteration order.
2. **Forgetting {0:1} in prefix-sum hash** — misses subarrays from the start.
3. **Using map for small alphabets** — [26]int is faster and simpler.
4. **Modifying map during range loop** — can cause unpredictable behaviour.
5. **Nil map panic** — always initialise with make(map[K]V) before writing.
`,

  revision: `# Hashing — Quick Revision

| Problem | Technique | Complexity |
|---------|-----------|-----------|
| Two Sum | Complement map | O(n) / O(n) |
| Valid Anagram | Freq array | O(n) / O(1) |
| Group Anagrams | Freq key map | O(nk) / O(nk) |
| Subarray Sum = k | Prefix + map | O(n) / O(n) |
| Longest Consecutive | Set membership | O(n) / O(n) |
| LRU Cache | Map + doubly linked list | O(1) / O(n) |
`,

  codeExamples: [
    {
      language: 'go', label: 'Subarray Sum Equals K',
      code: `func subarraySum(nums []int, k int) int {
	count := 0
	prefixCount := map[int]int{0: 1}
	sum := 0
	for _, v := range nums {
		sum += v
		count += prefixCount[sum-k]
		prefixCount[sum]++
	}
	return count
}`,
    },
  ],

  resources: [
    { title: 'Hashing — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'Hash Table — GfG', url: 'https://www.geeksforgeeks.org/hashing-data-structure/', type: 'article', free: true },
    { title: 'LeetCode Hash Table Tag', url: 'https://leetcode.com/tag/hash-table/', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'hash-q1', question: 'What is the average-case time complexity of a hash map lookup?', options: ['O(log n)', 'O(n)', 'O(1)', 'O(n²)'], correctIndex: 2, explanation: 'With a good hash function and low load factor, lookups compute the hash and access the bucket in O(1) expected time.' },
    { id: 'hash-q2', question: 'In "Subarray Sum Equals K", why initialise prefixCount[0] = 1?', options: ['Prevents division by zero', 'Counts subarrays starting at index 0', 'Required by Go syntax', 'Avoids negative sums'], correctIndex: 1, explanation: 'If prefix sum at index i equals k, that subarray nums[0..i] should be counted. Initialising {0:1} accounts for this case.' },
    { id: 'hash-q3', question: 'What is the worst-case time complexity of a hash map with poor hash function?', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctIndex: 2, explanation: 'If all keys hash to the same bucket, every operation scans the entire bucket chain — O(n).' },
    { id: 'hash-q4', question: 'Which is more space-efficient for counting lowercase letter frequencies?', options: ['map[rune]int', 'map[string]int', '[26]int', 'Sorted slice'], correctIndex: 2, explanation: '[26]int is a fixed 104-byte array vs a hash map with per-entry overhead and dynamic allocation.' },
  ],

  questions: [
    {
      id: 'lc-49',
      title: 'Group Anagrams',
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Hash Map + Sorting',
      companies: ['Amazon', 'Google', 'Meta', 'Microsoft'],
      tags: ['hash-map', 'sorting', 'string'],
      problemStatement: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order. An Anagram is a word formed by rearranging the letters of another.',
      examples: [
        { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      ],
      constraints: ['1 ≤ strs.length ≤ 10⁴', '0 ≤ strs[i].length ≤ 100', 'strs[i] consists of lowercase English letters'],
      hints: ['Sort each string to get a canonical key', 'Group strings by their sorted key in a hash map'],
      bruteForce: 'For each string, compare with all others by sorting — O(n² * k log k).',
      optimizedSolution: 'Sort each string as hash key. Group in map. O(n * k log k)/O(nk).',
      timeComplexity: 'O(n * k log k)',
      spaceComplexity: 'O(n * k)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func groupAnagrams(strs []string) [][]string {
    m := make(map[string][]string)
    for _, s := range strs {
        key := sortString(s)
        m[key] = append(m[key], s)
    }
    result := make([][]string, 0, len(m))
    for _, group := range m {
        result = append(result, group)
    }
    return result
}

func sortString(s string) string {
    r := strings.Split(s, "")
    sort.Strings(r)
    return strings.Join(r, "")
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/group-anagrams/' },
      related: ['Valid Anagram', 'Find All Anagrams in a String'],
      dryRun: {
        title: 'Group Anagrams — Sort Key + Hash Map',
        input: 'strs = ["eat", "tea", "tan", "ate", "nat", "bat"]',
        result: 'Groups: [["eat","tea","ate"], ["tan","nat"], ["bat"]]',
        steps: [
          { line: 2, description: 'Initialize empty map `m`', variables: [{ name: 'm', value: '{}' }], dataState: 'm = {}' },
          { line: 4, description: 's="eat", sorted="aet". m["aet"] = ["eat"]', variables: [{ name: 's', value: '"eat"' }, { name: 'key', value: '"aet"' }, { name: 'm', value: '{"aet": ["eat"]}' }], dataState: 'm = {"aet": ["eat"]}' },
          { line: 4, description: 's="tea", sorted="aet". m["aet"] = ["eat", "tea"]', variables: [{ name: 's', value: '"tea"' }, { name: 'key', value: '"aet"' }, { name: 'm', value: '{"aet": ["eat","tea"]}' }], dataState: 'm = {"aet": ["eat", "tea"]}' },
          { line: 4, description: 's="tan", sorted="ant". m["ant"] = ["tan"]', variables: [{ name: 's', value: '"tan"' }, { name: 'key', value: '"ant"' }, { name: 'm', value: '{"aet":["eat","tea"], "ant":["tan"]}' }], dataState: 'm = {"aet": ["eat","tea"], "ant": ["tan"]}' },
          { line: 4, description: 's="ate", sorted="aet". m["aet"] = ["eat", "tea", "ate"]', variables: [{ name: 's', value: '"ate"' }, { name: 'key', value: '"aet"' }, { name: 'm', value: '{"aet":["eat","tea","ate"], "ant":["tan"]}' }], dataState: 'm = {"aet": ["eat","tea","ate"], "ant": ["tan"]}' },
          { line: 4, description: 's="nat", sorted="ant". m["ant"] = ["tan", "nat"]', variables: [{ name: 's', value: '"nat"' }, { name: 'key', value: '"ant"' }, { name: 'm', value: '{"aet":["eat","tea","ate"], "ant":["tan","nat"]}' }], dataState: 'm = {"aet": ["eat","tea","ate"], "ant": ["tan","nat"]}' },
          { line: 4, description: 's="bat", sorted="abt". m["abt"] = ["bat"]', variables: [{ name: 's', value: '"bat"' }, { name: 'key', value: '"abt"' }, { name: 'm', value: '{"aet":["eat","tea","ate"], "ant":["tan","nat"], "abt":["bat"]}' }], dataState: 'm = {"aet": ["eat","tea","ate"], "ant": ["tan","nat"], "abt": ["bat"]}' },
          { line: 7, description: 'Extract groups from map. Return [["eat","tea","ate"], ["tan","nat"], ["bat"]]', variables: [{ name: 'result', value: '3 groups' }], dataState: 'Result:\n["eat","tea","ate"]\n["tan","nat"]\n["bat"]' },
        ],
      },
    },
  ],
};
