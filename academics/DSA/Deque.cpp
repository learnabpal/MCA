#include <iostream>
#include <string>

using namespace std;

const int MAX = 100;
const string OF = "Deque overflow", UF = "Deque underflow";

class Deque
{
      int arr[MAX];
      int f, r;

      bool is_empty()
      {
            return f == -1;
      }

      bool is_full()
      {
            return f == (r + 1) % MAX;
      }

      void reset() { f = r = -1; }
      void init() { f = r = 0; }

      int incr(int x) { return (x + 1) % MAX; }
      int decr(int x) { return (x - 1 + MAX) % MAX; }

public:
      Deque()
      {
            reset();
      }

      void insert_front(int x)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }

            if (is_empty())
            {
                  init();
            }
            else
            {
                  f = decr(f);
            }

            arr[f] = x;
      }

      void insert_rear(int x)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }

            if (is_empty())
            {
                  init();
            }
            else
            {
                  r = incr(r);
            }

            arr[r] = x;
      }

      void delete_front()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return;
            }

            if (f == r)
            {
                  reset();
            }
            else
            {
                  f = incr(f);
            }
      }

      void delete_rear()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return;
            }

            if (f == r)
            {
                  reset();
            }
            else
            {
                  r = decr(r);
            }
      }

      int front()
      {
            if (is_empty())
                  return -1;

            return arr[f];
      }

      int rear()
      {
            if (is_empty())
                  return -1;

            return arr[r];
      }

      int size() { return (r - f + MAX) % MAX + 1; }

      void display()
      {
            if (is_empty())
            {
                  cout << "Deque is Empty\n";
                  return;
            }

            int i = f;

            while (true)
            {
                  cout << arr[i] << " ";
                  if (i == r)
                        break;
                  i = (i + 1) % MAX;
            }

            cout << endl;
      }
};

int main()
{
      Deque dq = Deque();

      int x;
      for (int i = 1; i <= 2; i++)
      {
            cout << "Insert at front: ";
            cin >> x;
            dq.insert_front(x);
            cout << "Insert at back: ";
            cin >> x;
            dq.insert_rear(x);
      }

      dq.display();

      dq.delete_front();
      dq.delete_rear();

      dq.display();

      cout << "Front: " << dq.front() << endl;
      cout << "Rear: " << dq.rear() << endl;
      cout << "Count: " << dq.size() << endl;

      return 0;
}