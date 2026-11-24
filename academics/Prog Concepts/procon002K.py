# XI(a). Demonstrate exception handling

try:
    number1 = int(input("Enter first number: "))
    number2 = int(input("Enter second number: "))

    result = number1 / number2

    print("Result:", result)

except ValueError:
    print("Please enter valid integers")

except ZeroDivisionError:
    print("Division by zero is not allowed")

except Exception as error:
    print("An error occurred:", error)

finally:
    print("Program execution completed")


# XI(b). Perform database operations using SQLite
# Create, Insert, Display, Update and Delete

import sqlite3

connection = sqlite3.connect("student.db")
cursor = connection.cursor()

# Create table
cursor.execute("""
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INTEGER
)
""")

print("Student table created")

# Insert records
cursor.execute("INSERT INTO students (id, name, age) VALUES (?, ?, ?)", (1, "Abc", 20))

cursor.execute("INSERT INTO students (id, name, age) VALUES (?, ?, ?)", (2, "Def", 22))

connection.commit()
print("Records inserted")

# Display records
cursor.execute("SELECT * FROM students")
records = cursor.fetchall()

print("Student records:")
for record in records:
    print(record)

# Update record
cursor.execute("UPDATE students SET age = ? WHERE id = ?", (21, 1))

connection.commit()
print("Record updated")

# Display updated records
cursor.execute("SELECT * FROM students")
records = cursor.fetchall()

print("Updated student records:")
for record in records:
    print(record)

# Delete record
cursor.execute("DELETE FROM students WHERE id = ?", (2,))

connection.commit()
print("Record deleted")

# Display remaining records
cursor.execute("SELECT * FROM students")
records = cursor.fetchall()

print("Remaining student records:")
for record in records:
    print(record)

# Close database connection
connection.close()
