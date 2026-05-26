import React, { useEffect, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import ImageResize from 'quill-image-resize-module-react';

// ─── Image Resize───
// quill-image-resize-module-react must be registered on the window object
// before Quill uses it (Webpack/Vite quirk)

Quill.register("modules/imageResize", ImageResize);

// ─── Custom icons───
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
  </svg>
);

const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
  </svg>
);

// ─── Undo / Redo handlers
// NOTE: handlers inside modules() receive `this` = the toolbar instance,
// so we can't close over quillRef. Instead we navigate up from the toolbar
// container to find the editor — this is the correct pattern for custom toolbars.
const undoChange = function (this: any) {
  this.quill?.history?.undo();
};
const redoChange = function (this: any) {
  this.quill?.history?.redo();
};

// ─── Register Size
const Size = Quill.import("formats/size") as any;
Size.whitelist = ["extra-small", "small", "medium", "large"];
Quill.register(Size, true);

// ─── Register Font
const Font = Quill.import("formats/font") as any;
Font.whitelist = ["arial", "comic-sans", "courier-new", "georgia", "helvetica", "Inter"];
Quill.register(Font, true);

// ─── Modules factory
export const modules = (toolbarId: string) => ({
  toolbar: {
    container: "#" + toolbarId,
    handlers: { undo: undoChange, redo: redoChange },
  },
  history: { delay: 500, maxStack: 100, userOnly: true },
  imageResize: {
    parchment: Quill.import("parchment"),
    modules: ["Resize", "DisplaySize", "Toolbar"],
    // ✅ This tells the module to save as inline style, not attributes
    handleStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
    },
    displayStyles: {
      backgroundColor: "black",
      border: "none",
      color: "white",
    },
  },
});

// ─── Formats 
export const formats = [
  "header", "font", "size",
  "bold", "italic", "underline", "strike",
  "align", "script", "blockquote",
  "background", "color",
  "list", "bullet", "indent",
  "link", "image", "video",
  "code-block",
];

// ─── Toolbar UI 
export const QuillToolbar = ({ toolbarId }: { toolbarId: string }) => {
  if (!toolbarId) return null;
  return (
    <div id={toolbarId} className="ql-toolbar-custom">
      <span className="ql-formats">
        <button className="ql-bold" />
        <button className="ql-italic" />
        <button className="ql-underline" />
        <button className="ql-strike" />
      </span>

      <span className="ql-formats">
        <select className="ql-font" defaultValue="Inter">
          <option value="arial">Arial</option>
          <option value="comic-sans">Comic Sans</option>
          <option value="courier-new">Courier New</option>
          <option value="georgia">Georgia</option>
          <option value="helvetica">Helvetica</option>
          <option value="Inter">Inter</option>
        </select>
        <select className="ql-size" defaultValue="medium">
          <option value="extra-small">XS</option>
          <option value="small">S</option>
          <option value="medium">M</option>
          <option value="large">L</option>
        </select>
        <select className="ql-header" defaultValue="">
          <option value="1">H1</option>
          <option value="2">H2</option>
          <option value="3">H3</option>
          <option value="4">H4</option>
          <option value="5">H5</option>
          <option value="6">H6</option>
          <option value="">Normal</option>
        </select>
      </span>

      <span className="ql-formats">
        <button className="ql-list" value="ordered" />
        <button className="ql-list" value="bullet" />
        <button className="ql-indent" value="-1" />
        <button className="ql-indent" value="+1" />
      </span>

      <span className="ql-formats">
        <button className="ql-script" value="super" />
        <button className="ql-script" value="sub" />
      </span>

      <span className="ql-formats">
        <select className="ql-align" />
        <select className="ql-color" />
        <select className="ql-background" />
      </span>

      <span className="ql-formats">
        <button className="ql-blockquote" />
        <button className="ql-code-block" />
      </span>

      <span className="ql-formats">
        <button className="ql-link" />
        <button className="ql-image" />
        <button className="ql-video" />
      </span>

      <span className="ql-formats">
        <button className="ql-undo"><CustomUndo /></button>
        <button className="ql-redo"><CustomRedo /></button>
      </span>
    </div>
  );
};

export default QuillToolbar;