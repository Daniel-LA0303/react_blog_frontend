import { Node, mergeAttributes, nodeInputRule } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";

export interface ResizableImageOptions {
  inline: boolean;
  allowBase64: boolean;
  HTMLAttributes: Record<string, any>;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    resizableImage: {
      setResizableImage: (options: {
        src: string; alt?: string; title?: string; width?: number; style?: string;
      }) => ReturnType;
    };
  }
}

const IMAGE_INPUT_REGEX = /!\[(.+|:?)]\((\S+)(?:(?:\s+)["'](\S+)["'])?\)/;

const ResizableImage = Node.create<ResizableImageOptions>({
  name: "resizableImage",
  group: "block",
  atom: true,
  draggable: true,

  addOptions() {
    return { inline: false, allowBase64: false, HTMLAttributes: {} };
  },

  addAttributes() {
    return {
      src:   { default: null },
      alt:   { default: null },
      title: { default: null },
      width: { default: "100%" },
      // style stores alignment: margin values
      style: { default: "margin: 0 auto; display: block;" },
    };
  },

  parseHTML() {
    return [{ tag: "img[src]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageComponent);
  },

  addCommands() {
    return {
      setResizableImage: (options) => ({ commands }) =>
        commands.insertContent({ type: this.name, attrs: options }),
    };
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: IMAGE_INPUT_REGEX,
        type: this.type,
        getAttributes: (match) => {
          const [, alt, src, title] = match;
          return { src, alt, title };
        },
      }),
    ];
  },
});

export default ResizableImage;