# III(a). Generate first N natural numbers

n = int(input("Enter N: "))

for number in range(1, n + 1):
    print(number)


# III(b). Check whether a number is palindrome

number = int(input("Enter a number: "))
original = number
reverse = 0

while number > 0:
    digit = number % 10
    reverse = reverse * 10 + digit
    number = number // 10

if original == reverse:
    print("Palindrome number")
else:
    print("Not a palindrome number")


# III(c). Find factorial of a number

number = int(input("Enter a number: "))
factorial = 1

if number < 0:
    print("Factorial is not defined for negative numbers")
else:
    for i in range(1, number + 1):
        factorial *= i

    print("Factorial:", factorial)


# III(d). Find sum of N natural numbers

n = int(input("Enter N: "))
total = 0

for number in range(1, n + 1):
    total += number

print("Sum:", total)


# III(e). Check whether a number is Armstrong

number = int(input("Enter a number: "))

if number < 0:
    print("Not an Armstrong number")
else:
    original = number
    temp = number
    digits = 0
    total = 0

    if temp == 0:
        digits = 1

    while temp > 0:
        digits += 1
        temp = temp // 10

    temp = number

    while temp > 0:
        digit = temp % 10
        total += digit**digits
        temp = temp // 10

    if original == total:
        print("Armstrong number")
    else:
        print("Not an Armstrong number")


# III(f). Generate prime numbers up to N

n = int(input("Enter N: "))

for number in range(2, n + 1):
    is_prime = True

    for divisor in range(2, number):
        if number % divisor == 0:
            is_prime = False
            break

    if is_prime:
        print(number)
