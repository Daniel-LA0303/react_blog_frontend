/**
 * PostContent.tsx
 * Single source of truth for rendering post HTML.
 * Used in: post view page + editor preview tab.
 */
import React from "react";

interface PostContentProps {
  html: string;
  dark?: boolean;
}

const PostContent = ({ html, dark = false }: PostContentProps) => {
  return (
    <div
      /**
       * DO NOT add ql-editor here — it resets color/bg and fights our theme.
       * We keep ql-indent-N classes working via post-content.css directly.
       */
      className={`post-content ${dark ? "post-content--dark" : "post-content--light"}`}
      dangerouslySetInnerHTML={{ __html: html || "" }}
    />
  );
};

export default PostContent;