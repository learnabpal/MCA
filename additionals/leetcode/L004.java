/**
 * 004. Median of Two Sorted Arrays
 *
 * https://leetcode.com/problems/median-of-two-sorted-arrays/
 *
 * Given two sorted arrays nums1 and nums2 of size m and n respectively, return
 * the median of the two sorted arrays.
 *
 * The overall run time complexity should be O(log (m+n)).
 *
 *
 *
 * Example 1:
 *
 * Input: nums1 = [1,3], nums2 = [2]
 * Output: 2.00000
 * Explanation: merged array = [1,2,3] and median is 2.
 *
 * Example 2:
 *
 * Input: nums1 = [1,2], nums2 = [3,4]
 * Output: 2.50000
 * Explanation: merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.
 *
 *
 *
 * Constraints:
 *
 * nums1.length == m
 * nums2.length == n
 * 0 <= m <= 1000
 * 0 <= n <= 1000
 * 1 <= m + n <= 2000
 * -106 <= nums1[i], nums2[i] <= 106
 *
 */

// Algorithmic Steps
// 1. Ensure nums1 is the smaller array. This minimises the binary search range.
// 2. Calculate totalLeft = (m + n + 1) / 2. This is the number of elements that must be present in the left half.
// 3. Initialise binary search boundaries: low = 0 and high = m.
// 4. Calculate the partition in the first array: partitionX = (low + high) / 2.
// 5. Calculate the corresponding partition in the second array: partitionY = totalLeft - partitionX.
// 6. Identify the four boundary elements:
//    - maxLeftX — largest element on the left of nums1.
//    - minRightX — smallest element on the right of nums1.
//    - maxLeftY — largest element on the left of nums2.
//    - minRightY — smallest element on the right of nums2.
// 7. Handle partition boundaries using Integer.MIN_VALUE and Integer.MAX_VALUE when a partition is at either end of an array.
// 8. Check whether the partitions are valid:
//    - maxLeftX <= minRightY
//    - maxLeftY <= minRightX
// 9. If valid, calculate the median:
//    - Odd total length: Return max(maxLeftX, maxLeftY).
//    - Even total length: Return the average of max(maxLeftX, maxLeftY) and min(minRightX, minRightY).
// 10. If maxLeftX > minRightY, move the binary search towards the left by reducing high.
// 11. Otherwise, move towards the right by increasing low.
// 12. Repeat until a valid partition is found.

 public class L004 {
       public double findMedianSortedArrays(int[] nums1, int[] nums2) {
             if (nums1.length > nums2.length) {
                   int[] temp = nums1;
                   nums1 = nums2;
                   nums2 = temp;
             }

             int m = nums1.length, n = nums2.length;
             int totalLeft = (m + n + 1) / 2;
             int low = 0, high = m;

             while (low <= high) {
                   int partitionX = (low + high) / 2;
                   int partitionY = totalLeft - partitionX;

                   int maxLeftX = partitionX == 0 ? Integer.MIN_VALUE : nums1[partitionX - 1];
                   int minRightX = partitionX == m ? Integer.MAX_VALUE : nums1[partitionX];

                   int maxLeftY = partitionY == 0 ? Integer.MIN_VALUE : nums2[partitionY - 1];
                   int minRightY = partitionY == n ? Integer.MAX_VALUE : nums2[partitionY];

                   if (maxLeftX <= minRightY && maxLeftY <= minRightX) {
                         if ((m + n) % 2 == 1) {
                               return Math.max(maxLeftX, maxLeftY);
                         }

                         return ((double) Math.max(maxLeftX, maxLeftY) +
                                     Math.min(minRightX, minRightY)) / 2;
                   }

                   if (maxLeftX > minRightY) {
                         high = partitionX - 1;
                   } else {
                         low = partitionX + 1;
                   }
             }

             throw new IllegalArgumentException("Input arrays must be sorted.");
       }

      public static void main(String[] args) {
            L004 s = new L004();
            System.out.println(s.findMedianSortedArrays(new int[] { 1, 3 }, new int[] { 2 }));
            System.out.println(s.findMedianSortedArrays(new int[] { 1, 2 }, new int[] { 3, 4 }));
      }
}