import React from "react";
import type { MDXComponents } from "mdx/types";

const MdxImage: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({
  alt,
  title,
  className,
  loading,
  ...props
}) => {
  const caption =
    (typeof title === "string" && title.trim()) ||
    (typeof alt === "string" && alt.trim()) ||
    "";

  return (
    <figure className="my-8 flex flex-col items-center">
      <img
        {...props}
        alt={alt || caption}
        title={title}
        loading={loading || "lazy"}
        className={`!my-0 rounded-2xl border border-white/10 shadow-xl max-w-full h-auto ${className || ""}`.trim()}
      />
      {caption && (
        <figcaption className="mt-3 text-center text-sm text-slate-400 leading-relaxed max-w-2xl px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};

function isImageNode(node: React.ReactNode): boolean {
  if (!React.isValidElement(node)) return false;
  if (node.type === MdxImage || node.type === "img") return true;
  if (node.type === "a") {
    const linkChildren = React.Children.toArray(
      (node.props as { children?: React.ReactNode }).children
    ).filter((child) => !(typeof child === "string" && child.trim() === ""));
    return linkChildren.length === 1 && isImageNode(linkChildren[0]);
  }
  return false;
}

const MdxParagraph: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  children,
  ...props
}) => {
  const childArray = React.Children.toArray(children);
  const hasImage = childArray.some(isImageNode);

  if (!hasImage) {
    return <p {...props}>{children}</p>;
  }

  // 将图片从 <p> 中拆分出来，避免 <figure> 嵌套在 <p> 内导致 HTML 非法及水合警告
  const blocks: React.ReactNode[] = [];
  let inlineBuffer: React.ReactNode[] = [];

  const flushBuffer = (keyIndex: number) => {
    const hasMeaningfulContent = inlineBuffer.some(
      (item) => !(typeof item === "string" && item.trim() === "")
    );
    if (hasMeaningfulContent) {
      blocks.push(
        <p key={`p-${keyIndex}`} {...props}>
          {inlineBuffer}
        </p>
      );
    }
    inlineBuffer = [];
  };

  childArray.forEach((child, index) => {
    if (isImageNode(child)) {
      flushBuffer(index);
      blocks.push(
        <React.Fragment key={`img-${index}`}>{child}</React.Fragment>
      );
    } else {
      inlineBuffer.push(child);
    }
  });
  flushBuffer(childArray.length);

  return <>{blocks}</>;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    img: MdxImage,
    p: MdxParagraph,
    ...components,
  };
}
