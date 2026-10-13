# LEVEL 1

# 1. Declare an empty list
empty_list = []

# 2. Declare a list with more than 5 items
items = ["Pen", "Book", "Laptop", "Phone", "Tablet", "Mouse", "Keyboard"]

# 3. Find the length of your list
print(len(items))

# 4. Get the first, middle and last item
print(items[0])
print(items[len(items) // 2])
print(items[len(items) - 1])

# 5. Declare mixed_data_types
mixed_data_types = ["AP", 50, 5.8, False, "Kolkata"]

# 6. Declare it_companies
it_companies = ["Facebook", "Google", "Microsoft", "Apple", "IBM", "Oracle", "Amazon"]

# 7. Print the list
print(it_companies)

# 8. Print the number of companies
print(len(it_companies))

# 9. Print the first, middle and last company
print(it_companies[0])
print(it_companies[len(it_companies) // 2])
print(it_companies[len(it_companies) - 1])

# 10. Modify one company
it_companies[0] = "Meta"
print(it_companies)

# 11. Add an IT company
it_companies.append("Netflix")
print(it_companies)

# 12. Insert an IT company in the middle
it_companies.insert(len(it_companies) // 2, "Cisco")
print(it_companies)

# 13. Change one company to uppercase (IBM excluded)
it_companies[1] = it_companies[1].upper()
print(it_companies)

# 14. Join it_companies with '#;'
result = ""

for index in range(len(it_companies)):
    result += it_companies[index]

    if index < len(it_companies) - 1:
        result += "#;"

print(result)

# 15. Check if a company exists
company = "Google"
found = False

for index in range(len(it_companies)):
    if it_companies[index] == company:
        found = True
        break

print(found)

# 16. Sort the list using sort()
it_companies.sort()
print(it_companies)

# 17. Reverse the list using reverse()
it_companies.reverse()
print(it_companies)

# 18. Slice out the first 3 companies
print(it_companies[:3])

# 19. Slice out the last 3 companies
print(it_companies[len(it_companies) - 3:])

# 20. Slice out the middle IT company or companies
middle = len(it_companies) // 2

if len(it_companies) % 2 == 0:
    print(it_companies[middle - 1:middle + 1])
else:
    print(it_companies[middle:middle + 1])

# 21. Remove the first IT company
it_companies.pop(0)
print(it_companies)

# 22. Remove the middle IT company or companies
middle = len(it_companies) // 2

if len(it_companies) % 2 == 0:
    del it_companies[middle - 1:middle + 1]
else:
    del it_companies[middle]

print(it_companies)

# 23. Remove the last IT company
it_companies.pop()
print(it_companies)

# 24. Remove all IT companies
it_companies.clear()
print(it_companies)

# 25. Destroy the IT companies list
del it_companies

# 26 and 27. Join the front-end and back-end lists
front_end = ["HTML", "CSS", "JS", "React", "Redux"]
back_end = ["Node", "Express", "MongoDB"]

full_stack = front_end + back_end
print(full_stack)

# 28. Copy the joined list and insert Python and SQL after Redux
full_stack = front_end + back_end

for index in range(len(full_stack)):
    if full_stack[index] == "Redux":
        full_stack.insert(index + 1, "Python")
        full_stack.insert(index + 2, "SQL")
        break

print(full_stack)


# LEVEL 2

# 1. Sort ages and find min and max
ages = [19, 22, 19, 24, 20, 25, 26, 24, 25, 24]

ages.sort()
print("Sorted ages:", ages)

min_age = ages[0]
max_age = ages[len(ages) - 1]

print("Minimum age:", min_age)
print("Maximum age:", max_age)

# Add the minimum and maximum ages again
ages.append(min_age)
ages.append(max_age)
print("Updated ages:", ages)

# Find the median
ages.sort()
middle = len(ages) // 2

if len(ages) % 2 == 0:
    median = (ages[middle - 1] + ages[middle]) / 2
else:
    median = ages[middle]

print("Median age:", median)

# Find the average
total = 0

for index in range(len(ages)):
    total += ages[index]

average = total / len(ages)
print("Average age:", average)

# Find the range
age_range = max_age - min_age
print("Age range:", age_range)

# Compare the absolute differences from the average
min_difference = abs(min_age - average)
max_difference = abs(max_age - average)

print("Minimum age difference:", min_difference)
print("Maximum age difference:", max_difference)

if min_difference > max_difference:
    print("Minimum age is farther from the average")
elif max_difference > min_difference:
    print("Maximum age is farther from the average")
else:
    print("Both are equally far from the average")


# 2. Find the middle country or countries
countries = ["China", "Russia", "USA", "Finland", "Sweden", "Norway", "Denmark"]

middle = len(countries) // 2

if len(countries) % 2 == 0:
    print(countries[middle - 1:middle + 1])
else:
    print(countries[middle:middle + 1])

# 3. Divide the countries into two halves
middle = (len(countries)) // 2

first_half = countries[:middle]
second_half = countries[middle:]

print("First half:", first_half)
print("Second half:", second_half)

# 4. Unpack the first three countries and the rest
country1, country2, country3, *scandic_countries = countries

print(country1)
print(country2)
print(country3)
print(scandic_countries)