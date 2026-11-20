/**
 * 041. First Missing Positive
 * 
 * https://leetcode.com/problems/first-missing-positive/
 * 
 * Given an unsorted integer array nums. Return the smallest positive integer
 * that is not present in nums.
 * 
 * You must implement an algorithm that runs in O(n) time and uses O(1)
 * auxiliary space.
 * 
 * 
 * 
 * Example 1:
 * 
 * Input: nums = [1,2,0]
 * Output: 3
 * Explanation: The numbers in the range [1,2] are all in the array.
 * 
 * Example 2:
 * 
 * Input: nums = [3,4,-1,1]
 * Output: 2
 * Explanation: 1 is in the array but 2 is missing.
 * 
 * Example 3:
 * 
 * Input: nums = [7,8,9,11,12]
 * Output: 1
 * Explanation: The smallest positive integer 1 is missing.
 * 
 * 
 * 
 * Constraints:
 * 
 * 1 <= nums.length <= 105
 * -231 <= nums[i] <= 231 - 1
 * 
 */

// Algorithmic Steps
// 1. Iterate through the array using index i.
// 2. Check whether nums[i] is within the valid range [1, n].
// 3. If valid, calculate its correct index: nums[i] - 1.
// 4. Check whether the value at that correct index is already equal to nums[i].
// 5. If not, swap nums[i] with nums[nums[i] - 1].
// 6. Repeat the process at the same index until the current value is either invalid or already in its correct position.
// 7. Once all elements have been processed, iterate through the array again.
// 8. The first index where nums[i] != i + 1 indicates that i + 1 is the missing positive integer.
// 9. If every element is at its correct position, return n + 1.

public class L041 {
      public int firstMissingPositive(int[] nums) {
            int n = nums.length;

            for (int i = 0; i < n; i++) {
                  while (nums[i] >= 1 && nums[i] <= n && nums[i] != nums[nums[i] - 1]) {
                        int temp = nums[i];
                        nums[i] = nums[temp - 1];
                        nums[temp - 1] = temp;
                  }
            }

            for (int i = 0; i < n; i++) {
                  if (nums[i] != i + 1)
                        return i + 1;
            }

            return n + 1;
      }

      public static void main(String[] args) {
            L041 s = new L041();
            System.out.println(s.firstMissingPositive(new int[] { 1, 2, 0 }));
            System.out.println(s.firstMissingPositive(new int[] { 3, 4, -1, 1 }));
            System.out.println(s.firstMissingPositive(new int[] { 7, 8, 9, 11, 12 }));
      }
}
