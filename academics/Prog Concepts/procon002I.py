# IX(a). Display file contents

filename = input("Enter file name: ")

try:
    file = open(filename, "r")
    content = file.read()
    print("File contents:")
    print(content)
    file.close()

except FileNotFoundError:
    print("File not found")


# IX(b). Copy contents from one file to another

source_file = input("Enter source file name: ")
destination_file = input("Enter destination file name: ")

try:
    source = open(source_file, "r")
    content = source.read()
    source.close()

    destination = open(destination_file, "w")
    destination.write(content)
    destination.close()

    print("File copied successfully")

except FileNotFoundError:
    print("Source file not found")

except OSError as error:
    print("File operation failed:", error)
