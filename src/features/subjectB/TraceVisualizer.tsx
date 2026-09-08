import { useEffect, useMemo, useRef, useState } from 'react';
import type { TraceProgram } from '@/types/trace';
import { formatValue, runTrace } from '@/lib/pseudocode/interpreter';
import './TraceVisualizer.css';

interface Props {
  trace: TraceProgram;
}

export default function TraceVisualizer({ trace }: Props) {
  const steps = useMemo(() => runTrace(trace), [trace]);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const step = steps[index];
  const atStart = index === 0;
  const atEnd = index === steps.length - 1;

  useEffect(() => {
    if (!playing) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => {
        if (i >= steps.length - 1) {
          setPlaying(false);
          return i;
        }
        return i + 1;
      });
    }, 900);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [playing, steps.length]);

  const varEntries = Object.entries(step.vars);

  return (
    <div className="trace-visualizer" data-testid="trace-visualizer">
      <div className="trace-source" aria-label="擬似言語ソースコード">
        {trace.sourceLines.map((line, i) => {
          const lineNo = i + 1;
          const isActive = step.currentLine === lineNo;
          return (
            <div key={i} className={`trace-source-line${isActive ? ' is-active' : ''}`}>
              <span className="trace-line-no">{lineNo}</span>
              <span className="trace-line-text">{line}</span>
            </div>
          );
        })}
      </div>

      <div className="trace-vars" aria-label="変数の状態">
        {varEntries.length === 0 ? (
          <p className="trace-empty">まだ変数はありません</p>
        ) : (
          <table>
            <thead>
              <tr>
                {varEntries.map(([key]) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {varEntries.map(([key, value]) => (
                  <td key={key} className={step.changedKeys.includes(key) ? 'is-changed' : ''}>
                    {formatValue(value)}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        )}
      </div>

      {step.output.length > 0 && (
        <div className="trace-output">
          <span className="trace-output-label">出力:</span> {step.output.join(', ')}
        </div>
      )}

      <p className="trace-note">
        ステップ {step.stepIndex} / {steps.length - 1}　{step.note}
      </p>

      <div className="trace-controls">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setPlaying(false);
            setIndex(0);
          }}
          disabled={atStart}
        >
          ⏮ 最初から
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.max(0, i - 1));
          }}
          disabled={atStart}
        >
          ← 戻る
        </button>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setPlaying(false);
            setIndex((i) => Math.min(steps.length - 1, i + 1));
          }}
          disabled={atEnd}
        >
          次のステップ →
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => setPlaying((p) => !p)}
          disabled={atEnd && !playing}
        >
          {playing ? '⏸ 停止' : '▶ 自動実行'}
        </button>
      </div>
    </div>
  );
}
