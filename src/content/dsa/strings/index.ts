import type { TopicContent } from '../../types';

export const stringsContent: TopicContent = {
  slug: 'dsa/strings',
  title: 'Strings',
  category: 'dsa',
  theory: `# Strings

## Fundamentals

A string is an array of characters. In Go, strings are immutable byte slices (UTF-8). Use \`[]byte\` or \`[]rune\` for mutations.

\`\`\`go
s := "hello"
b := []byte(s)  // mutable copy
b[0] = 'H'
s2 := string(b) // "Hello"

// Runes for Unicode
r := []rune("café")
fmt.Println(len(r)) // 4 (not 5)
\`\`\`

## Key Operations & Complexity

| Operation | Time |
|-----------|------|
| Access char | O(1) |
| Concatenate (+) | O(n) — avoid in loops |
| strings.Builder | O(n) amortized |
| Substring | O(k) — Go shares backing array |
| Compare | O(n) |

## Common Algorithms

- **KMP** — O(n+m) pattern matching, avoiding O(nm) naive
- **Rabin-Karp** — rolling hash O(n+m) average
- **Z-algorithm** — O(n) longest prefix-suffix at each position

## Building Strings Efficiently

\`\`\`go
var sb strings.Builder
for _, ch := range chars {
    sb.WriteByte(ch)
}
result := sb.String()
\`\`\`
`,

  examples: `# Strings — Examples

## Valid Anagram

\`\`\`go
func isAnagram(s, t string) bool {
    if len(s) != len(t) { return false }
    freq := [26]int{}
    for i := range s {
        freq[s[i]-'a']++
        freq[t[i]-'a']--
    }
    for _, v := range freq { if v != 0 { return false } }
    return true
}
\`\`\`

## Group Anagrams

\`\`\`go
func groupAnagrams(strs []string) [][]string {
    groups := make(map[[26]int][]string)
    for _, s := range strs {
        var key [26]int
        for _, c := range s { key[c-'a']++ }
        groups[key] = append(groups[key], s)
    }
    res := make([][]string, 0, len(groups))
    for _, v := range groups { res = append(res, v) }
    return res
}
\`\`\`

## Longest Palindromic Substring (Expand Around Center)

\`\`\`go
func longestPalindrome(s string) string {
    best := ""
    expand := func(l, r int) {
        for l >= 0 && r < len(s) && s[l] == s[r] { l--; r++ }
        if r-l-1 > len(best) { best = s[l+1 : r] }
    }
    for i := range s { expand(i, i); expand(i, i+1) }
    return best
}
\`\`\`
`,

  patterns: `# String Patterns

## 1. Character Frequency Array
Use \`[26]int\` for lowercase letters — O(1) space instead of hash map.

## 2. Sliding Window for Substrings
Longest/shortest substring satisfying a character constraint.

## 3. Two Pointer for Palindromes
Expand outward from center (handles odd and even length).

## 4. Stack for Bracket/Encoding Problems
Process characters with a stack for nested structures.

## 5. Rolling Hash
Efficient substring matching and duplicate detection.
`,

  interviewTips: `# Interview Tips — Strings

1. Clarify: ASCII only? lowercase? Unicode? Case-sensitive?
2. Avoid string concatenation in loops — use \`strings.Builder\`.
3. For anagram problems, use \`[26]int\` frequency array if lowercase-only.
4. Two pointer for palindrome problems.
5. Sliding window for "longest/shortest substring" problems.
6. State whether you're treating the string as bytes or runes (Unicode).
`,

  commonMistakes: `# Common Mistakes — Strings

1. **String += in loop** — O(n²) total. Use strings.Builder.
2. **Byte vs rune** — len(s) counts bytes, not Unicode characters.
3. **Missing edge cases** — empty string, single character, all same chars.
4. **Mutating string directly** — strings are immutable in Go.
5. **Off-by-one in substring** — s[l+1:r] in Go is exclusive on right.
`,

  revision: `# Strings — Quick Revision

| Problem | Pattern | Complexity |
|---------|---------|-----------|
| Valid anagram | Freq array | O(n) / O(1) |
| Group anagrams | Freq key map | O(nk) / O(nk) |
| Longest no-repeat | Sliding window | O(n) / O(k) |
| Longest palindrome | Expand center | O(n²) / O(1) |
| Min window substr | Sliding window | O(n+m) / O(m) |
| Is palindrome | Two pointer | O(n) / O(1) |
`,

  codeExamples: [
    {
      language: 'go', label: 'Group Anagrams',
      code: `func groupAnagrams(strs []string) [][]string {
	groups := make(map[[26]int][]string)
	for _, s := range strs {
		var key [26]int
		for _, c := range s {
			key[c-'a']++
		}
		groups[key] = append(groups[key], s)
	}
	res := make([][]string, 0, len(groups))
	for _, v := range groups {
		res = append(res, v)
	}
	return res
}`,
    },
  ],

  resources: [
    { title: 'Strings — NeetCode', url: 'https://neetcode.io/roadmap', type: 'video', free: true },
    { title: 'String Algorithms — CP-Algorithms', url: 'https://cp-algorithms.com/string/prefix-function.html', type: 'article', free: true },
    { title: 'LeetCode String Tag', url: 'https://leetcode.com/tag/string/', type: 'docs', free: true },
  ],

  quiz: [
    { id: 'str-q1', question: 'What is the time complexity of naive string concatenation s += c in a loop of n iterations?', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(1)'], correctIndex: 2, explanation: 'Each += creates a new string copying all previous characters. Total work: 1+2+...+n = O(n²). Use strings.Builder instead.' },
    { id: 'str-q2', question: 'Which data structure is best for the "Minimum Window Substring" problem?', options: ['Stack', 'Sliding window with frequency map', 'Binary search', 'Trie'], correctIndex: 1, explanation: 'Sliding window with a frequency map tracks how many characters from t are satisfied in the current window (have/need counters).' },
    { id: 'str-q3', question: 'For lowercase English letters only, what is the most space-efficient way to count character frequencies?', options: ['Hash map', '[26]int array', 'Sorted array', 'Linked list'], correctIndex: 1, explanation: '[26]int uses exactly 26 integers (104 bytes) vs a hash map with overhead. Constant O(1) lookup and space.' },
    { id: 'str-q4', question: 'len(s) in Go returns:', options: ['Number of characters', 'Number of bytes', 'Number of runes', 'Number of words'], correctIndex: 1, explanation: 'Go strings are UTF-8 encoded byte sequences. len(s) counts bytes. For Unicode character count, convert to []rune first.' },
  ],

  questions: [
    {
      id: 'lc-3',
      title: 'Longest Substring Without Repeating Characters',
      difficulty: 'medium',
      platform: 'LeetCode',
      pattern: 'Sliding Window',
      companies: ['Amazon', 'Google', 'Meta', 'Microsoft', 'Apple'],
      tags: ['string', 'sliding-window', 'hash-set'],
      problemStatement: 'Given a string s, find the length of the longest substring without repeating characters.',
      examples: [
        { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with length 3' },
        { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with length 1' },
        { input: 's = "pwwkew"', output: '3', explanation: 'The answer is "wke", with length 3' },
      ],
      constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces'],
      hints: ['Use a sliding window with two pointers', 'Track characters in the current window with a set or map'],
      bruteForce: 'Check all substrings for uniqueness — O(n^2) time, O(min(n,m)) space.',
      optimizedSolution: 'Sliding window: expand right, shrink left when duplicate found. Track max length. O(n)/O(min(n,m)).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(min(n, m))',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func lengthOfLongestSubstring(s string) int {
    seen := make(map[byte]int)
    left, maxLen := 0, 0
    for right := 0; right < len(s); right++ {
        if idx, ok := seen[s[right]]; ok && idx >= left {
            left = idx + 1
        }
        seen[s[right]] = right
        if right-left+1 > maxLen {
            maxLen = right - left + 1
        }
    }
    return maxLen
}`,
        },
        {
          language: 'typescript', label: 'TypeScript',
          code: `function lengthOfLongestSubstring(s: string): number {
    const seen = new Map<string, number>();
    let left = 0, maxLen = 0;
    for (let right = 0; right < s.length; right++) {
        const idx = seen.get(s[right]);
        if (idx !== undefined && idx >= left) {
            left = idx + 1;
        }
        seen.set(s[right], right);
        maxLen = Math.max(maxLen, right - left + 1);
    }
    return maxLen;
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      related: ['Longest Substring with At Most Two Distinct', 'Longest Substring with At Most K Distinct'],
      dryRun: {
        title: 'Longest Substring — Sliding Window',
        input: 's = "abcabcbb"',
        result: 'Max length = 3 (substring "abc")',
        steps: [
          { line: 2, description: 'Initialize seen = {}, left = 0, maxLen = 0', variables: [{ name: 'seen', value: '{}' }, { name: 'left', value: '0' }, { name: 'maxLen', value: '0' }], dataState: 's = a b c a b c b b\n    ^right\nleft = 0, window = ""' },
          { line: 4, description: 'right=0, char=a. Not in window. seen[a]=0. maxLen = max(0, 0-0+1) = 1', variables: [{ name: 'right', value: '0' }, { name: 'char', value: 'a' }, { name: 'seen', value: '{a:0}' }, { name: 'left', value: '0' }, { name: 'maxLen', value: '1' }], dataState: 's = a b c a b c b b\n    ^\nwindow = "a", maxLen = 1' },
          { line: 4, description: 'right=1, char=b. Not in window. seen[b]=1. maxLen = max(1, 2) = 2', variables: [{ name: 'right', value: '1' }, { name: 'char', value: 'b' }, { name: 'seen', value: '{a:0, b:1}' }, { name: 'left', value: '0' }, { name: 'maxLen', value: '2' }], dataState: 's = a b c a b c b b\n      ^\nwindow = "ab", maxLen = 2' },
          { line: 4, description: 'right=2, char=c. Not in window. seen[c]=2. maxLen = max(2, 3) = 3', variables: [{ name: 'right', value: '2' }, { name: 'char', value: 'c' }, { name: 'seen', value: '{a:0, b:1, c:2}' }, { name: 'left', value: '0' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n        ^\nwindow = "abc", maxLen = 3' },
          { line: 5, description: 'right=3, char=a. a is in seen at idx 0 >= left 0. Move left = 0+1 = 1', variables: [{ name: 'right', value: '3' }, { name: 'char', value: 'a' }, { name: 'seen', value: '{a:0, b:1, c:2}' }, { name: 'left', value: '1' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n          ^\nleft moves to 1\nwindow = "bca"' },
          { line: 6, description: 'Update seen[a]=3. maxLen = max(3, 3-1+1) = 3', variables: [{ name: 'seen', value: '{a:3, b:1, c:2}' }, { name: 'left', value: '1' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n          ^\nwindow = "bca", maxLen = 3' },
          { line: 5, description: 'right=4, char=b. b in seen at idx 1 >= left 1. Move left = 1+1 = 2', variables: [{ name: 'right', value: '4' }, { name: 'char', value: 'b' }, { name: 'seen', value: '{a:3, b:1, c:2}' }, { name: 'left', value: '2' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n            ^\nleft moves to 2\nwindow = "cab"' },
          { line: 6, description: 'Update seen[b]=4. maxLen = max(3, 3) = 3', variables: [{ name: 'seen', value: '{a:3, b:4, c:2}' }, { name: 'left', value: '2' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n            ^\nwindow = "cab", maxLen = 3' },
          { line: 5, description: 'right=5, char=c. c in seen at idx 2 >= left 2. Move left = 2+1 = 3', variables: [{ name: 'right', value: '5' }, { name: 'char', value: 'c' }, { name: 'seen', value: '{a:3, b:4, c:2}' }, { name: 'left', value: '3' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n              ^\nleft moves to 3\nwindow = "abc"' },
          { line: 6, description: 'Update seen[c]=5. maxLen = max(3, 3) = 3', variables: [{ name: 'seen', value: '{a:3, b:4, c:5}' }, { name: 'left', value: '3' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n              ^\nwindow = "abc", maxLen = 3' },
          { line: 5, description: 'right=6, char=b. b in seen at idx 4 >= left 3. Move left = 4+1 = 5', variables: [{ name: 'right', value: '6' }, { name: 'char', value: 'b' }, { name: 'seen', value: '{a:3, b:4, c:5}' }, { name: 'left', value: '5' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n                ^\nleft moves to 5\nwindow = "cb"' },
          { line: 6, description: 'Update seen[b]=6. maxLen = max(3, 2) = 3', variables: [{ name: 'seen', value: '{a:3, b:6, c:5}' }, { name: 'left', value: '5' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n                ^\nwindow = "cb", maxLen = 3' },
          { line: 5, description: 'right=7, char=b. b in seen at idx 6 >= left 5. Move left = 6+1 = 7', variables: [{ name: 'right', value: '7' }, { name: 'char', value: 'b' }, { name: 'seen', value: '{a:3, b:6, c:5}' }, { name: 'left', value: '7' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n                  ^\nleft moves to 7\nwindow = "b"' },
          { line: 6, description: 'Update seen[b]=7. maxLen = max(3, 1) = 3. Loop ends.', variables: [{ name: 'seen', value: '{a:3, b:7, c:5}' }, { name: 'left', value: '7' }, { name: 'maxLen', value: '3' }], dataState: 's = a b c a b c b b\n                  ^\nwindow = "b", maxLen = 3' },
          { line: 9, description: 'Return maxLen = 3', variables: [{ name: 'result', value: '3' }], dataState: 'Result: 3\nLongest substring: "abc"' },
        ],
      },
    },
    {
      id: 'lc-14',
      title: 'Longest Common Prefix',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Vertical Scanning',
      companies: ['Google', 'Amazon', 'Microsoft'],
      tags: ['string', 'array'],
      problemStatement: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
      examples: [
        { input: 'strs = ["flower","flow","flight"]', output: '"fl"' },
        { input: 'strs = ["dog","racecar","car"]', output: '""' },
      ],
      constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of lowercase English letters'],
      hints: ['Compare characters at the same index across all strings', 'Stop when a mismatch is found or a string ends'],
      bruteForce: 'Compare all pairs of strings — O(S) where S is total characters.',
      optimizedSolution: 'Vertical scanning: check char at index 0 across all strings, then index 1, etc. O(S)/O(1).',
      timeComplexity: 'O(S)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func longestCommonPrefix(strs []string) string {
    if len(strs) == 0 { return "" }
    for i := 0; i < len(strs[0]); i++ {
        c := strs[0][i]
        for j := 1; j < len(strs); j++ {
            if i == len(strs[j]) || strs[j][i] != c {
                return strs[0][:i]
            }
        }
    }
    return strs[0]
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/longest-common-prefix/' },
      related: ['Longest Common Subsequence', 'String Compression'],
      dryRun: {
        title: 'Longest Common Prefix — Vertical Scanning',
        input: 'strs = ["flower", "flow", "flight"]',
        result: 'Common prefix = "fl"',
        steps: [
          { line: 3, description: 'i=0, c=strs[0][0]="f". Check all strings at index 0.', variables: [{ name: 'i', value: '0' }, { name: 'c', value: 'f' }], dataState: 'strs[0] = f l o w e r\n         ^\nstrs[1] = f l o w\n         ^\nstrs[2] = f l i g h t\n         ^\nAll match "f"' },
          { line: 3, description: 'i=1, c=strs[0][1]="l". Check all strings at index 1.', variables: [{ name: 'i', value: '1' }, { name: 'c', value: 'l' }], dataState: 'strs[0] = f l o w e r\n           ^\nstrs[1] = f l o w\n           ^\nstrs[2] = f l i g h t\n           ^\nAll match "l"' },
          { line: 5, description: 'i=2, c=strs[0][2]="o". strs[2][2]="i" != "o". Mismatch! Return strs[0][:2] = "fl"', variables: [{ name: 'i', value: '2' }, { name: 'c', value: 'o' }, { name: 'result', value: '"fl"' }], dataState: 'strs[0] = f l o w e r\n             ^\nstrs[1] = f l o w\n             ^\nstrs[2] = f l i g h t\n             ^\nMISMATCH: "o" vs "i"\nReturn "fl"' },
        ],
      },
    },
    {
      id: 'lc-125',
      title: 'Valid Palindrome',
      difficulty: 'easy',
      platform: 'LeetCode',
      pattern: 'Two Pointers',
      companies: ['Amazon', 'Microsoft', 'Google', 'Meta'],
      tags: ['string', 'two-pointers'],
      problemStatement: 'Given a string s, return true if it is a palindrome, considering only alphanumeric characters and ignoring case.',
      examples: [
        { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome' },
        { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome' },
      ],
      constraints: ['1 <= s.length <= 2 * 10^5', 's consists of printable ASCII characters'],
      hints: ['Use two pointers from left and right', 'Skip non-alphanumeric characters', 'Compare lowercase versions'],
      bruteForce: 'Filter and reverse the string, then compare — O(n) time, O(n) space.',
      optimizedSolution: 'Two pointers: left from start, right from end. Skip non-alphanumeric. Compare lowercased chars. O(n)/O(1).',
      timeComplexity: 'O(n)',
      spaceComplexity: 'O(1)',
      codeExamples: [
        {
          language: 'go', label: 'Go',
          code: `func isPalindrome(s string) bool {
    left, right := 0, len(s)-1
    for left < right {
        for left < right && !isAlnum(s[left]) { left++ }
        for left < right && !isAlnum(s[right]) { right-- }
        if toLower(s[left]) != toLower(s[right]) {
            return false
        }
        left++
        right--
    }
    return true
}

func isAlnum(c byte) bool {
    return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9')
}

func toLower(c byte) byte {
    if c >= 'A' && c <= 'Z' { return c + 32 }
    return c
}`,
        },
      ],
      practiceUrls: { LeetCode: 'https://leetcode.com/problems/valid-palindrome/' },
      related: ['Palindrome Number', 'Valid Palindrome II'],
      dryRun: {
        title: 'Valid Palindrome — Two Pointers',
        input: 's = "race a car"',
        result: 'Return false — not a palindrome',
        steps: [
          { line: 2, description: 'Initialize left = 0, right = 9', variables: [{ name: 'left', value: '0' }, { name: 'right', value: '9' }], dataState: 's = r a c e   a   c a r\n    ^left            ^right' },
          { line: 5, description: 'Both s[0]="r" and s[9]="r" are alphanumeric. toLower("r")==toLower("r"). Match! Advance both.', variables: [{ name: 'left', value: '1' }, { name: 'right', value: '8' }], dataState: 's = r a c e   a   c a r\n      ^left        ^right\n"r" == "r" ✓' },
          { line: 5, description: 's[1]="a" and s[8]="a". Match! Advance both.', variables: [{ name: 'left', value: '2' }, { name: 'right', value: '7' }], dataState: 's = r a c e   a   c a r\n        ^left    ^right\n"a" == "a" ✓' },
          { line: 5, description: 's[2]="c" and s[7]="c". Match! Advance both.', variables: [{ name: 'left', value: '3' }, { name: 'right', value: '6' }], dataState: 's = r a c e   a   c a r\n          ^left  ^right\n"c" == "c" ✓' },
          { line: 4, description: 's[3]="e" is alphanumeric. s[6]=" " is NOT. Skip right: right--', variables: [{ name: 'left', value: '3' }, { name: 'right', value: '5' }], dataState: 's = r a c e   a   c a r\n          ^left^right\nSkip space at right' },
          { line: 5, description: 's[3]="e" vs s[5]="a". toLower("e") != toLower("a"). MISMATCH! Return false.', variables: [{ name: 'left', value: '3' }, { name: 'right', value: '5' }, { name: 'result', value: 'false' }], dataState: 's = r a c e   a   c a r\n          ^left ^right\n"e" != "a" ✗\nNOT A PALINDROME!' },
        ],
      },
    },
  ],
};
