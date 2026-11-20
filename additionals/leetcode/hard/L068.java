import java.util.*;

/**
 * 068. Text Justification
 * 
 * https://leetcode.com/problems/text-justification/
 * 
 * Given an array of strings words and a width maxWidth, format the text such
 * that each line has exactly maxWidth characters and is fully (left and right)
 * justified.
 * 
 * You should pack your words in a greedy approach; that is, pack as many words
 * as you can in each line. Pad extra spaces ' ' when necessary so that each
 * line has exactly maxWidth characters.
 * 
 * Extra spaces between words should be distributed as evenly as possible. If
 * the number of spaces on a line does not divide evenly between words, the
 * empty slots on the left will be assigned more spaces than the slots on the
 * right.
 * 
 * For the last line of text, it should be left-justified, and no extra space is
 * inserted between words.
 * 
 * Note:
 * 
 * A word is defined as a character sequence consisting of non-space characters
 * only.
 * Each word's length is guaranteed to be greater than 0 and not exceed
 * maxWidth.
 * The input array words contains at least one word.
 * 
 * 
 * 
 * Example 1:
 * 
 * Input: words = ["This", "is", "an", "example", "of", "text",
 * "justification."], maxWidth = 16
 * Output:
 * [
 * "This is an",
 * "example of text",
 * "justification. "
 * ]
 * 
 * Example 2:
 * 
 * Input: words = ["What","must","be","acknowledgment","shall","be"], maxWidth =
 * 16
 * Output:
 * [
 * "What must be",
 * "acknowledgment ",
 * "shall be "
 * ]
 * Explanation: Note that the last line is "shall be " instead of "shall be",
 * because the last line must be left-justified instead of fully-justified.
 * Note that the second line is also left-justified because it contains only one
 * word.
 * 
 * Example 3:
 * 
 * Input: words =
 * ["Science","is","what","we","understand","well","enough","to","explain","to","a","computer.","Art","is","everything","else","we","do"],
 * maxWidth = 20
 * Output:
 * [
 * "Science is what we",
 * "understand well",
 * "enough to explain to",
 * "a computer. Art is",
 * "everything else we",
 * "do "
 * ]
 * 
 * 
 * 
 * Constraints:
 * 
 * 1 <= words.length <= 300
 * 1 <= words[i].length <= 20
 * words[i] consists of only English letters and symbols.
 * 1 <= maxWidth <= 100
 * words[i].length <= maxWidth
 * 
 */

// Algorithmic Steps
// 1. Initialise i = 0 to track the first word of the current line.
// 2. Initialise j = i and letters = 0.
// 3. Greedily include words while the following condition holds:
//    letters + words[j].length() + (j - i) <= maxWidth
//    - letters accounts for the total characters in the words.
//    - (j - i) accounts for the minimum spaces required between words.
// 4. Once no more words fit, calculate:
//    - wordCount = j - i
//    - spaces = maxWidth - letters
//    - gaps = wordCount - 1
// 5. Format the line:
//    - Last line or single word: Add one space between consecutive words and pad the remaining width at the end.
//    - Normal line: Calculate spaces / gaps for the minimum spaces per gap and spaces % gaps for the additional spaces.
//    - Distribute the additional spaces from left to right, giving the leftmost gaps one extra space.
// 6. Add the formatted line to the result.
// 7. Move i = j and repeat until every word has been processed.

public class L068 {
      public List<String> fullJustify(String[] words, int maxWidth) {
            List<String> result = new ArrayList<>();
            int n = words.length, i = 0;

            while (i < n) {
                  int j = i, letters = 0;

                  while (j < n && letters + words[j].length() + (j - i) <= maxWidth) {
                        letters += words[j].length();
                        j++;
                  }

                  int wordCount = j - i, spaces = maxWidth - letters;
                  StringBuilder line = new StringBuilder();

                  if (j == n || wordCount == 1) {
                        for (int k = i; k < j; k++) {
                              line.append(words[k]);
                              if (k < j - 1)
                                    line.append(" ");
                        }
                        while (line.length() < maxWidth)
                              line.append(" ");
                  } else {
                        int gaps = wordCount - 1;
                        int spacesPerGap = spaces / gaps, extraSpaces = spaces % gaps;

                        for (int k = i; k < j; k++) {
                              line.append(words[k]);

                              if (k < j - 1) {
                                    int count = spacesPerGap + (k - i < extraSpaces ? 1 : 0);
                                    while (count-- > 0)
                                          line.append(" ");
                              }
                        }
                  }

                  result.add(line.toString());
                  i = j;
            }

            return result;
      }

      public static void main(String[] args) {
            L068 s = new L068();

            System.out.println(s.fullJustify(new String[] { "This", "is", "an", "example", "of", "text", "justification." }, 16));
            System.out.println(s.fullJustify(new String[] { "What", "must", "be", "acknowledgment", "shall", "be" }, 16));
            System.out.println(s.fullJustify(new String[] { "Science", "is", "what", "we", "understand", "well", "enough", "to", "explain", "to", "a", "computer.", "Art", "is", "everything", "else", "we", "do" }, 20));
      }
}
