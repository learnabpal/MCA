#include <iostream>
#include <string>
#include <map>

using namespace std;

const int MAX = 100;
const string OF = "Stack overflow", UF = "Stack underflow";
const map<char, int> PRIORITIES = {{'+', 1}, {'-', 1}, {'*', 2}, {'/', 2}, {'^', 3}};
const char operators[] = {'+', '-', '*', '/', '^'};

bool is_operator(char c)
{
        for (int i = 0; i < 5; i++)
        {
                if (c == operators[i])
                        return true;
        }
        return false;
}

int get_priority(char c)
{
        auto f = PRIORITIES.find(c);
        if (f != PRIORITIES.end())
                return f->second;
        return -1;
}

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

void postfix(string expression, Stack *stack)
{
        for (int i = 0; i < expression.length(); i++)
        {
                char c = expression[i];
                if (c == ' ')
                {
                        continue;
                }
                if (c == '(')
                {
                        stack->push(c);
                        continue;
                }
                if (is_operator(c))
                {
                        while (!stack->is_empty() && get_priority(c) <= get_priority(stack->peek()))
                        {
                                cout << stack->pop() << " ";
                        }
                        stack->push(c);
                }
                else if (c == ')')
                {
                        while (stack->peek() != '(')
                        {
                                cout << stack->pop() << " ";
                        }
                        stack->pop();
                }
                else
                {
                        cout << c << " ";
                }
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