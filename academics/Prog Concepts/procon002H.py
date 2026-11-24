# VIII(a). Convert comma-separated numbers into a list and tuple

values = input("Enter comma-separated numbers: ")

number_list = values.split(",")
number_tuple = tuple(number_list)

print(number_list)
print(number_tuple)


# VIII(b). Print first half and last half of a tuple

numbers = (1, 2, 3, 4, 5, 6, 7, 8, 9, 10)

middle = len(numbers) // 2

first_half = numbers[:middle]
last_half = numbers[middle:]

print("First half:", first_half)
print("Last half:", last_half)
