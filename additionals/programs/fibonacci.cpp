#include <iostream>

int fi_it(int nth)
{
      int f1 = 0, f2 = 1, temp;
      if (nth <= 1)
            return 0;
      if (nth == 2)
            return 1;
      for (int i = 3; i <= nth; i++)
      {
            temp = f1 + f2;
            f1 = f2;
            f2 = temp;
      }
      return f2;
}

int fi_re(int nth)
{
      if (nth <= 1)
            return 0;
      if (nth == 2)
            return 1;
      return fi_re(nth - 1) + fi_re(nth - 2);
}

void do_fibo()
{
      int n;
      cout << "Enter the 'nth' position: ";
      cin >> n;

      cout << "iterative: " << fi_it(n) << endl;
      cout << "recursive: " << fi_re(n) << endl;
}

int main()
{
      do_fibo();
      return 0;
}