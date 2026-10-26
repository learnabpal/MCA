#include <iostream>

using namespace std;

const int MAX = 100;

struct QueueAR
{
      int items[MAX];
      int front = -1;
      int rear = -1;

      void enqueue(int value)
      {
            if (rear == MAX - 1)
            {
                  cout << "Queue overflow" << endl;
                  return;
            }

            if (front == -1)
                  front = 0;

            items[++rear] = value;
      }

      int dequeue()
      {
            if (front == -1)
            {
                  cout << "Queue underflow" << endl;
                  return -1;
            }
            int item = items[front];
            if (front == rear)
            {
                  front = rear = -1;
            }
            else
            {
                  front++;
            }
            return item;
      }

      void display()
      {
            if (front == -1)
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: ";
            for (int i = front; i <= rear; i++)
            {
                  cout << items[i] << " ";
            }
            cout << endl;
      }
};

void do_queue_with_array()
{
      QueueAR *q = new QueueAR;

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
                  break;
            default:
                  cout << "Invalid choice" << endl;
            }
      } while (choice != 4);
}

int main()
{
      do_queue_with_array();
      return 0;
}