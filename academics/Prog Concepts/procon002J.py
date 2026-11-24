# X(a). Linear Search and Binary Search

numbers = [10, 20, 30, 40, 50, 60, 70]
target = int(input("Enter element to search: "))

# Linear Search

found = False

for index in range(len(numbers)):
    if numbers[index] == target:
        print("Linear Search: Element found at position", index + 1)
        found = True
        break

if not found:
    print("Linear Search: Element not found")


# Binary Search
# The list must be sorted before applying binary search.

numbers.sort()
low = 0
high = len(numbers) - 1
found = False

while low <= high:
    middle = (low + high) // 2

    if numbers[middle] == target:
        print("Binary Search: Element found at position", middle + 1)
        found = True
        break
    elif numbers[middle] < target:
        low = middle + 1
    else:
        high = middle - 1

if not found:
    print("Binary Search: Element not found")


# X(b). Bubble Sort, Selection Sort and Insertion Sort

# Bubble Sort

numbers = [64, 34, 25, 12, 22, 11, 90]

for i in range(len(numbers)):
    for j in range(len(numbers) - i - 1):
        if numbers[j] > numbers[j + 1]:
            numbers[j], numbers[j + 1] = numbers[j + 1], numbers[j]

print("Bubble Sort:", numbers)


# Selection Sort

numbers = [64, 34, 25, 12, 22, 11, 90]

for i in range(len(numbers)):
    minimum_index = i

    for j in range(i + 1, len(numbers)):
        if numbers[j] < numbers[minimum_index]:
            minimum_index = j

    numbers[i], numbers[minimum_index] = numbers[minimum_index], numbers[i]

print("Selection Sort:", numbers)


# Insertion Sort

numbers = [64, 34, 25, 12, 22, 11, 90]

for i in range(1, len(numbers)):
    key = numbers[i]
    j = i - 1

    while j >= 0 and numbers[j] > key:
        numbers[j + 1] = numbers[j]
        j -= 1

    numbers[j + 1] = key

print("Insertion Sort:", numbers)
