# V(a). Demonstrate various string operations

text = "Python Programming"

print("Original:", text)
print("Length:", len(text))
print("Uppercase:", text.upper())
print("Lowercase:", text.lower())
print("Capitalised:", text.capitalize())
print("Title Case:", text.title())
print("Replace:", text.replace("Python", "Java"))
print("Find:", text.find("Programming"))
print("Count:", text.count("m"))
print("Starts With:", text.startswith("Python"))
print("Ends With:", text.endswith("Programming"))
print("Is Alphabetic:", text.isalpha())
print("Is Alphanumeric:", text.isalnum())
print("Is Lowercase:", text.islower())
print("Is Uppercase:", text.isupper())
print("Split:", text.split())
print("String Slice:", text[0:6])


# V(b). Check whether a string is palindrome

text = input("Enter a string: ")
reverse = ""

for index in range(len(text) - 1, -1, -1):
    reverse += text[index]

if text == reverse:
    print("Palindrome string")
else:
    print("Not a palindrome string")


# V(c). Count characters, vowels and blank spaces

text = input("Enter a line of text: ")

characters = len(text)
vowels = 0
spaces = 0

for character in text:
    if character.lower() in "aeiou":
        vowels += 1

    if character == " ":
        spaces += 1

print("Number of characters:", characters)
print("Number of vowels:", vowels)
print("Number of blank spaces:", spaces)
