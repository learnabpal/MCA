# 1. Create an empty dictionary called dog
dog = {}
print(dog)

# 2. Add name, colour, breed, legs, age to the dog dictionary
dog = {
    "name": "Tommy",
    "colour": "Brown",
    "breed": "German Shepherd",
    "legs": 4,
    "age": 3
}
print(dog)

# 3. Create a student dictionary
student = {
    "first_name": "John",
    "last_name": "Doe",
    "gender": "Male",
    "age": 22,
    "marital_status": "Single",
    "skills": ["Python", "HTML"],
    "country": "India",
    "city": "Kolkata",
    "address": "West Bengal, India"
}
print(student)

# 4. Get the length of the student dictionary
print(len(student))

# 5. Get the value of skills and check its data type
print(student["skills"])
print(type(student["skills"]))

# 6. Modify the skills values by adding one or two skills
student["skills"].append("CSS")
student["skills"].append("JavaScript")
print(student["skills"])

# 7. Get the dictionary keys as a list
print(list(student.keys()))

# 8. Get the dictionary values as a list
print(list(student.values()))

# 9. Change the dictionary to a list of tuples using items() method
print(list(student.items()))

# 10. Delete one of the items in the dictionary
del student["marital_status"]
print(student)

# 11. Delete one of the dictionaries
del dog
