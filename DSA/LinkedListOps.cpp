#include <iostream>

using namespace std;

struct Node
{
        int data;
        Node *next;
};

Node *insertAtStart(Node *head, int data)
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
Node *insertAtEnd(Node *head, int data)
{
        Node *nn = new Node;
        if (nn == nullptr)
        {
                cout << "MEMORY OVERFLOW";
                return head;
        }
        nn->data = data;
        if (head == nullptr)
        {
                nn->next = head;
                head = nn;
        }
        else
        {
                Node *temp;
                temp = head;
                while (temp->next != nullptr)
                {
                        temp = temp->next;
                }
                temp->next = nn;
                nn->next = nullptr;
        }
        return head;
}
Node *deleteAtStart(Node *head)
{
        if (head == nullptr)
        {
                cout << "EMPTY LIST";
                return head;
        }
        Node *temp;
        temp = head;
        head = temp->next;
        cout << "Deleted " << temp->data << endl;
        return head;
}
Node *deleteAtEnd(Node *head)
{
        if (head == nullptr)
        {
                cout << "EMPTY LIST";
                return head;
        }
        if (head->next == nullptr)
        {
                cout << "Only element deleted " << head->data << endl;
                head = nullptr;
                delete head;
        }
        else
        {
                Node *temp;
                Node *backup;
                temp = head;
                while (temp->next != nullptr)
                {
                        backup = temp;
                        temp = temp->next;
                }
                cout << "Element deleted " << temp->data << endl;
                backup->next = nullptr;
                delete temp;
        }
        return head;
}
Node *display(Node *head)
{
        if (head == nullptr)
        {
                cout << "EMPTY LIST";
                return head;
        }
        Node *temp = head;
        cout << "Display ";
        while (temp != nullptr)
        {
                cout << temp->data << " ";
                temp = temp->next;
        }
        cout << endl;
        return head;
}

void do_menu(Node *head)
{
        bool exit = false;
        while (true)
        {
                cout << "Enter 1 for insert @ start" << endl;
                cout << "Enter 2 for insert @ end" << endl;
                cout << "Enter 3 for delete @ start" << endl;
                cout << "Enter 4 for delete @ end" << endl;
                cout << "Enter any other number to exit" << endl;
                cout << "Pick a choice: ";
                int choice, data;
                cin >> choice;
                switch (choice)
                {
                case 1:
                        cout << "Enter number: ";
                        cin >> data;
                        head = insertAtStart(head, data);
                        display(head);
                        break;
                case 2:
                        cout << "Enter number: ";
                        cin >> data;
                        head = insertAtEnd(head, data);
                        display(head);
                        break;
                case 3:
                        head = deleteAtStart(head);
                        display(head);
                        break;
                case 4:
                        head = deleteAtEnd(head);
                        display(head);
                        break;
                default:
                        exit = true;
                        break;
                }
                cout << endl;
                if (exit)
                {
                        break;
                }
        }
}

int main()
{
        Node *head = nullptr;
        do_menu(head);
        return 0;
}
