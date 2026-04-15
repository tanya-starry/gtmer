import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn('markdown-content', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom heading components with anchor links
          h1: ({ node, ...props }) => (
            <h1
              {...props}
              className="text-3xl font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200 scroll-mt-20"
            />
          ),
          h2: ({ node, ...props }) => (
            <h2
              {...props}
              className="text-2xl font-semibold text-gray-900 mt-6 mb-3 scroll-mt-20"
            />
          ),
          h3: ({ node, ...props }) => (
            <h3
              {...props}
              className="text-xl font-semibold text-gray-900 mt-5 mb-2 scroll-mt-20"
            />
          ),
          h4: ({ node, ...props }) => (
            <h4
              {...props}
              className="text-lg font-semibold text-gray-900 mt-4 mb-2"
            />
          ),
          // Custom paragraph
          p: ({ node, ...props }) => (
            <p {...props} className="mb-4 leading-relaxed text-gray-700" />
          ),
          // Custom lists
          ul: ({ node, ...props }) => (
            <ul {...props} className="mb-4 pl-6 list-disc space-y-1" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="mb-4 pl-6 list-decimal space-y-1" />
          ),
          li: ({ node, ...props }) => (
            <li {...props} className="text-gray-700" />
          ),
          // Custom links
          a: ({ node, ...props }) => (
            <a
              {...props}
              className="text-blue-600 hover:text-blue-800 underline underline-offset-2 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          // Custom blockquote
          blockquote: ({ node, ...props }) => (
            <blockquote
              {...props}
              className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50/50 italic text-gray-600 rounded-r-lg"
            />
          ),
          // Custom inline code
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '');
            return inline ? (
              <code
                {...props}
                className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded text-gray-800"
              >
                {children}
              </code>
            ) : (
              <div className="relative group my-4">
                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => navigator.clipboard.writeText(String(children))}
                    className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600 transition-colors"
                  >
                    复制
                  </button>
                </div>
                <pre className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <code
                    {...props}
                    className={cn(
                      'font-mono text-sm text-gray-100',
                      match && `language-${match[1]}`
                    )}
                  >
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
          // Custom table
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-4">
              <table
                {...props}
                className="w-full border-collapse border border-gray-200 rounded-lg"
              />
            </div>
          ),
          thead: ({ node, ...props }) => (
            <thead {...props} className="bg-gray-50" />
          ),
          th: ({ node, ...props }) => (
            <th
              {...props}
              className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700"
            />
          ),
          td: ({ node, ...props }) => (
            <td
              {...props}
              className="border border-gray-200 px-4 py-2 text-gray-700"
            />
          ),
          // Custom horizontal rule
          hr: ({ node, ...props }) => (
            <hr {...props} className="my-6 border-gray-200" />
          ),
          // Custom checkbox for task lists
          input: ({ node, type, checked, ...props }: any) => {
            if (type === 'checkbox') {
              return (
                <input
                  type="checkbox"
                  checked={checked}
                  readOnly
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  {...props}
                />
              );
            }
            return <input type={type} {...props} />;
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
