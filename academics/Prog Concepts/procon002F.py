# VI(a). Find largest of three numbers using a function


def max_of_three(a, b, c):
    if a >= b and a >= c:
        return a
    elif b >= a and b >= c:
        return b
    else:
        return c


a = int(input("Enter first number: "))
b = int(input("Enter second number: "))
c = int(input("Enter third number: "))

print("Largest number:", max_of_three(a, b, c))


# VI(b). Display numbers divisible by 7 but not by 5
# Between 1000 and 2000


def display_numbers():
    for number in range(1000, 2001):
        if number % 7 == 0 and number % 5 != 0:
            print(number)


display_numbers()
