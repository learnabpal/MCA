import "katex/dist/katex.min.css";
import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { gruvboxDark as ColourScheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math-extended";




export { ColourScheme };


const mdHighlighter = (Tag: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "strong") =>
		  ({ node, ...props }: React.ComponentProps<"h1"> & { node?: unknown }) => (
					 <Tag { ...props } style={ { ...ColourScheme.keyword, margin: "1.2em 0 0.5em", ...props.style } }/>
		  );


const DevMarkdown = ({ text }: { text: string }) => <ReactMarkdown
		  children={ text }
		  remarkPlugins={ [ [ remarkMath, { backslashDelimiters: true } ] ] }
		  rehypePlugins={ [ rehypeKatex ] }
		  components={ {
				 h1: mdHighlighter("h1"),
				 h2: mdHighlighter("h2"),
				 h3: mdHighlighter("h3"),
				 h4: mdHighlighter("h4"),
				 h5: mdHighlighter("h5"),
				 h6: mdHighlighter("h6"),
				 strong: mdHighlighter("strong"),
				 code(props) {
						const { children, className, node, ...rest } = props;
						const match = /language-(\w+)/.exec(className || "");
						if (match) return <SyntaxHighlighter
								  { ...rest }
								  PreTag="div"
								  children={ String(children).replace(/\n$/, "") }
								  language={ match[1] }
								  style={ ColourScheme }
								  customStyle={ { fontWeight: "bold" } }
						/>;
						return <code
								  { ...rest }
								  className={ className }
								  style={ {
										 ...ColourScheme["code[class*=\"language-\"]"],
										 display: "inline",
										 whiteSpace: "normal",
										 fontWeight: "bold",
										 padding: "0.15em 0.35em",
										 // borderRadius: 4,
										 // fontSize: "0.875em",
										 ...rest.style
								  } }
						>
							  { children }
						</code>;
				 }
		  } }
/>;

export default DevMarkdown;
