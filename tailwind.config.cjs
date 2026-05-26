const plugin = require('tailwindcss/plugin')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    plugin(function ({ addBase }) {
      addBase({
        /* ── Lists ─────────────────────────────────────────── */
        '.tiptap-content ul': {
          'list-style-type': 'disc',
          'padding-left': '2em',
          'margin': '0.5em 0 1em',
        },
        '.tiptap-content ol': {
          'list-style-type': 'decimal',
          'padding-left': '2em',
          'margin': '0.5em 0 1em',
        },
        '.tiptap-content li': { 'display': 'list-item' },
        '.tiptap-content li > p': { 'margin': '0' },

        /* ── Blockquote ────────────────────────────────────── */
        '.tiptap-content blockquote': {
          'border-left': '4px solid #2563EB',
          'background': '#eff6ff',
          'margin': '1.5em 0',
          'padding': '0.875em 1.25em',
          'border-radius': '0 8px 8px 0',
          'font-style': 'italic',
          'color': '#1e40af',
          'quotes': 'none',
        },
        '.tiptap-content blockquote p': { 'margin': '0', 'color': '#1e40af' },

        /* ── Inline code ───────────────────────────────────── */
        '.tiptap-content :not(pre) > code': {
          'background': '#fef3c7',
          'color': '#b45309',
          'font-family': '"Courier New", monospace',
          'font-size': '0.875em',
          'padding': '2px 6px',
          'border-radius': '4px',
          'font-style': 'normal',
        },

        /* ── Code block ────────────────────────────────────── */
        '.tiptap-content pre': {
          'background': '#1e1e2e',
          'color': '#cdd6f4',
          'font-family': '"Courier New", monospace',
          'font-size': '14px',
          'border-radius': '10px',
          'padding': '20px 24px',
          'margin': '1.5em 0',
          'overflow-x': 'auto',
          'white-space': 'pre',
          'line-height': '1.6',
          'border': '1px solid #313244',
          'display': 'block',
        },
        '.tiptap-content pre code': {
          'background': 'transparent',
          'color': 'inherit',
          'padding': '0',
          'font-size': 'inherit',
          'border-radius': '0',
          'font-family': 'inherit',
          'white-space': 'inherit',
        },

        /* ── Links (editor) ────────────────────────────────── */
        '.tiptap-content a': {
          'color': '#2563EB',
          'text-decoration': 'underline',
          'text-underline-offset': '3px',
          'cursor': 'pointer',
        },
        '.tiptap-content a:hover': { 'opacity': '0.75' },

        /* ── ProseMirror base ──────────────────────────────── */
        '.tiptap-content .ProseMirror': {
          'padding': '20px 24px',
          'min-height': '400px',
          'max-height': 'none',
          'font-size': '16px',
          'line-height': '1.75',
          'outline': 'none',
        },

        /* ── Video ─────────────────────────────────────────── */
        '.tiptap-content div[data-youtube-video]': {
          'position': 'relative',
          'width': '100%',
          'max-width': '100%',
          'aspect-ratio': '16 / 9',
          'border-radius': '10px',
          'overflow': 'hidden',
          'margin': '1.5em 0',
        },
        '.tiptap-content div[data-youtube-video] iframe': {
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '100%',
          'border': 'none',
          'border-radius': '10px',
        },

        /* ── Editor text color dark/light ──────────────────── */
        '.tiptap-content--light.ProseMirror, .tiptap-content--light .ProseMirror': { 'color': '#111827' },
        '.tiptap-content--dark.ProseMirror,  .tiptap-content--dark .ProseMirror': { 'color': '#e4e4e7' },
        '.tiptap-content--dark .ProseMirror h1': { 'color': '#f4f4f5' },
        '.tiptap-content--dark .ProseMirror h2': { 'color': '#f4f4f5' },
        '.tiptap-content--dark .ProseMirror h3': { 'color': '#f4f4f5' },
        '.tiptap-content--dark .ProseMirror h4': { 'color': '#f4f4f5' },
        '.tiptap-content--dark .ProseMirror p.is-editor-empty:first-child::before': { 'color': '#52525b' },

        /* ══════════════════════════════════════════════════
           POST CONTENT
           ══════════════════════════════════════════════════ */

        /* Lists */
        '.post-content ul': {
          'list-style-type': 'disc',
          'padding-left': '2em',
          'margin': '0.5em 0 1.25em',
        },
        '.post-content ol': {
          'list-style-type': 'decimal',
          'padding-left': '2em',
          'margin': '0.5em 0 1.25em',
        },
        '.post-content li': { 'display': 'list-item' },
        '.post-content li > p': { 'margin': '0' },

        /* Blockquote */
        '.post-content blockquote': {
          'border-left': '4px solid #2563EB',
          'background': '#eff6ff',
          'margin': '1.5em 0',
          'padding': '0.875em 1.25em',
          'border-radius': '0 8px 8px 0',
          'font-style': 'italic',
          'color': '#1e40af',
          'quotes': 'none',
        },
        '.post-content blockquote p': { 'margin': '0', 'color': '#1e40af' },
        '.post-content--dark blockquote': {
          'background': '#1e2a45',
          'color': '#93c5fd',
          'border-left-color': '#2563EB',
        },
        '.post-content--dark blockquote p': { 'color': '#93c5fd' },

        /* Code block */
        '.post-content pre': {
          'font-family': '"Courier New", monospace',
          'font-size': '14px',
          'border-radius': '10px',
          'padding': '20px 24px',
          'margin': '1.5em 0',
          'overflow-x': 'auto',
          'white-space': 'pre',
          'line-height': '1.6',
          'display': 'block',
          'scrollbar-width': 'thin',
        },
        '.post-content--light pre': {
          'background': '#f3f4f6',
          'color': '#111827',
          'border': '1px solid #e5e7eb',
          'scrollbar-color': '#d1d5db #f3f4f6',
        },
        '.post-content--dark pre': {
          'background': '#1e1e2e',
          'color': '#cdd6f4',
          'border': '1px solid #313244',
          'scrollbar-color': '#374151 #1e1e2e',
        },

        /* WebKit scrollbar */
        '.post-content pre::-webkit-scrollbar': { 'width': '6px', 'height': '6px' },
        '.post-content pre::-webkit-scrollbar-track': { 'border-radius': '999px' },
        '.post-content pre::-webkit-scrollbar-thumb': { 'border-radius': '999px' },

        '.post-content--light pre::-webkit-scrollbar-track': { 'background': '#f3f4f6' },
        '.post-content--light pre::-webkit-scrollbar-thumb': { 'background': '#d1d5db' },
        '.post-content--light pre::-webkit-scrollbar-thumb:hover': { 'background': '#9ca3af' },

        '.post-content--dark pre::-webkit-scrollbar-track': { 'background': '#1e1e2e' },
        '.post-content--dark pre::-webkit-scrollbar-thumb': { 'background': '#374151' },
        '.post-content--dark pre::-webkit-scrollbar-thumb:hover': { 'background': '#4b5563' },

        '.post-content pre code': {
          'background': 'transparent',
          'color': 'inherit',
          'padding': '0',
          'font-size': 'inherit',
          'border-radius': '0',
          'font-family': 'inherit',
          'white-space': 'inherit',
        },

        /* Links (post view + preview) */
        '.post-content a': {
          'color': '#2563EB',
          'text-decoration': 'underline',
          'text-underline-offset': '3px',
          'cursor': 'pointer',
        },
        '.post-content a:hover': { 'opacity': '0.75' },

        /* Line breaks — preserve Enter/Shift+Enter from editor */
        '.post-content p': { 'white-space': 'pre-wrap' },
        '.post-content br': {
          'display': 'block',
          'content': '""',
          'margin-top': '0.5em',
        },

        /* Video */
        '.post-content div[data-youtube-video]': {
          'position': 'relative',
          'width': '100%',
          'max-width': '100%',
          'aspect-ratio': '16 / 9',
          'border-radius': '10px',
          'overflow': 'hidden',
          'margin': '1.5em 0',
        },
        '.post-content div[data-youtube-video] iframe': {
          'position': 'absolute',
          'top': '0',
          'left': '0',
          'width': '100%',
          'height': '100%',
          'border': 'none',
          'border-radius': '10px',
        },


        '.post-content p': {
          'margin-bottom': '0.4em',
          'min-height': '1em', /* empty <p> tags still take up space */
        },
        '.post-content p:empty': {
          'display': 'block',
          'height': '1em',
        },
        '.post-content p:empty::before': {
          'content': '""',
          'display': 'inline-block',
        },
        '.post-content br': {
          'display': 'block',
          'content': '""',
          'margin-top': '0.5em',
        },
        // ── Headings (tiptap editor) ────────────────────────────────
        '.tiptap-content .ProseMirror h1': {
          'font-size': '2em',
          'font-weight': '700',
          'line-height': '1.2',
          'margin': '0.67em 0',
        },
        '.tiptap-content .ProseMirror h2': {
          'font-size': '1.5em',
          'font-weight': '700',
          'line-height': '1.3',
          'margin': '0.75em 0',
        },
        '.tiptap-content .ProseMirror h3': {
          'font-size': '1.25em',
          'font-weight': '600',
          'line-height': '1.4',
          'margin': '0.83em 0',
        },
        '.tiptap-content .ProseMirror h4': {
          'font-size': '1.1em',
          'font-weight': '600',
          'line-height': '1.4',
          'margin': '1em 0',
        },
        '.tiptap-content .ProseMirror h5': {
          'font-size': '0.875em',
          'font-weight': '600',
          'margin': '1em 0',
        },
        '.tiptap-content .ProseMirror h6': {
          'font-size': '0.75em',
          'font-weight': '600',
          'margin': '1em 0',
        },
        // ── Headings (post view) ────────────────────────────────────
        '.post-content h1': { 'font-size': '2em', 'font-weight': '700', 'margin': '0.67em 0', 'line-height': '1.2' },
        '.post-content h2': { 'font-size': '1.5em', 'font-weight': '700', 'margin': '0.75em 0', 'line-height': '1.3' },
        '.post-content h3': { 'font-size': '1.25em', 'font-weight': '600', 'margin': '0.83em 0', 'line-height': '1.4' },
        '.post-content h4': { 'font-size': '1.1em', 'font-weight': '600', 'margin': '1em 0', 'line-height': '1.4' },
        '.post-content h5': { 'font-size': '0.875em', 'font-weight': '600', 'margin': '1em 0' },
        '.post-content h6': { 'font-size': '0.75em', 'font-weight': '600', 'margin': '1em 0' },

        // ── Scrollbar (editor) ──────────────────────────────────────
        '.tiptap-content': { 'scrollbar-width': 'thin' },
        '.tiptap-content--light': { 'scrollbar-color': '#d1d5db #f9fafb' },
        '.tiptap-content--dark': { 'scrollbar-color': '#374151 #141414' },

        // WebKit (Chrome, Safari, Edge)
        '.tiptap-content::-webkit-scrollbar': { 'width': '6px' },
        '.tiptap-content::-webkit-scrollbar-track': { 'border-radius': '999px' },
        '.tiptap-content::-webkit-scrollbar-thumb': { 'border-radius': '999px' },

        '.tiptap-content--light::-webkit-scrollbar-track': { 'background': '#f9fafb' },
        '.tiptap-content--light::-webkit-scrollbar-thumb': { 'background': '#d1d5db' },
        '.tiptap-content--light::-webkit-scrollbar-thumb:hover': { 'background': '#9ca3af' },

        '.tiptap-content--dark::-webkit-scrollbar-track': { 'background': '#141414' },
        '.tiptap-content--dark::-webkit-scrollbar-thumb': { 'background': '#374151' },
        '.tiptap-content--dark::-webkit-scrollbar-thumb:hover': { 'background': '#4b5563' },


      })
    }),
  ],
}
