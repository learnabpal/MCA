#include <iostream>

using namespace std;

const int MAX = 100;

struct QueueA
{
      int items[MAX];
      int front = -1;
      int rear = -1;

      bool is_empty()
      {
            return front == -1;
      }

      bool is_full()
      {
            return rear == MAX - 1;
      }

      void enqueue(int value)
      {
            if (is_full())
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
            if (is_empty())
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

      int peek()
      {
            if (is_empty())
            {
                  cout << "Queue underflow" << endl;
                  return -1;
            }
            return items[front];
      }

      void display()
      {
            if (is_empty())
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

struct QLItem
{
      int data;
      QLItem *next;
};

struct QueueL
{
      QLItem *front, *rear;

      bool is_empty()
      {
            return front == nullptr;
      }

      void enqueue(int value)
      {
            QLItem *nn = new QLItem;

            if (nn == nullptr)
            {
                  cout << "MEMORY OVERFLOW" << endl;
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
            if (is_empty())
            {
                  cout << "Queue underflow" << endl;
                  return -1;
            }
            QLItem *item = front;
            int value = item->data;
            if (front == rear)
                  front = rear = nullptr;
            else
                  front = front->next;

            delete item;
            return value;
      }

      int peek()
      {
            if (is_empty())
            {
                  cout << "Queue underflow" << endl;
                  return -1;
            }
            return front->data;
      }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: ";
            QLItem *temp = front;
            while (temp != nullptr)
            {
                  cout << temp->data << " ";
                  temp = temp->next;
            }
            cout << endl;
      }
};

void do_menu(auto *q)
{
      int choice;
      do
      {
            cout << "1. Enqueue | 2. Dequeue | 3. Display | 4. Peek | 5. Exit" << endl;
            cout << "Enter your choice: ";
            cin >> choice;
            switch (choice)
            {
            case 1:
            {
                  int value;
                  cout << "Enter value to be enqueued: ";
                  cin >> value;
                  q->enqueue(value);
                  break;
            }
            case 2:
            {
                  int item = q->dequeue();
                  if (item != -1)
                  {
                        cout << "Dequeued item: " << item << endl;
                  }
                  break;
            }
            case 3:
            {
                  q->display();
                  break;
            }
            case 4:
            {
                  int item = q->peek();
                  if (item != -1)
                  {
                        cout << "Peeked item: " << item << endl;
                  }
                  break;
            }
            case 5:
                  break;
            default:
                  cout << "Invalid choice" << endl;
            }
      } while (choice != 5);
}

void do_queue_with_array()
{
      QueueA *q = new QueueA;
      do_menu(q);
      delete q;
}

void do_queue_with_linked_list()
{
      QueueL *q = new QueueL;
      do_menu(q);
      while (q->front != nullptr)
      {
            QLItem *temp = q->front;
            q->front = q->front->next;
            delete temp;
      }
      q->front = q->rear = nullptr;
      delete q;
}

int main()
{
      int pick;
      cout << "1. Queue with Array" << endl;
      cout << "2. Queue with Linked List" << endl;
      cout << "Enter your choice: ";
      cin >> pick;
      if (pick == 1)
      {
            do_queue_with_array();
      }
      else if (pick == 2)
      {
            do_queue_with_linked_list();
      }
      else
      {
            cout << "Invalid choice" << endl;
      }
      return 0;
}