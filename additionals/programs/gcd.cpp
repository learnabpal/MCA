#include <iostream>
using namespace std;

int gcd_it(int x, int y)
{
      int r;
      while (true)
      {
            r = y % x;
            y = x;
            if (r == 0)
                  break;
            x = r;
      }
      return x;
}

int gcd_re(int x, int y)
{
      int r = y % x;
      if (r == 0)
            return x;
      return gcd_re(r, x);
}

void do_gcd()
{
      int x, y;
      cout << " Enter 1st number: ";
      cin >> x;
      cout << " Enter 2nd number: ";
      cin >> y;

      cout << "iterative: " << gcd_it(x, y) << endl;
      cout << "recursive: " << gcd_re(x, y) << endl;
}

int main()
{
      do_gcd();
      return 0;
}