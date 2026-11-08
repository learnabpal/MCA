class Solution {
      int solution(String str, String ptrn) {
            int strLen = str.length();
            int ptrnLen = ptrn.length();

            // result must be +1 size of the pattern
            // as the first index is for the 'empty string' count
            int[] counts = new int[ptrnLen + 1];
            counts[0] = 1; // as empty string can be sequenced by only one way.

            for (int i = 0; i < strLen; i++) {
                  for (int j = ptrnLen; j > 0; j--) {
                        char sChar = str.charAt(i);
                        char pChar = ptrn.charAt(j - 1);
                        System.out.println(sChar + " " + pChar + " " + (j - 1));
                        if (sChar == pChar) {
                              counts[j] += counts[j - 1];
                        }
                  }
                  // output
                  System.out.print("- ");
                  for (int c = 0; c < ptrnLen; c++) {
                        System.out.print(ptrn.charAt(c) + " ");
                  }
                  System.out.println();
                  for (int c = 0; c < counts.length; c++) {
                        System.out.print(counts[c] + " ");
                  }
                  System.out.println("\n\n");
            }

            return counts[ptrnLen]; // the last item
      }

      public static void main(String[] args) {
            Solution s = new Solution();
            System.out.println(s.solution("rabbbit", "rabbit"));
      }
}