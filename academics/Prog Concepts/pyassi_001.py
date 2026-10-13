print(
    "# Q1. Accept an integer and determine whether it is positive, negative, or zero."
)

number = int(input("Enter an integer: "))

if number > 0:
    print("Positive")
elif number < 0:
    print("Negative")
else:
    print("Zero")

print("# Q2. Accept three numbers and find the largest using if-elif-else.")

number_one = float(input("Enter first number: "))
number_two = float(input("Enter second number: "))
number_three = float(input("Enter third number: "))

if number_one >= number_two and number_one >= number_three:
    largest = number_one
elif number_two >= number_one and number_two >= number_three:
    largest = number_two
else:
    largest = number_three

print("Largest:", largest)

print(
    "# Q3. Accept an integer and print its multiplication table from 1 to 10 using a for loop."
)

number = int(input("Enter a number: "))

for multiplier in range(1, 11):
    print(number, "×", multiplier, "=", number * multiplier)

print(
    "# Q4. Accept a positive integer n and calculate the sum of all even numbers between 1 and n."
)

n = int(input("Enter a positive number: "))
even_sum = 0

for number in range(2, n + 1, 2):
    even_sum += number

print("Sum of even numbers:", even_sum)

print("# Q5. Write a program to determine whether a given number is prime.")

number = int(input("Enter a number: "))
is_prime = True

if number < 2:
    is_prime = False
else:
    for d in range(2, int(number / 2) + 1):
        if number % d == 0:
            is_prime = False
            break

if is_prime:
    print("Prime")
else:
    print("Not Prime")

print("# Q6. Accept two numbers and display all prime numbers between them.")

start = int(input("Enter the starting number: "))
end = int(input("Enter the ending number: "))

if start > end:
    start, end = end, start

print("Prime numbers between", start, "and", end, ":")

for number in range(max(2, start), end + 1):
    is_prime = True

    for d in range(2, int(number / 2) + 1):
        if number % d == 0:
            is_prime = False
            break

    if is_prime:
        print(number, end=" ")

print()

print(
    "# Q7. Generate the first n terms of the Fibonacci series using a loop and display their sum."
)

n = int(input("Enter the number of Fibonacci terms: "))

first_term = 0
second_term = 1
fibonacci_sum = 0

print("Fibonacci series:")

for term in range(n):
    print(first_term, end=" ")
    fibonacci_sum += first_term
    next_term = first_term + second_term
    first_term = second_term
    second_term = next_term

print()
print("Sum:", fibonacci_sum)

print("# Q8. Print the following patterns for n rows.")

n = int(input("Enter the number of rows: "))

# Pattern 1:
# *
# **
# ***
# ****
# *****
for row in range(n):
    for col in range(row + 1):
        print('*', end=' ')
    print()

# Pattern 2:
# 1
# 22
# 333
# 4444
# 55555
for row in range(n):
    for col in range(row + 1):
        print(row + 1, end=' ')
    print()

# Pattern 3:
# 1
# 12
# 123
# 1234
# 12345
for row in range(n):
    for col in range(row + 1):
        print(col + 1, end=' ')
    print()

# Pattern 4:
# 1
# 23
# 456
# 78910
# ...
x = 1
for row in range(n):
    for col in range(row + 1):
        print(x, end=' ')
        x += 1
    print()

print("# Q9. Display multiplication tables from 1 to 10 using nested loops.")

for table in range(1, 11):
    print("\nMultiplication table of", table)
    for m in range(1, 11):
        print(table, "×", m, "=", table * m)

print("# Q10. Menu-driven program.")

while True:
    print("----- MENU -----")
    print("1. Check whether a number is prime")
    print("2. Check whether a number is even or odd")
    print("3. Find factorial")
    print("4. Find sum of digits")
    print("5. Reverse the number")
    print("6. Exit")

    choice = int(input("Enter your choice: "))

    if choice < 1 or choice > 6:
        print("Invalid choice. Please select a number from 1 to 6.")
    elif choice == 6:
        print("Program terminated.")
        break
    if choice == 1:
        number = int(input("Enter a number: "))
        is_prime = True
        if number < 2:
            is_prime = False
        else:
            for d in range(2, int(number / 2) + 1):
                if number % d == 0:
                    is_prime = False
                    break
        if is_prime:
            print("Prime")
        else:
            print("Not Prime")
    elif choice == 2:
        number = int(input("Enter a number: "))
        if number % 2 == 0:
            print("Even")
        else:
            print("Odd")
    elif choice == 3:
        number = int(input("Enter a number: "))
        if number < 0:
            print("Factorial is not defined for negative numbers.")
        else:
            factorial = 1
            for n in range(1, number + 1):
                factorial *= n
            print("Factorial:", factorial)

    elif choice == 4:
        number = int(input("Enter a number: "))
        number = abs(number)
        digit_sum = 0
        while number > 0:
            digit_sum += number % 10
            number //= 10
        print("Sum of digits:", digit_sum)
    elif choice == 5:
        number = int(input("Enter a number: "))
        sign = -1 if number < 0 else 1
        number = abs(number)
        reversed_number = 0
        while number > 0:
            digit = number % 10
            reversed_number = reversed_number * 10 + digit
            number //= 10
        reversed_number *= sign
        print("Reversed number:", reversed_number)
