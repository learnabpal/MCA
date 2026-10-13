#include <iostream>

using namespace std;

struct Node
{
        int data;
        Node *next;
};

void display(Node *head)
{
        if (head == nullptr)
        {
                cout << "EMPTY LIST";
                return;
        }
        Node *temp = head;
        cout << "Display ";
        while (temp != nullptr)
        {
                cout << temp->data << " ";
                temp = temp->next;
        }
        cout << endl;
        return;
}

Node *insert_start(Node *head, int data)
{
        Node *nn = new Node;
        if (nn == nullptr)
        {
                cout << "MEMORY OVERFLOW";
                return head;
        }
        nn->data = data;
        nn->next = head;
        head = nn;
        return head;
}

int main()
{
        Node *head = nullptr;
        int num = 12345;
        while (num > 0)
        {
                head = insert_start(head, num % 10);
                num = num / 10;
        }
        display(head);
        return 0;
}