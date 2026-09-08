import type { Question } from '@/types/question';
import {
  add,
  assign,
  assignAt,
  and,
  bool,
  div,
  eq,
  forTo,
  gt,
  gte,
  idx,
  ifStmt,
  len,
  lte,
  lt,
  mod,
  mul,
  n,
  output,
  str,
  sub,
  v,
  whileStmt,
} from '@/lib/pseudocode/dsl';

export const pseudocodeQuestions: Question[] = [
  {
    id: 'B-PSE-001',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '配列の合計値',
    body:
      '次の擬似言語で示す手続を、配列 `arr` の値が `[3, 5, 2, 8]` として実行する。\n\n' +
      '```\n(1) i ← 0\n(2) sum ← 0\n(3) iを0から3まで1ずつ増やしながら、(4)を実行する\n(4)   sum ← sum + arr[i]\n```\n\n' +
      '「次のステップ」で1回のループごとの `i` と `sum` の変化を確認しながら、実行終了時の `sum` の値を求めよ。',
    choices: [
      { id: '1', text: '10' },
      { id: '2', text: '15' },
      { id: '3', text: '18' },
      { id: '4', text: '20' },
    ],
    answerId: '3',
    explanation: '3 + 5 + 2 + 8 = 18。ループを1回実行するごとにarr[i]をsumへ加算し、iを1ずつ増やしていく。',
    trace: {
      sourceLines: [
        'i ← 0',
        'sum ← 0',
        'iを0から3まで1ずつ増やしながら、繰り返す',
        '  sum ← sum + arr[i]',
      ],
      initialVars: { arr: [3, 5, 2, 8] },
      program: [
        assign(1, 'i', n(0)),
        assign(2, 'sum', n(0)),
        forTo(3, 'i', n(0), n(3), [assign(4, 'sum', add(v('sum'), idx('arr', v('i'))))]),
      ],
    },
  },
  {
    id: 'B-PSE-002',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '配列の最大値',
    body:
      '配列 `arr` の値が `[4, 9, 2, 7]` であるとき、次の擬似言語を実行して最大値を求める。\n\n' +
      '```\n(1) max ← arr[0]\n(2) i ← 1\n(3) iが4未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] > maxならば max ← arr[i]\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `max` の値はどれか。ステップ実行で `max` がいつ更新されるか確認せよ。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '4' },
      { id: '3', text: '7' },
      { id: '4', text: '9' },
    ],
    answerId: '4',
    explanation:
      '初期値max=arr[0]=4から開始し、arr[1]=9のときmaxが9に更新される。以降arr[2]=2, arr[3]=7はmax=9を超えないため、最終的なmaxは9。',
    trace: {
      sourceLines: [
        'max ← arr[0]',
        'i ← 1',
        'iが4未満の間、繰り返す',
        '  もしarr[i] > maxならば max ← arr[i]',
        '  i ← i + 1',
      ],
      initialVars: { arr: [4, 9, 2, 7] },
      program: [
        assign(1, 'max', idx('arr', n(0))),
        assign(2, 'i', n(1)),
        whileStmt(3, lt(v('i'), n(4)), [
          ifStmt(4, lt(v('max'), idx('arr', v('i'))), [assign(4, 'max', idx('arr', v('i')))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-003',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '特定値の出現回数を数える',
    body:
      '配列 `arr` の値が `[3, 7, 3, 3, 5, 3]` であるとき、次の擬似言語を実行して値 `3` の出現回数を数える。\n\n' +
      '```\n(1) count ← 0\n(2) i ← 0\n(3) iが6未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] = 3ならば count ← count + 1\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `count` の値はどれか。',
    choices: [
      { id: '1', text: '3' },
      { id: '2', text: '4' },
      { id: '3', text: '5' },
      { id: '4', text: '6' },
    ],
    answerId: '2',
    explanation: '配列中の値3はインデックス0, 2, 3, 5の4か所に出現するため、countは4になる。',
    trace: {
      sourceLines: [
        'count ← 0',
        'i ← 0',
        'iが6未満の間、繰り返す',
        '  もしarr[i] = 3ならば count ← count + 1',
        '  i ← i + 1',
      ],
      initialVars: { arr: [3, 7, 3, 3, 5, 3] },
      program: [
        assign(1, 'count', n(0)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(6)), [
          ifStmt(4, eq(idx('arr', v('i')), n(3)), [assign(4, 'count', add(v('count'), n(1)))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-004',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '配列の反転',
    body:
      '配列 `arr` の値が `[1, 2, 3, 4, 5]` であるとき、次の擬似言語を実行して配列を反転する。\n\n' +
      '```\n(1) i ← 0\n(2) j ← 4\n(3) iがj未満の間、(4)〜(7)を繰り返す\n(4)   temp ← arr[i]\n(5)   arr[i] ← arr[j]\n(6)   arr[j] ← temp\n(7)   i ← i + 1、j ← j - 1\n```\n\n' +
      '実行終了時の配列 `arr` はどれか。',
    choices: [
      { id: '1', text: '[1, 2, 3, 4, 5]（変化なし）' },
      { id: '2', text: '[5, 4, 3, 2, 1]' },
      { id: '3', text: '[5, 2, 3, 4, 1]' },
      { id: '4', text: '[2, 1, 4, 3, 5]' },
    ],
    answerId: '2',
    explanation:
      'i=0,j=4から始め、両端の要素をtempを使って交換しながらi,jを中央に寄せていく（i=1,j=3 → i=2,j=2で終了）。結果として配列は完全に反転し[5,4,3,2,1]となる。',
    trace: {
      sourceLines: [
        'i ← 0',
        'j ← 4',
        'iがj未満の間、繰り返す',
        '  temp ← arr[i]',
        '  arr[i] ← arr[j]',
        '  arr[j] ← temp',
        '  i ← i + 1、j ← j - 1',
      ],
      initialVars: { arr: [1, 2, 3, 4, 5] },
      program: [
        assign(1, 'i', n(0)),
        assign(2, 'j', n(4)),
        whileStmt(3, lt(v('i'), v('j')), [
          assign(4, 'temp', idx('arr', v('i'))),
          assignAt(5, 'arr', v('i'), idx('arr', v('j'))),
          assignAt(6, 'arr', v('j'), v('temp')),
          assign(7, 'i', add(v('i'), n(1))),
          assign(7, 'j', sub(v('j'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-005',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '平均値の計算',
    body:
      '配列 `arr` の値が `[10, 20, 30, 40]` であるとき、次の擬似言語を実行して平均値を求める。\n\n' +
      '```\n(1) n ← 配列arrの要素数\n(2) sum ← 0\n(3) i ← 0\n(4) iがn未満の間、(5)〜(6)を繰り返す\n(5)   sum ← sum + arr[i]\n(6)   i ← i + 1\n(7) avg ← sum ÷ n\n```\n\n' +
      '実行終了時の `avg` の値はどれか。',
    choices: [
      { id: '1', text: '20' },
      { id: '2', text: '25' },
      { id: '3', text: '30' },
      { id: '4', text: '100' },
    ],
    answerId: '2',
    explanation: '合計は10+20+30+40=100、要素数は4なので、平均avg=100÷4=25となる。',
    trace: {
      sourceLines: [
        'n ← 配列arrの要素数',
        'sum ← 0',
        'i ← 0',
        'iがn未満の間、繰り返す',
        '  sum ← sum + arr[i]',
        '  i ← i + 1',
        'avg ← sum ÷ n',
      ],
      initialVars: { arr: [10, 20, 30, 40] },
      program: [
        assign(1, 'n', len('arr')),
        assign(2, 'sum', n(0)),
        assign(3, 'i', n(0)),
        whileStmt(4, lt(v('i'), v('n')), [
          assign(5, 'sum', add(v('sum'), idx('arr', v('i')))),
          assign(6, 'i', add(v('i'), n(1))),
        ]),
        assign(7, 'avg', { kind: 'bin', op: '/', left: v('sum'), right: v('n') }),
      ],
    },
  },
  {
    id: 'B-PSE-006',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '線形探索',
    body:
      '配列 `arr` の値が `[15, 8, 42, 23, 4]`、探索対象 `target` が `23` であるとき、次の擬似言語で線形探索を行う。\n\n' +
      '```\n(1) i ← 0\n(2) found ← -1\n(3) iが5未満 かつ foundが-1である間、(4)〜(5)を繰り返す\n(4)   もしarr[i] = targetならば found ← i\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `found`（見つかった要素のインデックス）の値はどれか。',
    choices: [
      { id: '1', text: '1' },
      { id: '2', text: '2' },
      { id: '3', text: '3' },
      { id: '4', text: '-1' },
    ],
    answerId: '3',
    explanation:
      'i=3のときarr[3]=23がtargetと一致するのでfound←3となり、found=-1でなくなるためループ条件が偽になり終了する。答えは3。',
    trace: {
      sourceLines: [
        'i ← 0',
        'found ← -1',
        'iが5未満 かつ foundが-1である間、繰り返す',
        '  もしarr[i] = targetならば found ← i',
        '  i ← i + 1',
      ],
      initialVars: { arr: [15, 8, 42, 23, 4], target: 23 },
      program: [
        assign(1, 'i', n(0)),
        assign(2, 'found', n(-1)),
        whileStmt(3, and(lt(v('i'), n(5)), eq(v('found'), n(-1))), [
          ifStmt(4, eq(idx('arr', v('i')), v('target')), [assign(4, 'found', v('i'))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-007',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: 'フィボナッチ数列',
    body:
      '次の擬似言語を実行し、フィボナッチ数列（0, 1, 1, 2, 3, 5, 8, ...）の第7項を求める。\n\n' +
      '```\n(1) a ← 0\n(2) b ← 1\n(3) iを1から6まで1ずつ増やしながら、(4)〜(6)を実行する\n(4)   temp ← a + b\n(5)   a ← b\n(6)   b ← temp\n```\n\n' +
      '実行終了時の `b` の値（フィボナッチ数列の第7項）はどれか。',
    choices: [
      { id: '1', text: '5' },
      { id: '2', text: '8' },
      { id: '3', text: '13' },
      { id: '4', text: '21' },
    ],
    answerId: '3',
    explanation:
      '0,1から始め、a,bを更新しながら6回繰り返すと 1,1,2,3,5,8,13 と推移し、bは13(第7項)になる。',
    trace: {
      sourceLines: [
        'a ← 0',
        'b ← 1',
        'iを1から6まで1ずつ増やしながら、繰り返す',
        '  temp ← a + b',
        '  a ← b',
        '  b ← temp',
      ],
      initialVars: {},
      program: [
        assign(1, 'a', n(0)),
        assign(2, 'b', n(1)),
        forTo(3, 'i', n(1), n(6), [
          assign(4, 'temp', add(v('a'), v('b'))),
          assign(5, 'a', v('b')),
          assign(6, 'b', v('temp')),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-008',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '階乗の計算',
    body:
      '次の擬似言語を実行し、`n = 5` の階乗（5!）を求める。\n\n' +
      '```\n(1) result ← 1\n(2) iを1からnまで1ずつ増やしながら、(3)を実行する\n(3)   result ← result × i\n```\n\n' +
      '実行終了時の `result` の値はどれか。',
    choices: [
      { id: '1', text: '24' },
      { id: '2', text: '60' },
      { id: '3', text: '100' },
      { id: '4', text: '120' },
    ],
    answerId: '4',
    explanation: '5! = 1×2×3×4×5 = 120。ループのたびにresultにiを掛け合わせていく。',
    trace: {
      sourceLines: ['result ← 1', 'iを1からnまで1ずつ増やしながら、繰り返す', '  result ← result × i'],
      initialVars: { n: 5 },
      program: [assign(1, 'result', n(1)), forTo(2, 'i', n(1), v('n'), [assign(3, 'result', mul(v('result'), v('i')))])],
    },
  },
  {
    id: 'B-PSE-009',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '最小値のインデックス',
    body:
      '配列 `arr` の値が `[9, 3, 7, 1, 5]` であるとき、次の擬似言語を実行して最小値のインデックスを求める。\n\n' +
      '```\n(1) minIdx ← 0\n(2) i ← 1\n(3) iが5未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] < arr[minIdx]ならば minIdx ← i\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `minIdx` の値はどれか。この処理は選択ソートの中核部分にあたる。',
    choices: [
      { id: '1', text: '0' },
      { id: '2', text: '1' },
      { id: '3', text: '2' },
      { id: '4', text: '3' },
    ],
    answerId: '4',
    explanation:
      '最小値1はインデックス3にある。i=1でarr[1]=3<arr[0]=9のためminIdx=1に更新され、i=3でarr[3]=1<arr[1]=3のためminIdx=3に更新される。以降更新はなく最終的にminIdx=3。',
    trace: {
      sourceLines: [
        'minIdx ← 0',
        'i ← 1',
        'iが5未満の間、繰り返す',
        '  もしarr[i] < arr[minIdx]ならば minIdx ← i',
        '  i ← i + 1',
      ],
      initialVars: { arr: [9, 3, 7, 1, 5] },
      program: [
        assign(1, 'minIdx', n(0)),
        assign(2, 'i', n(1)),
        whileStmt(3, lt(v('i'), n(5)), [
          ifStmt(4, lt(idx('arr', v('i')), idx('arr', v('minIdx'))), [assign(4, 'minIdx', v('i'))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-010',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '文字の出現回数',
    body:
      '文字型配列 `chars` の値が `["a", "b", "a", "c", "a"]` であるとき、次の擬似言語を実行して文字 `"a"` の出現回数を数える。\n\n' +
      '```\n(1) count ← 0\n(2) i ← 0\n(3) iが5未満の間、(4)〜(5)を繰り返す\n(4)   もしchars[i] = "a"ならば count ← count + 1\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `count` の値はどれか。',
    choices: [
      { id: '1', text: '1' },
      { id: '2', text: '2' },
      { id: '3', text: '3' },
      { id: '4', text: '4' },
    ],
    answerId: '3',
    explanation: '"a"はインデックス0, 2, 4の3か所に出現するため、countは3になる。',
    trace: {
      sourceLines: [
        'count ← 0',
        'i ← 0',
        'iが5未満の間、繰り返す',
        '  もしchars[i] = "a"ならば count ← count + 1',
        '  i ← i + 1',
      ],
      initialVars: { chars: ['a', 'b', 'a', 'c', 'a'] },
      program: [
        assign(1, 'count', n(0)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(5)), [
          ifStmt(4, eq(idx('chars', v('i')), str('a')), [assign(4, 'count', add(v('count'), n(1)))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-011',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '偶数の個数を数える',
    body:
      '配列 `arr` の値が `[3, 4, 7, 8, 10, 15, 6]` であるとき、次の擬似言語を実行して偶数の個数を数える。\n\n' +
      '```\n(1) count ← 0\n(2) i ← 0\n(3) iが7未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] mod 2 = 0ならば count ← count + 1\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `count` の値はどれか。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '3' },
      { id: '3', text: '4' },
      { id: '4', text: '5' },
    ],
    answerId: '3',
    explanation: '偶数は4, 8, 10, 6の4個であるため、countは4になる。剰余（mod）が0かどうかで偶数判定を行う。',
    trace: {
      sourceLines: [
        'count ← 0',
        'i ← 0',
        'iが7未満の間、繰り返す',
        '  もしarr[i] mod 2 = 0ならば count ← count + 1',
        '  i ← i + 1',
      ],
      initialVars: { arr: [3, 4, 7, 8, 10, 15, 6] },
      program: [
        assign(1, 'count', n(0)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(7)), [
          ifStmt(4, eq(mod(idx('arr', v('i')), n(2)), n(0)), [assign(4, 'count', add(v('count'), n(1)))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-012',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '配列の総乗',
    body:
      '配列 `arr` の値が `[1, 2, 3, 4]` であるとき、次の擬似言語を実行して全要素の積を求める。\n\n' +
      '```\n(1) product ← 1\n(2) i ← 0\n(3) iが4未満の間、(4)〜(5)を繰り返す\n(4)   product ← product × arr[i]\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `product` の値はどれか。',
    choices: [
      { id: '1', text: '10' },
      { id: '2', text: '12' },
      { id: '3', text: '20' },
      { id: '4', text: '24' },
    ],
    answerId: '4',
    explanation: '1×2×3×4 = 24。ループのたびにproductにarr[i]を掛け合わせていく。',
    trace: {
      sourceLines: [
        'product ← 1',
        'i ← 0',
        'iが4未満の間、繰り返す',
        '  product ← product × arr[i]',
        '  i ← i + 1',
      ],
      initialVars: { arr: [1, 2, 3, 4] },
      program: [
        assign(1, 'product', n(1)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(4)), [
          assign(4, 'product', mul(v('product'), idx('arr', v('i')))),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-013',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '全要素が正の値か判定',
    body:
      '配列 `arr` の値が `[5, 3, -2, 8, 1]` であるとき、次の擬似言語を実行して全要素が正の値かどうかを判定する。\n\n' +
      '```\n(1) allPositive ← 真\n(2) i ← 0\n(3) iが5未満 かつ allPositiveが真である間、(4)〜(5)を繰り返す\n(4)   もしarr[i] < 0ならば allPositive ← 偽\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `allPositive` の値はどれか。',
    choices: [
      { id: '1', text: '真（すべて正の値）' },
      { id: '2', text: '偽（負の値を含む）' },
      { id: '3', text: 'エラーになる' },
      { id: '4', text: '判定できない' },
    ],
    answerId: '2',
    explanation:
      'arr[2] = -2 が負の値であるため、i=2の時点でallPositiveは偽に更新される。かつ条件による短絡的な打ち切りにより、それ以降の要素は判定不要になる。',
    trace: {
      sourceLines: [
        'allPositive ← 真',
        'i ← 0',
        'iが5未満 かつ allPositiveが真である間、繰り返す',
        '  もしarr[i] < 0ならば allPositive ← 偽',
        '  i ← i + 1',
      ],
      initialVars: { arr: [5, 3, -2, 8, 1] },
      program: [
        assign(1, 'allPositive', bool(true)),
        assign(2, 'i', n(0)),
        whileStmt(3, and(lt(v('i'), n(5)), v('allPositive')), [
          ifStmt(4, lt(idx('arr', v('i')), n(0)), [assign(4, 'allPositive', bool(false))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-014',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '偶数インデックスの合計',
    body:
      '配列 `arr` の値が `[2, 5, 8, 1, 9, 4]` であるとき、次の擬似言語を実行してインデックスが偶数（0, 2, 4）の要素の合計を求める。\n\n' +
      '```\n(1) sum ← 0\n(2) iを0から4まで2ずつ増やしながら、(3)を実行する\n(3)   sum ← sum + arr[i]\n```\n\n' +
      '実行終了時の `sum` の値はどれか。',
    choices: [
      { id: '1', text: '11' },
      { id: '2', text: '15' },
      { id: '3', text: '19' },
      { id: '4', text: '29' },
    ],
    answerId: '3',
    explanation:
      '増分を2に指定したforループにより、iは0, 2, 4と変化する。arr[0]+arr[2]+arr[4] = 2+8+9 = 19となる。',
    trace: {
      sourceLines: ['sum ← 0', 'iを0から4まで2ずつ増やしながら、繰り返す', '  sum ← sum + arr[i]'],
      initialVars: { arr: [2, 5, 8, 1, 9, 4] },
      program: [
        assign(1, 'sum', n(0)),
        forTo(2, 'i', n(0), n(4), [assign(3, 'sum', add(v('sum'), idx('arr', v('i'))))], n(2)),
      ],
    },
  },
  {
    id: 'B-PSE-015',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 1,
    title: '閾値より大きい要素の個数',
    body:
      '配列 `arr` の値が `[10, 25, 3, 42, 17, 8]`、`threshold` が `15` であるとき、次の擬似言語を実行する。\n\n' +
      '```\n(1) count ← 0\n(2) i ← 0\n(3) iが6未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] > thresholdならば count ← count + 1\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `count`（thresholdより大きい要素の個数）の値はどれか。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '3' },
      { id: '3', text: '4' },
      { id: '4', text: '6' },
    ],
    answerId: '2',
    explanation: 'threshold(15)より大きい値は25, 42, 17の3個であるため、countは3になる。',
    trace: {
      sourceLines: [
        'count ← 0',
        'i ← 0',
        'iが6未満の間、繰り返す',
        '  もしarr[i] > thresholdならば count ← count + 1',
        '  i ← i + 1',
      ],
      initialVars: { arr: [10, 25, 3, 42, 17, 8], threshold: 15 },
      program: [
        assign(1, 'count', n(0)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(6)), [
          ifStmt(4, gt(idx('arr', v('i')), v('threshold')), [assign(4, 'count', add(v('count'), n(1)))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-016',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '最大値と最小値の差（範囲）',
    body:
      '配列 `arr` の値が `[8, 3, 15, 6, 2, 11]` であるとき、次の擬似言語を実行して最大値と最小値の差を求める。\n\n' +
      '```\n(1) max ← arr[0]\n(2) min ← arr[0]\n(3) i ← 1\n(4) iが6未満の間、(5)〜(7)を繰り返す\n(5)   もしarr[i] > maxならば max ← arr[i]\n(6)   もしarr[i] < minならば min ← arr[i]\n(7)   i ← i + 1\n(8) range ← max - min\n```\n\n' +
      '実行終了時の `range` の値はどれか。',
    choices: [
      { id: '1', text: '9' },
      { id: '2', text: '11' },
      { id: '3', text: '13' },
      { id: '4', text: '15' },
    ],
    answerId: '3',
    explanation: '最大値は15、最小値は2であるため、range = 15 - 2 = 13となる。',
    trace: {
      sourceLines: [
        'max ← arr[0]',
        'min ← arr[0]',
        'i ← 1',
        'iが6未満の間、繰り返す',
        '  もしarr[i] > maxならば max ← arr[i]',
        '  もしarr[i] < minならば min ← arr[i]',
        '  i ← i + 1',
        'range ← max - min',
      ],
      initialVars: { arr: [8, 3, 15, 6, 2, 11] },
      program: [
        assign(1, 'max', idx('arr', n(0))),
        assign(2, 'min', idx('arr', n(0))),
        assign(3, 'i', n(1)),
        whileStmt(4, lt(v('i'), n(6)), [
          ifStmt(5, gt(idx('arr', v('i')), v('max')), [assign(5, 'max', idx('arr', v('i')))]),
          ifStmt(6, lt(idx('arr', v('i')), v('min')), [assign(6, 'min', idx('arr', v('i')))]),
          assign(7, 'i', add(v('i'), n(1))),
        ]),
        assign(8, 'range', sub(v('max'), v('min'))),
      ],
    },
  },
  {
    id: 'B-PSE-017',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '成績の判定（多分岐）',
    body:
      '`score` の値が `72` であるとき、次の擬似言語を実行して成績（grade）を判定し出力する。\n\n' +
      '```\n(1) もしscore ≥ 90ならば grade ← "A"\n(2) そうでなくscore ≥ 70ならば grade ← "B"\n(3) そうでなくscore ≥ 50ならば grade ← "C"\n(4) そうでなければ grade ← "D"\n(5) gradeを出力する\n```\n\n' +
      '実行結果として出力される `grade` の値はどれか。',
    choices: [
      { id: '1', text: '"A"' },
      { id: '2', text: '"B"' },
      { id: '3', text: '"C"' },
      { id: '4', text: '"D"' },
    ],
    answerId: '2',
    explanation:
      'scoreは72であり、90以上ではないが70以上であるため、2番目の条件に該当しgrade ← "B"となる。多分岐は上から順に条件を評価し、最初に真となった分岐のみが実行される。',
    trace: {
      sourceLines: [
        'もしscore ≥ 90ならば grade ← "A"',
        'そうでなくscore ≥ 70ならば grade ← "B"',
        'そうでなくscore ≥ 50ならば grade ← "C"',
        'そうでなければ grade ← "D"',
        'gradeを出力する',
      ],
      initialVars: { score: 72 },
      program: [
        ifStmt(
          1,
          gte(v('score'), n(90)),
          [assign(1, 'grade', str('A'))],
          [
            ifStmt(
              2,
              gte(v('score'), n(70)),
              [assign(2, 'grade', str('B'))],
              [
                ifStmt(3, gte(v('score'), n(50)), [assign(3, 'grade', str('C'))], [
                  assign(4, 'grade', str('D')),
                ]),
              ],
            ),
          ],
        ),
        output(5, v('grade')),
      ],
    },
  },
  {
    id: 'B-PSE-018',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '各桁の数字の合計',
    body:
      '`num` の値が `549` であるとき、次の擬似言語を実行して各桁の数字の合計を求める。\n\n' +
      '```\n(1) sum ← 0\n(2) numが0より大きい間、(3)〜(5)を繰り返す\n(3)   digit ← num mod 10\n(4)   sum ← sum + digit\n(5)   num ← num ÷ 10\n```\n\n' +
      '実行終了時の `sum` の値はどれか。',
    choices: [
      { id: '1', text: '9' },
      { id: '2', text: '13' },
      { id: '3', text: '18' },
      { id: '4', text: '549' },
    ],
    answerId: '3',
    explanation:
      '549を10で割った余り(9)を取り出してsumに加え、numを549÷10=54に更新する処理を繰り返す。5+4+9=18が各桁の合計となる。',
    trace: {
      sourceLines: [
        'sum ← 0',
        'numが0より大きい間、繰り返す',
        '  digit ← num mod 10',
        '  sum ← sum + digit',
        '  num ← num ÷ 10',
      ],
      initialVars: { num: 549 },
      program: [
        assign(1, 'sum', n(0)),
        whileStmt(2, gt(v('num'), n(0)), [
          assign(3, 'digit', mod(v('num'), n(10))),
          assign(4, 'sum', add(v('sum'), v('digit'))),
          assign(5, 'num', div(v('num'), n(10))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-019',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '隣接要素間の差の最大値',
    body:
      '配列 `arr` の値が `[4, 9, 3, 15, 15, 2]` であるとき、次の擬似言語を実行して隣接要素間の差（後の要素 - 前の要素）の最大値を求める。\n\n' +
      '```\n(1) maxDiff ← -9999\n(2) i ← 0\n(3) iが5未満の間、(4)〜(6)を繰り返す\n(4)   diff ← arr[i+1] - arr[i]\n(5)   もしdiff > maxDiffならば maxDiff ← diff\n(6)   i ← i + 1\n```\n\n' +
      '実行終了時の `maxDiff` の値はどれか。',
    choices: [
      { id: '1', text: '0' },
      { id: '2', text: '5' },
      { id: '3', text: '12' },
      { id: '4', text: '-13' },
    ],
    answerId: '3',
    explanation:
      '隣接差は 9-4=5, 3-9=-6, 15-3=12, 15-15=0, 2-15=-13 と計算され、この中の最大値は12（arr[2]からarr[3]への変化）である。',
    trace: {
      sourceLines: [
        'maxDiff ← -9999',
        'i ← 0',
        'iが5未満の間、繰り返す',
        '  diff ← arr[i+1] - arr[i]',
        '  もしdiff > maxDiffならば maxDiff ← diff',
        '  i ← i + 1',
      ],
      initialVars: { arr: [4, 9, 3, 15, 15, 2] },
      program: [
        assign(1, 'maxDiff', n(-9999)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(5)), [
          assign(4, 'diff', sub(idx('arr', add(v('i'), n(1))), idx('arr', v('i')))),
          ifStmt(5, gt(v('diff'), v('maxDiff')), [assign(5, 'maxDiff', v('diff'))]),
          assign(6, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-PSE-020',
    subject: 'B',
    category: 'pseudocode',
    difficulty: 2,
    title: '範囲内の要素数を数える',
    body:
      '配列 `arr` の値が `[5, 12, 18, 25, 20, 9, 15]` であるとき、次の擬似言語を実行して10以上20以下の範囲に入る要素の個数を数える。\n\n' +
      '```\n(1) count ← 0\n(2) i ← 0\n(3) iが7未満の間、(4)〜(5)を繰り返す\n(4)   もしarr[i] ≥ 10 かつ arr[i] ≤ 20ならば count ← count + 1\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `count` の値はどれか。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '3' },
      { id: '3', text: '4' },
      { id: '4', text: '7' },
    ],
    answerId: '3',
    explanation: '10以上20以下の範囲に入るのは12, 18, 20, 15の4個であるため、countは4になる。',
    trace: {
      sourceLines: [
        'count ← 0',
        'i ← 0',
        'iが7未満の間、繰り返す',
        '  もしarr[i] ≥ 10 かつ arr[i] ≤ 20ならば count ← count + 1',
        '  i ← i + 1',
      ],
      initialVars: { arr: [5, 12, 18, 25, 20, 9, 15] },
      program: [
        assign(1, 'count', n(0)),
        assign(2, 'i', n(0)),
        whileStmt(3, lt(v('i'), n(7)), [
          ifStmt(4, and(gte(idx('arr', v('i')), n(10)), lte(idx('arr', v('i')), n(20))), [
            assign(4, 'count', add(v('count'), n(1))),
          ]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
];
