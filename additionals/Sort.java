package additionals;

import java.util.Arrays;

public class Sort {
      static int[] bubble(int[] array) {
            int n = array.length;
            int count = 0;
            for (int i = 0; i < n - 1; i++) {
                  for (int j = 0; j < n - i - 1; j++) {
                        count++;
                        if (array[j] > array[j + 1]) {
                              int temp = array[j];
                              array[j] = array[j + 1];
                              array[j + 1] = temp;
                        }
                  }
            }
            System.out.println(count);
            return array;
      }

      public static void main(String[] args) {
            System.out.println(Arrays.toString(Sort.bubble(new int[] { 9, 1, 8, 5, 4, 7, 6, 3, 2 })));
            System.out.println(Arrays.toString(Sort.bubble(new int[] { 1, 2, 3, 4, 5, 6, 7, 8, 9 })));
      }
}
