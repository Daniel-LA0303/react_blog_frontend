import React, { useCallback, useEffect, useRef, useState } from "react";
import { NodeViewWrapper } from "@tiptap/react";

interface Props {
  node: any;
  updateAttributes: (attrs: Record<string, any>) => void;
  selected: boolean;
}

const MIN_WIDTH = 60;

const ResizableImageComponent = ({ node, updateAttributes, selected }: Props) => {
  const { src, alt, title, width, style } = node.attrs;
  const containerRef  = useRef<HTMLDivElement>(null);
  const startX        = useRef(0);
  const startWidth    = useRef(0);
  const [currentWidth, setCurrentWidth] = useState<number | string>(width ?? "100%");

  useEffect(() => { setCurrentWidth(width ?? "100%"); }, [width]);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const container = containerRef.current;
    if (!container) return;
    startX.current     = e.clientX;
    startWidth.current = container.getBoundingClientRect().width;
    const onMove = (ev: MouseEvent) => {
      setCurrentWidth(Math.max(MIN_WIDTH, startWidth.current + ev.clientX - startX.current));
    };
    const onUp = (ev: MouseEvent) => {
      const newWidth = Math.max(MIN_WIDTH, startWidth.current + ev.clientX - startX.current);
      updateAttributes({ width: newWidth });
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [updateAttributes]);

  /* Parse margin from style attr to determine current alignment */
  const getAlignment = () => {
    if (!style) return "center";
    if (style.includes("0 0 0 auto")) return "right";
    if (style.includes("0 auto 0 0")) return "left";
    return "center";
  };

  return (
    <NodeViewWrapper style={{ display: "block", lineHeight: 0 }}>
      <div
        ref={containerRef}
        style={{
          position:  "relative",
          display:   "block",
          width:     typeof currentWidth === "number" ? `${currentWidth}px` : currentWidth,
          maxWidth:  "100%",
          lineHeight: 0,
          /* Apply alignment via margin */
          margin: style
            ? undefined  /* style attr controls margin when set */
            : "0 auto",  /* default: center */
          ...(style ? { margin: style.match(/margin:\s*([^;]+)/)?.[1] ?? "0 auto" } : {}),
        }}
      >
        <img
          src={src} alt={alt ?? ""} title={title ?? ""}
          style={{
            width: "100%", height: "auto", display: "block",
            borderRadius: "8px",
            outline: selected ? "2px solid #2563EB" : "2px solid transparent",
            outlineOffset: "2px",
            transition: "outline 0.15s",
            userSelect: "none",
          }}
          draggable={false}
        />

        {/* Right handle */}
        {selected && (
          <div onMouseDown={onMouseDown} style={{
            position: "absolute", right: -6, top: "50%",
            transform: "translateY(-50%)",
            width: 12, height: 40, background: "#2563EB",
            borderRadius: 4, cursor: "ew-resize", zIndex: 10,
          }} />
        )}

        {/* Corner handle */}
        {selected && (
          <div onMouseDown={onMouseDown} style={{
            position: "absolute", right: -6, bottom: -6,
            width: 14, height: 14, background: "#2563EB",
            borderRadius: "50%", cursor: "nwse-resize", zIndex: 10,
          }} />
        )}

        {/* Size badge */}
        {selected && typeof currentWidth === "number" && (
          <div style={{
            position: "absolute", bottom: 8, left: 8,
            background: "rgba(0,0,0,0.6)", color: "#fff",
            fontSize: 11, padding: "2px 6px", borderRadius: 4,
            pointerEvents: "none", fontFamily: "monospace",
          }}>
            {Math.round(currentWidth as number)}px · {getAlignment()}
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
};

export default ResizableImageComponent;