import java.util.Scanner;

public class dow {

      static boolean is_leap(int yyyy) {
            return yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0);
      }

      static void find_day_of_week() {
            String[] dow = new String[] { "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat" };
            int dd, MM, yyyy;
            Scanner sc = new Scanner(System.in);

            System.out.print("Enter dd: ");
            dd = sc.nextInt();

            System.out.print("Enter MM: ");
            MM = sc.nextInt();

            System.out.print("Enter yyyy: ");
            yyyy = sc.nextInt();

            int days_elapsed = (yyyy - 1) * 365;
            for (int i = 1; i <= yyyy; i++)
                  if (is_leap(i))
                        days_elapsed++;

            int dom[] = { 0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 };
            if (is_leap(yyyy))
                  dom[2]++;
            for (int i = 1; i <= MM - 1; i++)
                  days_elapsed += dom[i];

            days_elapsed += (dd - 1);

            int index = (days_elapsed + 1) % 7;
            System.out.println(dow[index]);
      }

      public static void main(String[] args) {
            find_day_of_week();
      }
}