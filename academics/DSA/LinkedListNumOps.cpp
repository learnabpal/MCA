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

void sum_and_mean(Node *head, int len)
{
        int sum = 0, mean = 0;
        Node *temp = head;
        while (temp != nullptr)
        {
                sum += temp->data;
                temp = temp->next;
        }
        mean = sum / len;
        cout << "Sum: " << sum << endl;
        cout << "Mean: " << mean << endl;
}

void nth_from_end(Node *head, int len)
{
        int nth;
        cout << "Enter nth: ";
        cin >> nth;
        int x = len - nth;
        Node *temp = head;
        for (int i = 0; i < x; i++)
        {
                temp = temp->next;
        }
        cout << nth << "-th from end: " << temp->data << endl;
}

void min_max(Node *head)
{
        int min, max;
        Node *temp = head;
        min = temp->data;
        max = temp->data;
        while (temp != nullptr)
        {
                if (temp->data > max)
                        max = temp->data;
                if (temp->data < min)
                        min = temp->data;
                temp = temp->next;
        }
        cout << "Min: " << min << endl;
        cout << "Max: " << max << endl;
}

void occurrence(Node *head)
{
        int value;
        cout << "Enter value to find occurrence: ";
        cin >> value;
        int count = 0;
        Node *temp = head;
        while (temp != nullptr)
        {
                if (temp->data == value)
                        count++;
                temp = temp->next;
        }
        cout << "Occurrence of " << value << ": " << count << " times" << endl;
}

Node *sort(Node *head)
{
        Node *curr_node, *next_node;
        curr_node = head;
        while (curr_node != nullptr)
        {
                next_node = curr_node;
                while (next_node != nullptr)
                {
                        if (curr_node->data > next_node->data)
                        {
                                int temp = curr_node->data;
                                curr_node->data = next_node->data;
                                next_node->data = temp;
                        }
                        next_node = next_node->next;
                }
                curr_node = curr_node->next;
        }
        return head;
}

Node *deduplicate(Node *head)
{
        Node *curr_node, *next_node;
        curr_node = head;
        while (curr_node != nullptr)
        {
                next_node = curr_node;
                while (next_node != nullptr)
                {
                        if (curr_node->data == next_node->data)
                        {
                                curr_node->next = next_node->next;
                                delete next_node;
                                next_node = curr_node->next;
                        }
                        else
                        {
                                next_node = next_node->next;
                        }
                }
                curr_node = curr_node->next;
        }
        return head;
}

void do_num_ops()
{
        Node *head = nullptr;
        int num;
        cout << "Enter number: ";
        cin >> num;
        num = abs(num);
        int len = 0;
        while (num > 0)
        {
                head = insert_start(head, num % 10);
                num = num / 10;
                len++;
        }
        display(head);
        sum_and_mean(head, len);
        nth_from_end(head, len);
        min_max(head);
        occurrence(head);
        head = sort(head);
        display(head);
        head = deduplicate(head);
        display(head);
}

int main()
{
        do_num_ops();
        return 0;
}