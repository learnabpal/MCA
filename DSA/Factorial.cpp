#include <iostream>
using namespace std;

long int factorial_recursive(int n)
{
        if (n == 0 || n == 1)
        {
                return 1;
        }
        return n * factorial_recursive(n - 1);
}

long int factorial_iterative(int n)
{
        long int result = 1;
        for (int i = 1; i <= n; i++)
        {
                result *= i;
        }
        return result;
}

int main()
{
        int number;
        cout << "Enter a number: ";
        cin >> number;

        if (number < 0)
        {
                cout << "Factorial is not defined for negative numbers." << endl;
        }
        else
        {
                cout << "Factorial of " << number << " is: " << factorial_recursive(number) << endl;
        }

        return 0;
}
