#include <iostream>
#include <string>
#include <map>

using namespace std;

const int MAX = 10;
const string OF = "Stack overflow", UF = "Stack underflow";
const map<char, int> PRIORITIES = {{'+', 1}, {'-', 1}, {'*', 2}, {'/', 2}, {'^', 3}};

struct Stack
{
        int top = -1;
        char arr[MAX];
        bool is_empty()
        {
                return top == -1;
        }
        bool is_full()
        {
                return top == MAX - 1;
        }
        void push(char data)
        {
                if (is_full())
                {
                        cout << OF << endl;
                        return;
                }
                arr[++top] = data;
        }
        char pop()
        {
                if (is_empty())
                {
                        cout << UF << endl;
                        return -1;
                }
                return arr[top--];
        }
        char peek()
        {
                if (is_empty())
                {
                        cout << UF << endl;
                        return -1;
                }
                return arr[top];
        }
};



const char operators[] = {'+', '-', '*', '/', '^'};

void postfix(string expression, Stack *stack)
{
        for (int i = 0; i < expression.length(); i++)
        {
                char c = expression[i];
                if (c == ' ')
                {
                        continue;
                }
                if (c >= '0' && c <= '9')
                {
                        cout << c;
                }
                else if (c == '(')
                {
                        stack->push(c);
                }
                else if (c == ')')
                {
                        while (stack->peek() != '(')
                        {
                                cout << stack->pop();
                        }
                        stack->pop();
                }
                else
                {
                        stack->push(c);
                }
                cout<< stack->peek();
        }
}

int main()
{
        string expr = "";
        Stack stack;
        cout << "Enter the expression: ";
        cin >> expr;
        postfix(expr, &stack);

        return 0;
}