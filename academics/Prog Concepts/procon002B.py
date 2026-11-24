
# II(a). Sum of two numbers using command line arguments
# Run: python program.py 10 20

import sys

if len(sys.argv) == 3:
    number1 = float(sys.argv[1])
    number2 = float(sys.argv[2])
    print("Sum:", number1 + number2)
else:
    print("Please provide exactly two numbers.")


# II(b). Demonstrate various Python operators

a = 10
b = 3

# Arithmetic operators
print("Addition:", a + b)
print("Subtraction:", a - b)
print("Multiplication:", a * b)
print("Division:", a / b)
print("Floor Division:", a // b)
print("Modulus:", a % b)
print("Exponentiation:", a ** b)

# Comparison operators
print("Equal:", a == b)
print("Not Equal:", a != b)
print("Greater Than:", a > b)
print("Less Than:", a < b)
print("Greater Than or Equal:", a >= b)
print("Less Than or Equal:", a <= b)

# Assignment operators
c = 10
c += 5
print("Addition Assignment:", c)
c -= 3
print("Subtraction Assignment:", c)
c *= 2
print("Multiplication Assignment:", c)
c /= 4
print("Division Assignment:", c)

# Logical operators
print("AND:", a > 5 and b < 5)
print("OR:", a < 5 or b < 5)
print("NOT:", not a > 5)

# Bitwise operators
print("Bitwise AND:", a & b)
print("Bitwise OR:", a | b)
print("Bitwise XOR:", a ^ b)
print("Bitwise NOT:", ~a)
print("Left Shift:", a << 1)
print("Right Shift:", a >> 1)

# Membership operators
numbers = [10, 20, 30]
print("IN:", 20 in numbers)
print("NOT IN:", 40 not in numbers)

# Identity operators
x = numbers
y = numbers
print("IS:", x is y)
print("IS NOT:", x is not y)


# II(c). Check voting eligibility

age = int(input("Enter your age: "))

if age >= 18:
    print("Eligible for voting")
else:
    print("Not eligible for voting")


# II(d). Check leap year

year = int(input("Enter a year: "))

if year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):
    print("Leap year")
else:
    print("Not a leap year")
