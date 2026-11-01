#include <iostream>
#include <string>

using namespace std;

const int MAX = 100;
const string OF = "Queue overflow", UF = "Queue underflow";

struct QueueA
{
      int items[MAX];
      int f = -1;
      int r = -1;

      bool is_empty()
      {
            return f == -1;
      }

      bool is_full()
      {
            return r == MAX - 1;
      }

      void enqueue(int value)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }

            if (f == -1)
                  f = 0;

            items[++r] = value;
      }

      int dequeue()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            int item = items[f];
            if (f == r)
                  f = r = -1;
            else
                  f++;
            return item;
      }

      int peek()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return items[f];
      }
      int front() { return peek(); }

      int rear()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return items[r];
      }

      int size() { return is_empty() ? 0 : r - f + 1; }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: ";
            for (int i = f; i <= r; i++)
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
      QLItem *f, *r;

      bool is_empty()
      {
            return f == nullptr;
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
            if (r == nullptr)
            {
                  f = r = nn;
            }
            else
            {
                  r->next = nn;
                  r = nn;
            }
      }

      int dequeue()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            QLItem *item = f;
            int value = item->data;
            if (f == r)
                  f = r = nullptr;
            else
                  f = f->next;

            delete item;
            return value;
      }

      int peek()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return f->data;
      }
      int front() { return peek(); }

      int rear()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return r->data;
      }

      int size()
      {
            int count = 0;
            QLItem *temp = f;
            while (temp != nullptr)
            {
                  count++;
                  temp = temp->next;
            }
            return count;
      }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: ";
            QLItem *temp = f;
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
            cout << "1. Enqueue | 2. Dequeue | 3. Display | 4. Peek | 5. Rear | 6. Size | 7. Exit" << endl;
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
                        cout << "Front item: " << item << endl;
                  }
                  break;
            }
            case 5:
            {
                  int item = q->rear();
                  if (item != -1)
                  {
                        cout << "Rear item: " << item << endl;
                  }
                  break;
            }
            case 6:
            {
                  int item = q->size();
                  if (item != -1)
                  {
                        cout << "Size: " << item << endl;
                  }
                  break;
            }
            case 7:
                  break;
            default:
                  cout << "Invalid choice" << endl;
                  break;      
            }
      } while (choice != 7);
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
      while (q->f != nullptr)
      {
            QLItem *temp = q->f;
            q->f = q->f->next;
            delete temp;
      }
      q->f = q->r = nullptr;
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