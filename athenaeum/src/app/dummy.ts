import type { AthContent, AthRtdbMap } from "@/app/AthenaeumMaster";

export const ATHENAEUM_DEMO_DATA: AthRtdbMap = {
	  subject: {
			 pc: { contents: { "pc-001": "Programming Fundamentals", "pc-002": "Control Structures", "pc-003": "Functions" }, downloads: {} },
			 dsa: { contents: { "dsa-001": "Introduction to Data Structures", "dsa-002": "Arrays and Linked Lists" }, downloads: {} },
			 coa: { contents: { "coa-001": "Number Systems", "coa-002": "Boolean Algebra" }, downloads: {} },
			 bmc: { contents: { "bmc-001": "Sets and Relations", "bmc-002": "Matrices" }, downloads: {} },
			 ecom: { contents: { "ecom-001": "Introduction to E-Commerce", "ecom-002": "Digital Business Models" }, downloads: {} },
			 rdbms: { contents: {}, downloads: {} },
			 os: { contents: {}, downloads: {} },
			 oopj: { contents: {}, downloads: {} },
			 prst: { contents: {}, downloads: {} },
			 sweng: { contents: {}, downloads: {} },
			 webt: { contents: {}, downloads: {} }
	  }
};

export const ATHENAEUM_DEMO_CONTENT: Record<string, AthContent> = {
	  "pc-001": {
			 sub: "pc", title: "Programming Fundamentals", tags: [ "Programming Concepts" ], content: `Programming is the process of expressing instructions that a computer can execute.

A program combines **data**, **operations** and **control flow** to solve a defined problem.

### Core Elements

- **Input:** Data supplied to a program.
- **Processing:** Operations performed on the supplied data.
- **Output:** Results produced by the program.

### Basic Execution Flow

\`\`\`text
Input → Processing → Output
\`\`\``
	  },
	  "pc-002": {
			 sub: "pc", title: "Control Structures", tags: [ "Programming Concepts" ], content: `Control structures determine the order in which program instructions execute.

### Main Categories

- **Sequence:** Statements execute in their specified order.
- **Selection:** A condition determines which execution path is followed.
- **Iteration:** A set of statements executes repeatedly.

Selection and iteration allow programs to respond to conditions and process repeated operations.`
	  },
	  "pc-003": {
			 sub: "pc", title: "Functions", tags: [ "Modular Programming" ], content: `A **function** groups instructions into a reusable unit.

Functions may accept **parameters**, perform operations and return a result.

### Example

\`\`\`python
def add(a, b):
    return a + b

result = add(10, 20)
\`\`\`

Here, \`a\` and \`b\` are parameters, while \`result\` receives the returned value.`
	  },
	  "dsa-001": {
			 sub: "dsa", title: "Introduction to Data Structures", tags: [ "Data Structures" ], content: `A **data structure** organises data so that operations such as access, insertion, deletion and searching can be performed.

The choice of data structure affects an algorithm's time and space complexity.

### Common Operations

- **Traversal:** Visiting elements.
- **Searching:** Locating a particular element.
- **Insertion:** Adding an element.
- **Deletion:** Removing an element.`
	  },
	  "dsa-002": {
			 sub: "dsa", title: "Arrays and Linked Lists", tags: [ "Data Structures" ], content: `An **array** stores elements in indexed positions, usually in contiguous memory.

A **linked list** stores elements in nodes connected through references or pointers.

### Key Differences

- Arrays support direct indexed access.
- Linked lists connect elements through node references.
- Insertion and deletion costs depend on the operation and the element's position.`
	  },
	  "coa-001": {
			 sub: "coa", title: "Number Systems", tags: [ "Computer Organisation" ], content: `A number system represents numerical values using a defined set of digits and a base.

### Common Number Systems

- **Binary:** Base 2, using digits 0 and 1.
- **Octal:** Base 8, using digits 0–7.
- **Decimal:** Base 10, using digits 0–9.
- **Hexadecimal:** Base 16, using digits 0–9 and A–F.

The positional value of a digit depends on its position and the number system's base.`
	  },
	  "coa-002": {
			 sub: "coa", title: "Boolean Algebra", tags: [ "Computer Organisation" ], content: `**Boolean algebra** operates on binary-valued variables using logical operations.

### Fundamental Operations

- **AND:** Produces 1 when both inputs are 1.
- **OR:** Produces 1 when at least one input is 1.
- **NOT:** Reverses the input value.

Boolean expressions are used to represent and simplify digital logic circuits.`
	  },
	  "bmc-001": {
			 sub: "bmc", title: "Sets and Relations", tags: [ "Mathematical Foundations" ], content: `A **set** is a well-defined collection of distinct objects.

A **relation** describes associations between elements of one or more sets.

### Set Operations

- **Union:** Elements belonging to either set.
- **Intersection:** Elements common to both sets.
- **Difference:** Elements belonging to one set but not the other.

Relations can be examined through properties such as reflexivity, symmetry and transitivity.`
	  },
	  "bmc-002": {
			 sub: "bmc", title: "Matrices", tags: [ "Mathematical Foundations" ], content: `A **matrix** is a rectangular arrangement of elements in rows and columns.

The order of a matrix is expressed as *m × n*, where *m* is the number of rows and *n* is the number of columns.

### Common Operations

- Matrix addition and subtraction require matrices of the same order.
- Scalar multiplication multiplies every element by a scalar.
- Matrix multiplication requires the number of columns in the first matrix to equal the number of rows in the second matrix.`
	  },
	  "ecom-001": {
			 sub: "ecom", title: "Introduction to E-Commerce", tags: [ "Digital Business" ], content: `**Electronic commerce** involves commercial transactions conducted through electronic networks.

### Common Activities

- Online ordering of goods and services.
- Electronic payment processing.
- Digital delivery of eligible products and services.
- Electronic exchange of transaction information.

E-commerce systems connect buyers, sellers and supporting payment and delivery processes.`
	  },
	  "ecom-002": {
			 sub: "ecom", title: "Digital Business Models", tags: [ "Digital Business" ], content: `A **digital business model** describes how an organisation creates, delivers and captures value using digital technologies.

### Examples

- **Subscription:** Customers pay periodically for access to a service.
- **Marketplace:** A platform connects buyers and sellers.
- **Transaction-based:** Revenue is generated from individual transactions.

A business may combine multiple models depending on its products, customers and revenue strategy.`
	  }
};
