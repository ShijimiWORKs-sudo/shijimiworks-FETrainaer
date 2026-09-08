import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProgress } from '@/state/ProgressContext';
import { ALL_QUESTIONS } from '@/data/questions';
import { categoryAccuracy } from '@/lib/quizSelection';
import { CATEGORIES_A, CATEGORIES_B, CATEGORY_LABEL, type Subject } from '@/types/question';
import './PracticeHubPage.css';

const DESCRIPTIONS: Record<string, string> = {
  technology: 'コンピュータ科学の基礎、DB、ネットワーク、セキュリティ概論など',
  management: 'プロジェクトマネジメント、サービスマネジメント、システム監査',
  strategy: '経営戦略、マーケティング、会計・法務の基礎',
  pseudocode: 'ステップ実行ビジュアライザで変数の変化を確認しながら学ぶ',
  algorithm: 'ソート・探索・スタック/キューなど代表的アルゴリズムのトレース',
  datastructure: '配列・連結リスト・木構造・ハッシュ・グラフの基礎知識',
  security: '情報セキュリティの基礎知識、攻撃手法と対策',
};

export default function PracticeHubPage() {
  const [subject, setSubject] = useState<Subject>('A');
  const { progress } = useProgress();
  const acc = categoryAccuracy(ALL_QUESTIONS, progress);
  const categories = subject === 'A' ? CATEGORIES_A : CATEGORIES_B;

  return (
    <div>
      <div className="segmented" role="tablist" aria-label="科目切替">
        <button
          role="tab"
          aria-selected={subject === 'A'}
          className={subject === 'A' ? 'is-active' : ''}
          onClick={() => setSubject('A')}
        >
          科目A
        </button>
        <button
          role="tab"
          aria-selected={subject === 'B'}
          className={subject === 'B' ? 'is-active' : ''}
          onClick={() => setSubject('B')}
        >
          科目B
        </button>
      </div>

      <ul className="practice-category-list">
        {categories.map((cat) => {
          const stat = acc[cat];
          const rate = stat && stat.attempted > 0 ? Math.round((stat.correct / stat.attempted) * 100) : null;
          return (
            <li key={cat}>
              <Link to={`/practice/${subject}/${cat}`} className="practice-category-card card">
                <div className="practice-category-main">
                  <p className="practice-category-title">{CATEGORY_LABEL[cat]}</p>
                  <p className="practice-category-desc">{DESCRIPTIONS[cat]}</p>
                </div>
                <div className="practice-category-side">
                  <span className="badge">{stat?.total ?? 0}問</span>
                  {rate !== null && <span className="badge badge-accent">{rate}%</span>}
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
