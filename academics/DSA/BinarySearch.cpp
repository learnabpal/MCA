#include <iostream>
using namespace std;

int binary_search(int arr[], int n, int k)
{
      int l = 0, h = n - 1;
      while (l <= h)
      {
            int m = l + (h - l) / 2;
            int me = arr[m];
            if (k == me)
            {
                  return m;
            }
            if (k < me)
            {
                  h = m - 1;
            }
            else if (k > me)
            {
                  l = m + 1;
            }
      }
      return -1;
}

void do_binary_search()
{
      int n = 10;
      int arr[n];
      cout << "Enter elements in sorted order: " << endl;
      for (int i = 0; i < n; i++)
      {
            cin >> arr[i];
      }
      int k;
      cout << "Search for the key: ";
      cin >> k;

      int index = binary_search(arr, n, k);

      if (index != -1)
      {
            cout << "Element found at index: " << index;
      }
      else
      {
            cout << "Element not found";
      }
}

int main()
{

      do_binary_search();
      return 0;
}