import math

print('# 1. Check the data type of all your variables using type() built-in function')

first_name = input("Enter your first name: ")
last_name = input("Enter your last name: ")
country = input("Enter your country: ")
age = int(input("Enter your age: "))

print(type(first_name))
print(type(last_name))
print(type(country))
print(type(age))

print('# 2. Using len() built-in function, find the length of your first name')

first_name_length = len(first_name)
print(first_name_length)

print('# 3. Compare the length of your first name and your last name')

last_name_length = len(last_name)

if first_name_length > last_name_length:
    print("Your first name is longer than your last name.")
elif first_name_length < last_name_length:
    print("Your last name is longer than your first name.")
else:
    print("Your first name and last name have the same length.")

print('# 4. Declare 5 as num_one and 4 as num_two')

num_one = 5
num_two = 4

print('# 5. Add num_one and num_two and assign the value to total')

total = num_one + num_two
print("Total:", total)

print('# 6. Subtract num_two from num_one and assign the value to diff')

diff = num_one - num_two
print("Diff:", diff)

print('# 7. Multiply num_two and num_one and assign the value to product')

product = num_two * num_one
print("Product:", product)

print('# 8. Divide num_one by num_two and assign the value to division')

division = num_one / num_two
print("Division:", division)

print('# 9. Use modulus division to find num_two divided by num_one and assign the value to remainder')

remainder = num_two % num_one
print("Remainder:", remainder)

print('# 10. Calculate num_one to the power of num_two and assign the value to exp')

exp = num_one ** num_two
print("Exponent:", exp)

print('# 11. Find floor division of num_one by num_two and assign the value to floor_division')

floor_division = num_one // num_two
print("Floor division:", floor_division)

print('# 12(i). Calculate the area of a circle with radius 30 metres')

radius = 30
area_of_circle = math.pi * radius ** 2
print("Area of circle:", area_of_circle)

print('# 12(ii). Calculate the circumference of a circle with radius 30 metres')

circum_of_circle = 2 * math.pi * radius
print("Circumference of circle:", circum_of_circle)

print('# 12(iii). Take radius as user input and calculate the area')

user_radius = float(input("Enter the radius of the circle: "))
user_area = math.pi * user_radius ** 2
print("Area using entered radius:", user_area)

print('# 13. Get first name, last name, country and age from a user')

first_name = input("Enter your first name: ")
last_name = input("Enter your last name: ")
country = input("Enter your country: ")
age = int(input("Enter your age: "))

print("First name:", first_name)
print("Last name:", last_name)
print("Country:", country)
print("Age:", age)

print('# 14. Check Python reserved words or keywords')

help("keywords")