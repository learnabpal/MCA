
#include <iostream>
using namespace std;

const int MAX = 100;
const string OF = "Queue overflow", UF = "Queue underflow";

class CirQueue
{
      int data[MAX];
      int f, r;

      void reset()
      {
            f = r = -1;
      }

      bool is_empty()
      {
            return f == -1;
      }

      bool is_full()
      {
            return (r + 1) % MAX == f;
      }

public:
      CirQueue()
      {
            reset();
      }

      void enqueue(int value)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }

            if (f == -1)
            {
                  f = r = 0;
            }
            else
            {
                  r = (r + 1) % MAX;
            }

            data[r] = value;
      }

      int dequeue()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }

            int item = data[f];

            if (f == r)
            {
                  reset();
            }
            else
            {
                  f = (f + 1) % MAX;
            }

            return item;
      }

      int peek()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return data[f];
      }

      int rear()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            return data[r];
      }

      int size() { return (r - f + MAX) % MAX + 1; }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: ";
            int i = f;
            while (true)
            {
                  cout << data[i] << " ";
                  if (i == r)
                  {
                        break;
                  }
                  i = (i + 1) % MAX;
            }
            cout << endl;
      }
};

void do_menu(CirQueue *q)
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

void do_circular_queue()
{
      CirQueue *q = new CirQueue();
      do_menu(q);
      delete q;
}

int main()
{
      do_circular_queue();
      return 0;
}