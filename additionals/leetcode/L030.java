import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 030. Substring with Concatenation of All Words
 * 
 * https://leetcode.com/problems/substring-with-concatenation-of-all-words/
 * 
 * You are given a string s and an array of strings words. All the strings of
 * words are of the same length.
 * 
 * A concatenated string is a string that exactly contains all the strings of
 * any permutation of words concatenated.
 * 
 * For example, if words = ["ab","cd","ef"], then "abcdef", "abefcd", "cdabef",
 * "cdefab", "efabcd", and "efcdab" are all concatenated strings. "acdbef" is
 * not a concatenated string because it is not the concatenation of any
 * permutation of words.
 * 
 * Return an array of the starting indices of all the concatenated substrings in
 * s. You can return the answer in any order.
 * 
 * 
 * 
 * Example 1:
 * 
 * Input: s = "barfoothefoobarman", words = ["foo","bar"]
 * 
 * Output: [0,9]
 * 
 * Explanation:
 * 
 * The substring starting at 0 is "barfoo". It is the concatenation of
 * ["bar","foo"] which is a permutation of words.
 * The substring starting at 9 is "foobar". It is the concatenation of
 * ["foo","bar"] which is a permutation of words.
 * 
 * Example 2:
 * 
 * Input: s = "wordgoodgoodgoodbestword", words = ["word","good","best","word"]
 * 
 * Output: []
 * 
 * Explanation:
 * 
 * There is no concatenated substring.
 * 
 * Example 3:
 * 
 * Input: s = "barfoofoobarthefoobarman", words = ["bar","foo","the"]
 * 
 * Output: [6,9,12]
 * 
 * Explanation:
 * 
 * The substring starting at 6 is "foobarthe". It is the concatenation of
 * ["foo","bar","the"].
 * The substring starting at 9 is "barthefoo". It is the concatenation of
 * ["bar","the","foo"].
 * The substring starting at 12 is "thefoobar". It is the concatenation of
 * ["the","foo","bar"].
 * 
 * 
 * 
 * Constraints:
 * 
 * 1 <= s.length <= 104
 * 1 <= words.length <= 5000
 * 1 <= words[i].length <= 30
 * s and words[i] consist of lowercase English letters.
 * 
 */

// Algorithmic Steps
// 1. Calculate wordLength, wordCount and totalLength.
// 2. Create a HashMap called required to store the frequency of every word in
// words.
// 3. Iterate through s using wordLength different starting offsets (0 to
// wordLength - 1).
// 4. For each offset, initialise:
// - left — starting position of the current window.
// - right — position of the next word to examine.
// - seen — frequency map of words inside the current window.
// - matchedWords — total number of words currently inside the window.
// 5. Extract the next wordLength characters using substring().
// 6. Check whether the extracted word exists in required.
// - Not found: Clear seen, reset matchedWords and move left beyond the invalid
// word.
// - Found: Increment its frequency in seen and increment matchedWords.
// 7. Check whether the frequency of the extracted word exceeds its required
// frequency.
// - If it does, remove words from the left of the window until the frequency
// becomes valid.
// 8. When matchedWords == wordCount, add left to the result.
// 9. Move left forward by one word to allow overlapping matches.
// 10. Repeat until all offsets have been examined.

public class L030 {
      public List<Integer> findSubstring(String s, String[] words) {
            List<Integer> result = new ArrayList<>();
            int wordLength = words[0].length(), wordCount = words.length, totalLength = wordLength * wordCount;
            if (s.length() < totalLength)
                  return result;

            Map<String, Integer> required = new HashMap<>();
            for (String word : words)
                  required.put(word, required.getOrDefault(word, 0) + 1);

            for (int offset = 0; offset < wordLength; offset++) {
                  Map<String, Integer> seen = new HashMap<>();
                  int left = offset, matchedWords = 0;

                  for (int right = offset; right + wordLength <= s.length(); right += wordLength) {
                        String word = s.substring(right, right + wordLength);

                        if (!required.containsKey(word)) {
                              seen.clear();
                              matchedWords = 0;
                              left = right + wordLength;
                              continue;
                        }

                        seen.put(word, seen.getOrDefault(word, 0) + 1);
                        matchedWords++;

                        while (seen.get(word) > required.get(word)) {
                              String first = s.substring(left, left + wordLength);
                              seen.put(first, seen.get(first) - 1);
                              matchedWords--;
                              left += wordLength;
                        }

                        if (matchedWords == wordCount) {
                              result.add(left);

                              String first = s.substring(left, left + wordLength);
                              seen.put(first, seen.get(first) - 1);
                              matchedWords--;
                              left += wordLength;
                        }
                  }
            }

            return result;
      }

      public static void main(String[] args) {
            L030 s = new L030();
            System.out.println(s.findSubstring("barfoothefoobarman", new String[] { "foo", "bar" }));
            System.out.println(
                        s.findSubstring("wordgoodgoodgoodbestword", new String[] { "word", "good", "best", "word" }));
            System.out.println(s.findSubstring("barfoofoobarthefoobarman", new String[] { "bar", "foo", "the" }));
      }
}
