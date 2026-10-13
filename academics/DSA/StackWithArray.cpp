#include <iostream>
#include <string>
#include <functional>
using namespace std;

const int MAX = 10;
const string OF = "Stack overflow", UF = "Stack underflow";

struct Stack
{
        int top = -1;
        int arr[MAX];

        bool is_empty()
        {
                return top == -1;
        }

        bool is_full()
        {
                return top == MAX - 1;
        }

        void push(int data)
        {
                if (is_full())
                {
                        cout << OF << endl;
                        return;
                }
                arr[++top] = data;
        }

        int pop()
        {
                if (is_empty())
                {
                        cout << UF << endl;
                        return -1;
                }
                return arr[top--];
        }

        int peek()
        {
                if (is_empty())
                {
                        cout << UF << endl;
                        return -1;
                }
                return arr[top];
        }

        void display()
        {
                if (is_empty())
                {
                        cout << "Stack is empty" << endl;
                        return;
                }
                cout << "Stack: ";
                for (int i = top; i >= 0; i--)
                {
                        cout << arr[i] << " ";
                }
                cout << endl;
        }
};

void display_menu(string choices_sans_exit[], int size, function<void(int)> action)
{
        int choice;
        do
        {
                cout << endl;
                for (int i = 0; i < size; i++)
                {
                        cout << "- " << i + 1 << ". " << choices_sans_exit[i] << endl;
                }
                cout << "- Enter any other number to exit" << endl;
                cout << endl;
                cout << "- Enter your choice: ";
                cin >> choice;
                cout << endl;

                if (choice >= 1 && choice <= size)
                {
                        action(choice);
                }

        } while (choice >= 1 && choice <= size);
}

int main()
{
        Stack stack;
        string choices[] = {"Push", "Pop", "Peek", "Display"};
        display_menu(choices, 4, [&stack](int choice)
                     {
                        switch(choice)
                        {
                                case 1:
                                        int data;
                                        cout << "Enter data to be pushed: ";
                                        cin >> data;
                                        stack.push(data);
                                        break;
                                case 2:
                                        cout << "Popped data: " << stack.pop() << endl;
                                        break;
                                case 3:
                                        cout << "Peeked data (top): " << stack.peek() << endl;
                                        break;
                                case 4:
                                        stack.display();
                                        break;
                        } });
        return 0;
}