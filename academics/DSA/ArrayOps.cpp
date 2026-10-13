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

int search_element(int arr[], int size)
{
        int element, index = -1;
        cout << "Enter the element to be searched: ";
        cin >> element;
        for (int i = 0; i < size; i++)
        {
                if (arr[i] == element)
                {
                        index = i;
                        break;
                }
        }
        return index;
}

int delete_element(int arr[], int size)
{
        int index, element;
        cout << "Enter the index of the element to be deleted: ";
        cin >> index;
        element = arr[index];
        for (int i = index; i < size - 1; i++)
        {
                arr[i] = arr[i + 1];
        }
        return element;
}

int maximum_element(int arr[], int size)
{
        int max = arr[0];
        for (int i = 1; i < size; i++)
        {
                if (arr[i] > max)
                {
                        max = arr[i];
                }
        }
        return max;
}

void display_array(int arr[], int size)
{
        for (int i = 0; i < size; i++)
        {
                cout << arr[i] << " ";
        }
        cout << endl;
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
        display_array(arr, size);

        cout << "Maximum element: " << maximum_element(arr, size) << endl;

        int fidx = search_element(arr, size);
        if (fidx == -1)
        {
                cout << "Element not found" << endl;
        }
        else
        {
                cout << "Element found at index: " << fidx << endl;
        }

        int del_el = delete_element(arr, size--);
        cout << "Deleted element: " << del_el << endl;
        cout << "Array after deletion: ";
        display_array(arr, size);

        return 0;
}
