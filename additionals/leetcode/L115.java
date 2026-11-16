/**
 * 115. Distinct Subsequences
 * 
 * https://leetcode.com/problems/distinct-subsequences/
 * 
 * Given two strings s and t, return the number of distinct subsequences of s
 * which equals t.
 * 
 * The test cases are generated so that the answer fits on a 32-bit signed
 * integer.
 * 
 * 
 * 
 * Example 1:
 * 
 * Input: s = "rabbbit", t = "rabbit"
 * Output: 3
 * Explanation:
 * As shown below, there are 3 ways you can generate "rabbit" from s.
 * rabbbit
 * rabbbit
 * rabbbit
 * 
 * Example 2:
 * 
 * Input: s = "babgbag", t = "bag"
 * Output: 5
 * Explanation:
 * As shown below, there are 5 ways you can generate "bag" from s.
 * babgbag
 * babgbag
 * babgbag
 * babgbag
 * babgbag
 * 
 * 
 * 
 * Constraints:
 * 
 * 1 <= s.length, t.length <= 1000
 * s and t consist of English letters.
 * 
 */

// Algorithmic Steps
// 1. Create a DP array of size t.length() + 1.
// 2. Let dp[j] represent the number of ways to form the first j characters of t
// using the characters of s processed so far.
// 3. Initialise dp[0] = 1, because an empty string can always be formed in
// exactly one way: by selecting nothing.
// 4. Iterate through every character of s.
// 5. For each character, iterate through t backwards, from its last index to
// its first.
// 6. Compare the current character of s with t.charAt(j - 1).
// 7. If they match, update:
// dp[j] = dp[j] + dp[j - 1]
// - dp[j] represents existing ways that do not use the current character.
// - dp[j - 1] represents ways that can be extended using the current character.
// 8. After processing all characters of s, return dp[t.length()].

public class L115 {
      public int numDistinct(String s, String t) {
            int[] dp = new int[t.length() + 1];
            dp[0] = 1;

            for (int i = 0; i < s.length(); i++) {
                  for (int j = t.length(); j >= 1; j--) {
                        if (s.charAt(i) == t.charAt(j - 1)) {
                              dp[j] += dp[j - 1];
                        }
                  }
            }

            return dp[t.length()];
      }

      public static void main(String[] args) {
            L115 s = new L115();
            System.out.println(s.numDistinct("rabbbit", "rabbit"));
      }
}