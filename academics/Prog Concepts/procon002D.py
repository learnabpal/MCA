# IV(a). Find sum and average using a list

numbers = []
n = int(input("How many numbers? "))

for i in range(n):
    value = float(input("Enter a number: "))
    numbers.append(value)

total = 0

for number in numbers:
    total += number

if n > 0:
    average = total / n
    print("Sum:", total)
    print("Average:", average)
else:
    print("No numbers entered")


# IV(b). Display list elements in reverse order

numbers = [10, 20, 30, 40, 50]

for index in range(len(numbers) - 1, -1, -1):
    print(numbers[index])


# IV(c). Find minimum and maximum elements in a list

numbers = [45, 12, 78, 23, 9, 56]

minimum = numbers[0]
maximum = numbers[0]

for number in numbers:
    if number < minimum:
        minimum = number

    if number > maximum:
        maximum = number

print("Minimum:", minimum)
print("Maximum:", maximum)
