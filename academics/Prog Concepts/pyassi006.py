# 1. Create an empty tuple
empty_tuple = ()
print(empty_tuple)

# 2. Create brothers and sisters tuples
brothers = ("Rahul", "Raj")
sisters = ("Anjali", "Naina")
print(brothers)
print(sisters)

# 3. Join brothers and sisters into siblings
siblings = brothers + sisters
print(siblings)

# 4. Find the number of siblings
print(len(siblings))

# 5. Add father and mother to create family_members
family_members = siblings + ("Father", "Mother")
print(family_members)

# 6. Unpack siblings and parents from family_members
*siblings, father, mother = family_members
print("Siblings:", siblings)
print("Father:", father)
print("Mother:", mother)

# 7. Create and join food tuples
fruits = ("Apple", "Banana", "Orange")
vegetables = ("Potato", "Carrot", "Spinach")
animal_products = ("Milk", "Eggs", "Meat")

food_stuff_tp = fruits + vegetables + animal_products
print(food_stuff_tp)

# 8. Convert food_stuff_tp into a list
food_stuff_lt = list(food_stuff_tp)
print(food_stuff_lt)

# 9. Slice out the middle item or items
middle = len(food_stuff_tp) // 2

if len(food_stuff_tp) % 2 == 0:
    print(food_stuff_tp[middle - 1 : middle + 1])
else:
    print(food_stuff_tp[middle : middle + 1])

# 10. Slice out the first three and last three items
print(food_stuff_lt[:3])
print(food_stuff_lt[len(food_stuff_lt) - 3 :])

# 11. Delete the food_stuff_tp tuple
del food_stuff_tp

# 12. Check whether countries exist in the Nordic tuple
nordic_countries = ("Denmark", "Finland", "Iceland", "Norway", "Sweden")

print("Estonia" in nordic_countries)
print("Iceland" in nordic_countries)
