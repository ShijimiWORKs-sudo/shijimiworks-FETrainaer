import { Fragment } from 'react';

/**
 * 問題文表示用の軽量Markdownレンダラ。
 * 依存ライブラリを増やさずに、コードフェンス(```)とインラインコード(`x`)、
 * 段落区切り(空行)のみをサポートする。
 */
export default function MarkdownLite({ text }: { text: string }) {
  const blocks = splitBlocks(text);
  return (
    <div className="markdown-lite">
      {blocks.map((block, i) =>
        block.type === 'code' ? (
          <pre key={i}>
            <code>{block.content}</code>
          </pre>
        ) : (
          <p key={i}>{renderInline(block.content)}</p>
        ),
      )}
    </div>
  );
}

type Block = { type: 'text' | 'code'; content: string };

function splitBlocks(text: string): Block[] {
  const parts = text.split(/```/);
  const blocks: Block[] = [];
  parts.forEach((part, i) => {
    if (i % 2 === 1) {
      blocks.push({ type: 'code', content: part.replace(/^\n/, '').replace(/\n$/, '') });
    } else {
      const paragraphs = part.split(/\n\n+/).map((p) => p.trim()).filter(Boolean);
      for (const p of paragraphs) blocks.push({ type: 'text', content: p });
    }
  });
  return blocks;
}

function renderInline(text: string) {
  const segments = text.split(/(`[^`]+`)/g);
  return segments.map((seg, i) => {
    if (seg.startsWith('`') && seg.endsWith('`') && seg.length > 1) {
      return <code key={i}>{seg.slice(1, -1)}</code>;
    }
    return <Fragment key={i}>{seg}</Fragment>;
  });
}
