#include <iostream>
#include <string>

using namespace std;

struct Employee
{
        int id;
        string name;
        float salary;
        Employee *next;
};

Employee *insert_at_end(Employee *head)
{
        int count;
        cout << "Enter number of employees: ";
        cin >> count;
        Employee *cursor, *tail = head;
        for (int i = 1; i <= count; i++)
        {
                Employee *emp = new Employee;
                if (emp == nullptr)
                {
                        cout << "MEMORY OVERFLOW";
                        return head;
                }
                cout << "Enter employee id: ";
                cin >> emp->id;
                cout << "Enter employee name: ";
                cin >> emp->name;
                cout << "Enter employee salary: ";
                cin >> emp->salary;
                if (head == nullptr)
                {
                        emp->next = head;
                        head = tail = emp;
                }
                else
                {
                }
        }

        return head;
}

int main()
{
        return 0;
}