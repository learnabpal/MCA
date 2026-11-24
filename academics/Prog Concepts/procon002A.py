# I(a). Check whether a number is even or odd

number = int(input("Enter a number: "))

if number % 2 == 0:
    print("Even number")
else:
    print("Odd number")


# I(b). Print decimal equivalents of 1/2 to 1/10 using for loop

for number in range(2, 11):
    print("1 /", number, "=", 1 / number)


# I(c). Display reversal of a number

number = int(input("Enter a number: "))
original = abs(number)
reverse = 0

while original > 0:
    digit = original % 10
    reverse = reverse * 10 + digit
    original = original // 10

if number < 0:
    reverse = -reverse

print("Reversed number:", reverse)


# I(d). Find the biggest among three numbers

a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
c = int(input("Enter third number: "))

if a >= b and a >= c:
    biggest = a
elif b >= a and b >= c:
    biggest = b
else:
    biggest = c

print("Biggest number:", biggest)


# I(e). Countdown using while loop

number = int(input("Enter a number: "))

while number >= 0:
    print(number)
    number -= 1
