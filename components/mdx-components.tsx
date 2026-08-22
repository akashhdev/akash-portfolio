import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
  h2: (props) => <h2 {...props} />,
  h3: (props) => <h3 {...props} />,
  a: (props) => <a {...props} rel={props.href?.startsWith("http") ? "noreferrer" : undefined} />,
  blockquote: (props) => <blockquote className="evidence-note" {...props} />,
  table: (props) => <div style={{ overflowX: "auto" }}><table {...props} /></div>,
};
