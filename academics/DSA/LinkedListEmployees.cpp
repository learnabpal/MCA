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

Employee *insert_employees(Employee *head)
{
        int count;
        cout << "Enter number of employees: ";
        cin >> count;
        Employee *tail = head;
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
                cin.ignore();
                cout << "Enter employee name: ";
                getline(cin, emp->name);
                cout << "Enter employee salary: ";
                cin >> emp->salary;
                if (head == nullptr)
                {
                        emp->next = head;
                        head = tail = emp;
                }
                else
                {
                        tail->next = emp;
                        tail = emp;
                        tail->next = nullptr;
                }
        }
        return head;
}

void read_employees(Employee *head)
{
        if (head == nullptr)
        {
                cout << "No employees found";
                return;
        }
        cout << "EMPLOYEES LIST\n";
        cout << "#\tID\tNAME\tSALARY\n";
        Employee *temp = head;
        int i = 1;
        while (temp != nullptr)
        {
                cout << i++ << ".\t" << temp->id << "\t" << temp->name << "\t" << temp->salary << endl;
                temp = temp->next;
        }
}

void do_employee()
{
        Employee *head = nullptr;
        head = insert_employees(head);
        read_employees(head);
}

int main()
{
        do_employee();
        return 0;
}