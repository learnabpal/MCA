print("# 1. Use index to determine the position of the first occurrence of 'f' in the string 'coding for all'")

text = "coding for all"

for index in range(len(text)):
    if text[index] == "f":
        print("Position of first 'f':", index)
        break


print("# 2. Split the string at ',' without using split()")

text = "Facebook, Google, Microsoft, Apple, Amazon, Oracle"

words = []
current_word = ""

for index in range(len(text)):
    if text[index] == ",":
        words.append(current_word)
        current_word = ""
    elif text[index]==' ':
      continue
    else:
        current_word += text[index]
words.append(current_word)
print(words)


print("# 3. Replace the word 'Coding' in 'Coding for all' with 'Python' without using replace()")

text = "Coding for all"
old_word = "Coding"
new_word = "Python"

result = ""

for i in range(len(text)):
  result+=text[i]
  if result==old_word:
    result=''
    for c in range(i-len(old_word)+1,len(text)):
      if c<len(old_word):result+=new_word[c]
      else: result+=text[c]
    break

print( result)