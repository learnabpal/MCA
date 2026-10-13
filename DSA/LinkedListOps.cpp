#include <iostream>
using namespace std;

struct Node
{
        int data;
        Node *nest;
};

int main()
{
        Node *head = nullptr;
        int num = 12345;
        while (num > 0)
        {
                cout << num % 10 << " ";
                num = num / 10;
        }
        return 0;
}