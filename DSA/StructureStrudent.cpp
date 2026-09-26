#include <iostream>
#include <string>
using namespace std;

const int MAX = 10;

struct Student
{
        int roll_no;
        string name;
        float cgpa;
};

int main()
{
        Student students[MAX];
        int count;

        cout << "Enter the number of students (maximum " << MAX << "): ";
        cin >> count;
        while(count < 1 || count > MAX)
        {
                cout << "Invalid number of students. Enter again: ";
                cin >> count;
        }

        for (int i = 0; i < count; i++)
        {
                cout << "Enter details for student #" << i + 1 << ":" << endl;
                cout << "Roll No: ";
                cin >> students[i].roll_no;
                cout << "Name: ";
                cin.ignore();
                getline(cin, students[i].name);
                cout << "CGPA: ";
                cin >> students[i].cgpa;
        }

        string max_name = "";
        float max_cgpa = 0.0;
        for (int i = 0; i < count; i++)
        {
                if (students[i].cgpa > max_cgpa)
                {
                        max_cgpa = students[i].cgpa;
                        max_name = students[i].name;
                }
        }

        cout << "Student with the highest CGPA is: " << max_name << " (CGPA: " << max_cgpa << ")" << endl;

        return 0;
}