import java.util.Scanner;

public class gcd {

      static int gcd_it(int x, int y) {
            int r;
            while (true) {
                  r = y % x;
                  y = x;
                  if (r == 0)
                        break;
                  x = r;
            }
            return x;
      }

      static int gcd_re(int x, int y) {
            int r = y % x;
            if (r == 0)
                  return x;
            return gcd_re(r, x);
      }

      public static void main(String[] args) {
            Scanner sc = new Scanner(System.in);
            int x, y;
            System.out.print(" Enter 1st number: ");
            x = sc.nextInt();
            System.out.print(" Enter 2nd number: ");
            y = sc.nextInt();

            System.out.println("iterative: " + gcd_it(x, y));
            System.out.println("recursive: " + gcd_re(x, y));
      }
}
