#include <iostream>
#include <string>
using namespace std;

bool is_leap(int yyyy)
{
      return yyyy % 400 == 0 || (yyyy % 4 == 0 && yyyy % 100 != 0);
}
void find_day_of_week()
{
      string dow[] = {"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"};
      int dd, MM, yyyy;
      cout << "Enter dd: ";
      cin >> dd;
      cout << "Enter MM: ";
      cin >> MM;
      cout << "Enter yyyy: ";
      cin >> yyyy;

      int days_elapsed = (yyyy - 1) * 365;
      for (int i = 1; i <= yyyy; i++)
            if (is_leap(i))
                  days_elapsed++;

      int dom[] = {0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31};
      if (is_leap(yyyy))
            dom[2]++;
      for (int i = 1; i <= MM - 1; i++)
            days_elapsed += dom[i];

      days_elapsed += (dd - 1);

      int index = (days_elapsed + 1) % 7;
      cout << dow[index];
}

int main()
{
      find_day_of_week();
      return 0;
}