import React from 'react';
import sanitizeHtml from 'sanitize-html';

function sanitize(html: string | undefined): string {
  if (!html) return '';

  return sanitizeHtml(html, {
    allowedTags: ['p', 'br', 'strong', 'em', 'u', 'b', 'i', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'a', 'blockquote', 'img'],
    allowedAttributes: {
      a: ['href', 'title', 'target'],
      img: ['src', 'alt', 'title'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    disallowedTagsMode: 'discard',
  });
}

export default function SafeHtml({ html, className = '' }: { html: string | undefined; className?: string }) {
  const sanitized = sanitize(html);

  return React.createElement('div', {
    className: `prose prose-sm max-w-none dark:prose-invert ${className}`,
    dangerouslySetInnerHTML: { __html: sanitized },
  });
}
