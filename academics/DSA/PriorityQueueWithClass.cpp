#include <iostream>
#include <string>
using namespace std;

const int MAX = 100;
const string OF = "Queue overflow", UF = "Queue underflow";

struct Val
{
      int data;
      int prio;
};

class PriQ
{
      Val arr[MAX];
      int r;

      bool is_full()
      {
            return r == MAX - 1;
      }
      bool is_empty()
      {
            return r == -1;
      }

public:
      PriQ()
      {
            r = -1;
      }

      void enqueue(int data, int prio)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }
            r++;
            arr[r].data = data;
            arr[r].prio = prio;
      }

      int dequeue()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            int h = 0;
            for (int i = 1; i <= r; i++)
            {
                  if (arr[i].prio < arr[h].prio)
                  {
                        h = i;
                  }
            }
            int v = arr[h].data;
            for (int i = h; i < r; i++)
            {
                  arr[i] = arr[i + 1];
            }
            r--;
            return v;
      }

      int peek()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return -1;
            }
            int h = 0;
            for (int i = 1; i <= r; i++)
            {
                  if (arr[i].prio < arr[h].prio)
                  {
                        h = i;
                  }
            }
            int v = arr[h].data;
            return v;
      }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue is empty" << endl;
                  return;
            }
            cout << "Queue: " << endl;
            cout << "\nData\tPriority\n";
            for (int i = 0; i <= r; i++)
            {
                  cout << arr[i].data << "\t" << arr[i].prio << endl;
            }
      }
};
void do_priority_queue()
{
      PriQ q = PriQ();
      int d, p;
      for (int i = 1; i <= 3; i++)
      {
            cout << "Input element: ";
            cin >> d;
            cout << "Input priority: ";
            cin >> p;
            q.enqueue(d, p);
            cout << endl;
      }
      q.display();
      for (int i = 1; i <= 2; i++)
      {
            cout << "Dequeue: " << q.dequeue() << endl;
      }
      q.display();
      cout << "Peek: " << q.peek() << endl;
}

int main()
{
      do_priority_queue();
      return 0;
}