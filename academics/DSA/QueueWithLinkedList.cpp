#include <iostream>

using namespace std;

struct Item
{
      int data;
      Item *next;
};

struct Queue
{
      Item *front, *rear;

      void enqueue(int value)
      {
            Item *nn = new Item;

            if (nn == nullptr)
            {
                  cout << "MEMORY OVERFLOW";
                  return;
            }

            nn->data = value;
            nn->next = nullptr;
            if (rear == nullptr)
            {
                  front = rear = nn;
            }
            else
            {
                  rear->next = nn;
                  rear = nn;
            }
      }

      int dequeue()
      {
            if (front == nullptr)
            {
                  cout << "Queue underflow";
                  return -1;
            }
            Item *item = front;
            if (front == rear)
                  front = rear = nullptr;
            else
                  front = front->next;

            delete item;
            return item->data;
      }

      void display()
      {
            if (front == nullptr)
            {
                  cout << "Queue is empty";
                  return;
            }
            cout << "Queue: ";
            Item *temp = front;
            while (temp != nullptr)
            {
                  cout << temp->data << " ";
                  temp = temp->next;
            }
            cout << endl;
      }
};

void do_queue_with_linked_list()
{
      Queue q;

      int choice;
      do
      {
            cout << "1. Enqueue" << endl;
            cout << "2. Dequeue" << endl;
            cout << "3. Display" << endl;
            cout << "4. Exit" << endl;
            cout << "Enter your choice: ";
            cin >> choice;
            switch (choice)
            {
            case 1:
                  int value;
                  cout << "Enter value to be enqueued: ";
                  cin >> value;
                  q.enqueue(value);
                  break;
            case 2:
                  int item = q.dequeue();
                  if (item != -1)
                  {
                        cout << "Dequeued item: " << item << endl;
                  }
                  break;
            case 3:
                  q.display();
                  break;
            case 4:
                  cout << "Exiting..." << endl;
                  break;
            default:
                  cout << "Invalid choice" << endl;
            }
      } while (choice != 4);
}

int main()
{
      do_queue_with_linked_list();
      return 0;
}