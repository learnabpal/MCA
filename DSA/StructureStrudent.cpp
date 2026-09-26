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
        int student_count;

        cout << "Enter the number of students (maximum " << MAX << "): ";
        cin >> student_count;
        while(student_count < 1 || student_count > MAX)
        {
                cout << "Invalid number of students. Enter again: ";
                cin >> student_count;
        }

        for (int i = 0; i < student_count; i++)
        {
                cout << "Enter details for student " << i + 1 << ":" << endl;
                cout << "Roll No: ";
                cin >> students[i].roll_no;
                cout << "Name: ";
                cin.ignore();
                getline(cin, students[i].name);
                cout << "CGPA: ";
                cin >> students[i].cgpa;
        }

        string highest_name = "";
        float highest_cgpa = 0.0;
        for (int i = 0; i < student_count; i++)
        {
                if (students[i].cgpa > highest_cgpa)
                {
                        highest_name = students[i].name;
                        highest_cgpa = students[i].cgpa;
                }
        }

        cout << "Student with highest CGPA is: " << highest_name << " (CGPA: " << highest_cgpa << ")" << endl;

        return 0;
}