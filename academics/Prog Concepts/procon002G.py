# VII(a). Generate Fibonacci series up to N numbers


def fibonacci(n):
    first = 0
    second = 1

    for i in range(n):
        print(first, end=" ")
        next_number = first + second
        first = second
        second = next_number


n = int(input("Enter number of terms: "))
fibonacci(n)
print()


# VII(b). Check Armstrong number using a function


def is_armstrong(number):
    if number < 0:
        return False

    temp = number
    digits = 0
    total = 0

    if temp == 0:
        digits = 1

    while temp > 0:
        digits += 1
        temp //= 10

    temp = number

    while temp > 0:
        digit = temp % 10
        total += digit**digits
        temp //= 10

    return total == number


number = int(input("Enter a number: "))

if is_armstrong(number):
    print("Armstrong number")
else:
    print("Not an Armstrong number")


# VII(c). Demonstrate parameter passing in Python

# Immutable object example
# Changing the local integer does not change the original variable.


def change_value(number):
    number = 100
    print("Inside function:", number)


value = 50
change_value(value)
print("Outside function:", value)


# Mutable object example
# Modifying a list inside the function affects the original list.


def change_list(numbers):
    numbers.append(40)
    print("Inside function:", numbers)


values = [10, 20, 30]
change_list(values)
print("Outside function:", values)


# VII(d). Find factorial using recursion


def factorial(n):
    if n < 0:
        return None
    elif n == 0 or n == 1:
        return 1
    else:
        return n * factorial(n - 1)


number = int(input("Enter a number: "))
result = factorial(number)

if result is None:
    print("Factorial is not defined for negative numbers")
else:
    print("Factorial:", result)
