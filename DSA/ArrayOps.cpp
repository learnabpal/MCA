#include <iostream>
using namespace std;

void insert_element(int arr[], int size)
{
        int element, index;
        cout << "Enter the index to be inserted at: ";
        cin >> index;
        cout << "Enter element to be inserted: ";
        cin >> element;

        for (int i = size; i > index; i--)
        {
                arr[i] = arr[i - 1];
        }
        arr[index] = element;
}

int main()
{
        cout << "Enter size of array: ";
        int size;
        cin >> size;
        int arr[size];

        cout << "Enter elements of array:" << endl;
        for (int i = 0; i < size; i++)
        {
                cin >> arr[i];
        }

        insert_element(arr, ++size);
        
        cout << "Array after insertion: ";
        for (int i = 0; i < size; i++)
        {
                cout << arr[i] << " ";
        }
        return 0;
}
