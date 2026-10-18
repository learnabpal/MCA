import { AthContent, AthRtdbMap } from "@/app/AthenaeumMaster";




export const ATHENAEUM_DEMO_DATA: AthRtdbMap = {
	  subject: {
			 pc: {
					contents: { "pc-001": "Programming Fundamentals", "pc-002": "Control Structures", "pc-003": "Functions" },
					downloads: { "pc-pdf-001": { title: "Programming Concept", url: "#" } }
			 },
			 dsa: {
					contents: { "dsa-001": "Introduction to Data Structures", "dsa-002": "Arrays and Linked Lists" },
					downloads: { "dsa-pdf-001": { title: "Data Structure and Algorithm", url: "#" } }
			 },
			 coa: {
					contents: { "coa-001": "Number Systems", "coa-002": "Boolean Algebra" },
					downloads: {}
			 },
			 bmc: {
					contents: { "bmc-001": "Sets and Relations", "bmc-002": "Matrices" },
					downloads: {}
			 },
			 ecom: {
					contents: { "ecom-001": "Introduction to E-Commerce", "ecom-002": "Digital Business Models" },
					downloads: {}
			 }
	  }
};

export const ATHENAEUM_DEMO_CONTENT: Record<string, AthContent> = {
	  "pc-001": { sub: "pc", title: "Programming Fundamentals", tags: [ "Programming Fundamentals" ], content: "Programming is the process of expressing instructions that a computer can execute.\n\nA program combines data, operations and control flow to solve a defined problem." },
	  "pc-002": { sub: "pc", title: "Control Structures", tags: [ "Control Structures" ], content: "Control structures determine the order in which instructions execute.\n\nSelection statements choose between alternatives, while iteration statements repeat instructions." },
	  "pc-003": { sub: "pc", title: "Functions", tags: [ "Functions" ], content: "Functions group instructions into reusable units.\n\nA function may accept parameters, perform an operation and return a result." },
	  "dsa-001": { sub: "dsa", title: "Introduction to Data Structures", tags: [ "Introduction to Data Structures" ], content: "A data structure organises data so that operations such as access, insertion, deletion and searching can be performed.\n\nThe choice of data structure affects the time and space complexity of an algorithm." },
	  "dsa-002": { sub: "dsa", title: "Arrays and Linked Lists", tags: [ "Arrays and Linked Lists" ], content: "An array stores elements in indexed positions, usually in contiguous memory.\n\nA linked list stores elements in nodes connected through references or pointers." },
	  "coa-001": { sub: "coa", title: "Number Systems", tags: [ "Number Systems" ], content: "Number systems represent numerical values using a defined set of digits and a base.\n\nCommon computer number systems include binary, octal, decimal and hexadecimal." },
	  "coa-002": { sub: "coa", title: "Boolean Algebra", tags: [ "Boolean Algebra" ], content: "Boolean algebra operates on binary-valued variables using logical operations such as AND, OR and NOT.\n\nIt is used to describe and simplify digital logic circuits." },
	  "bmc-001": { sub: "bmc", title: "Sets and Relations", tags: [ "Sets and Relations" ], content: "A set is a well-defined collection of distinct objects.\n\nA relation describes associations between elements of sets and can be analysed through its properties." },
	  "bmc-002": { sub: "bmc", title: "Matrices", tags: [ "Matrices" ], content: "A matrix is a rectangular arrangement of elements in rows and columns.\n\nMatrix operations include addition, scalar multiplication and matrix multiplication, subject to their dimensional requirements." },
	  "ecom-001": { sub: "ecom", title: "Introduction to E-Commerce", tags: [ "Introduction to E-Commerce" ], content: "Electronic commerce involves commercial transactions conducted through electronic networks.\n\nIt includes online ordering, electronic payments and digital transaction processing." },
	  "ecom-002": { sub: "ecom", title: "Digital Business Models", tags: [ "Digital Business Models" ], content: "A digital business model describes how a business creates and delivers value using digital technologies.\n\nExamples include subscription services, marketplaces and transaction-based platforms." }
};
