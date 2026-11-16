import java.util.Scanner;

public class fibonacci {
      static int fi_it(int nth) {
            int f1 = 0, f2 = 1, temp;
            if (nth <= 1)
                  return 0;
            if (nth == 2)
                  return 1;
            for (int i = 3; i <= nth; i++) {
                  temp = f1 + f2;
                  f1 = f2;
                  f2 = temp;
            }
            return f2;
      }

      static int fi_re(int nth) {
            if (nth <= 1)
                  return 0;
            if (nth == 2)
                  return 1;
            return fi_re(nth - 1) + fi_re(nth - 2);
      }

      public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            int n;
            System.out.print("Enter the 'nth' position: ");
            n = sc.nextInt();

            System.out.println("iterative: " + fi_it(n));
            System.out.println("recursive: " + fi_re(n));
      }
}
