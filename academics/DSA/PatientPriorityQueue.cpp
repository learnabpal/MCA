#include <iostream>
#include <string>
using namespace std;

const int MAX = 100;
const string OF = "Queue overflow", UF = "Queue underflow";

struct Pt
{
      string name;
      int id;
      int prio;
      void print()
      {
            cout << "ID\tName\tPriority\n";
            cout << id << "\t" << name << "\t" << prio << endl;
      }
};

class PatientPQ
{
      Pt arr[MAX];
      int rear;

      bool is_full()
      {
            return rear == MAX - 1;
      }
      bool is_empty()
      {
            return rear == -1;
      }

      int get_highest_priority()
      {
            int h = 0;
            for (int i = 1; i <= rear; i++)
            {
                  if (arr[i].prio > arr[h].prio)
                  {
                        h = i;
                  }
            }
            return h;
      }

public:
      PatientPQ()
      {
            rear = -1;
      }

      void enqueue(Pt p)
      {
            if (is_full())
            {
                  cout << OF << endl;
                  return;
            }
            if (p.prio < 1 || p.prio > 10)
            {
                  cout << "Invalid priority. Enter 1-10" << endl;
                  return;
            }

            arr[++rear] = p;
      }

      Pt dequeue()
      {
            if (is_empty())
            {
                  cout << UF << endl;
                  return Pt();
            }
            int h = get_highest_priority();
            Pt v = arr[h];
            for (int i = h; i < rear; i++)
            {
                  arr[i] = arr[i + 1];
            }
            rear--;
            return v;
      }

      Pt peek()
      {
            if (is_empty())
            {
                  cout << "Queue empty" << endl;
                  return Pt();
            }
            int h = get_highest_priority();
            Pt v = arr[h];
            return v;
      }

      void display()
      {
            if (is_empty())
            {
                  cout << "Queue empty" << endl;
                  return;
            }
            cout << "Waiting List\n";
            cout << "ID\tName\tPriority\n";

            for (int i = 0; i <= rear; i++)
            {
                  cout << arr[i].id << "\t" << arr[i].name << "\t" << arr[i].prio << endl;
            }
      }

      int count() { return rear + 1; }
};

int main()
{

      PatientPQ ppq = PatientPQ();

      for (int i = 0; i <= 3; i++)
      {
            Pt p = Pt();
            cout << "Enter new patient data: " << endl;
            cout << "ID: ";
            cin >> p.id;
            cin.ignore();
            cout << "Name: ";
            getline(cin, p.name);
            cout << "Priority: ";
            cin >> p.prio;
            ppq.enqueue(p);
      }

      cout << "\n--- Waiting List ---\n";
      ppq.display();

      cout << "\n--- Treat Patient ---\n";
      Pt p = ppq.dequeue();
      cout << "To be treated now: " << endl;
      p.print();

      cout << "\n--- Next Patient ---\n";
      p = ppq.peek();
      cout << "To be treated next: " << endl;
      p.print();

      cout << "Total Waiting: " << ppq.count() << endl;
      return 0;
}
