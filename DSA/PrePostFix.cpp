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

/*
POSTFIX                         PREFIX

left → right                    right → left
'(' → push                      ')' → push
')' → pop until '('             '(' → pop until ')'
priority <=                      priority <
*/

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
                        int cp = get_priority(c);
                        while (!stack->is_empty() && ((cp < get_priority(stack->peek())) || (cp == get_priority(stack->peek()) && c != '^')))
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

void prefix(string expression, Stack *stack)
{
        Stack temp;
        for (int i = expression.length() - 1; i >= 0; i--)
        {
                char c = expression[i];
                if (c == ' ')
                {
                        continue;
                }
                if (c == ')')
                {
                        stack->push(c);
                        continue;
                }
                if (is_operator(c))
                {
                        int cp = get_priority(c);
                        while (!stack->is_empty() && ((cp < get_priority(stack->peek())) || (cp == get_priority(stack->peek()) && c == '^')))
                        {
                                temp.push(stack->pop());
                        }
                        stack->push(c);
                }
                else if (c == '(')
                {
                        while (stack->peek() != ')')
                        {
                                // cout << stack->pop() << " ";
                                temp.push(stack->pop());
                        }
                        // stack->pop();
                        stack->pop();
                }
                else
                {
                        // cout << c << " ";
                        temp.push(c);
                }
        }
        while (!temp.is_empty())
        {
                cout << temp.pop() << " ";
        }
}

int main()
{
        string expr = "";
        Stack stack;
        cout << "Enter the expression: ";
        getline(cin, expr);
        expr = "(" + expr + ")";
        prefix(expr, &stack);
        cout << endl;
        postfix(expr, &stack);

        return 0;
}
