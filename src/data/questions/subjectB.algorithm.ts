import type { Question } from '@/types/question';
import {
  add,
  and,
  assign,
  assignAt,
  bool,
  div,
  eq,
  forTo,
  gt,
  idx,
  ifStmt,
  len,
  lt,
  lte,
  mod,
  mul,
  n,
  neq,
  sub,
  v,
  whileStmt,
} from '@/lib/pseudocode/dsl';

export const algorithmQuestions: Question[] = [
  {
    id: 'B-ALG-001',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: '選択ソート',
    body:
      '配列 `arr` の値が `[5, 2, 4, 1, 3]` であるとき、次の擬似言語（選択ソート）を実行する。\n\n' +
      '```\n(1) iを0から3まで1ずつ増やしながら、(2)〜(6)を実行する\n(2)   minIdx ← i\n(3)   jをi+1から4まで1ずつ増やしながら、arr[j] < arr[minIdx]ならばminIdx ← jとする\n(4)   もしminIdx ≠ iならば\n(5)     temp←arr[i]、arr[i]←arr[minIdx]、arr[minIdx]←temp\n```\n\n' +
      'ステップ実行では1回の外側ループ（1パス）ごとに配列の状態が表示される。実行終了時の配列 `arr` はどれか。',
    choices: [
      { id: '1', text: '[1, 2, 3, 4, 5]' },
      { id: '2', text: '[1, 2, 4, 5, 3]' },
      { id: '3', text: '[5, 2, 4, 1, 3]' },
      { id: '4', text: '[2, 1, 4, 3, 5]' },
    ],
    answerId: '1',
    explanation:
      '選択ソートは各パスで未処理範囲の最小値を探し、先頭と交換する処理を繰り返す。4パスの実行後、配列は昇順の[1,2,3,4,5]にソートされる。',
    trace: {
      sourceLines: [
        'iを0から3まで1ずつ増やしながら、繰り返す',
        '  minIdx ← i',
        '  jをi+1から4まで1ずつ増やしながら、arr[j] < arr[minIdx]ならばminIdx ← j',
        '  もしminIdx ≠ iならば',
        '    temp←arr[i]、arr[i]←arr[minIdx]、arr[minIdx]←temp',
      ],
      initialVars: { arr: [5, 2, 4, 1, 3] },
      program: [
        forTo(1, 'i', n(0), n(3), [
          assign(2, 'minIdx', v('i')),
          forTo(3, 'j', add(v('i'), n(1)), n(4), [
            ifStmt(3, lt(idx('arr', v('j')), idx('arr', v('minIdx'))), [assign(3, 'minIdx', v('j'))]),
          ]),
          ifStmt(4, neq(v('minIdx'), v('i')), [
            assign(5, 'temp', idx('arr', v('i'))),
            assignAt(5, 'arr', v('i'), idx('arr', v('minIdx'))),
            assignAt(5, 'arr', v('minIdx'), v('temp')),
          ]),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-002',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: 'バブルソート',
    body:
      '配列 `arr` の値が `[5, 1, 4, 2, 8]` であるとき、次の擬似言語（バブルソート）を実行する。\n\n' +
      '```\n(1) iを0から3まで1ずつ増やしながら、(2)〜(4)を実行する\n(2)   jを0から3まで1ずつ増やしながら、(3)〜(4)を実行する\n(3)     もしarr[j] > arr[j+1]ならば\n(4)       arr[j]とarr[j+1]を交換する\n```\n\n' +
      'ステップ実行では1回の外側ループ（1パス）ごとに配列の状態が表示される。実行終了時の配列 `arr` はどれか。',
    choices: [
      { id: '1', text: '[1, 2, 4, 5, 8]' },
      { id: '2', text: '[5, 1, 4, 2, 8]' },
      { id: '3', text: '[8, 5, 4, 2, 1]' },
      { id: '4', text: '[1, 4, 2, 5, 8]' },
    ],
    answerId: '1',
    explanation:
      'バブルソートは隣接する要素を比較し、逆順であれば交換することを繰り返して整列する。4パスの実行後、配列は昇順の[1,2,4,5,8]にソートされる。',
    trace: {
      sourceLines: [
        'iを0から3まで1ずつ増やしながら、繰り返す',
        '  jを0から3まで1ずつ増やしながら、繰り返す',
        '    もしarr[j] > arr[j+1]ならば',
        '      arr[j]とarr[j+1]を交換する',
      ],
      initialVars: { arr: [5, 1, 4, 2, 8] },
      program: [
        forTo(1, 'i', n(0), n(3), [
          forTo(2, 'j', n(0), n(3), [
            ifStmt(3, gt(idx('arr', v('j')), idx('arr', add(v('j'), n(1)))), [
              assign(4, 'temp', idx('arr', v('j'))),
              assignAt(4, 'arr', v('j'), idx('arr', add(v('j'), n(1)))),
              assignAt(4, 'arr', add(v('j'), n(1)), v('temp')),
            ]),
          ]),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-003',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: '二分探索',
    body:
      '昇順に整列された配列 `arr` の値が `[3, 8, 15, 20, 27, 34, 40]`、探索対象 `target` が `27` であるとき、次の擬似言語（二分探索）を実行する。\n\n' +
      '```\n(1) low ← 0\n(2) high ← 6\n(3) found ← -1\n(4) lowがhigh以下 かつ foundが-1である間、(5)〜(8)を繰り返す\n(5)   mid ← (low + high) ÷ 2\n(6)   もしarr[mid] = targetならば found ← mid\n(7)   そうでなくarr[mid] < targetならば low ← mid + 1\n(8)   そうでなければ high ← mid - 1\n```\n\n' +
      'ステップ実行で `low`, `high`, `mid` の変化を確認し、実行終了時の `found`（targetのインデックス）の値を求めよ。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '3' },
      { id: '3', text: '4' },
      { id: '4', text: '5' },
    ],
    answerId: '3',
    explanation:
      '1回目: mid=3, arr[3]=20<27よりlow=4。2回目: mid=5, arr[5]=34>27よりhigh=4。3回目: mid=4, arr[4]=27=targetよりfound=4。二分探索により3回の比較で発見できる。',
    trace: {
      sourceLines: [
        'low ← 0',
        'high ← 6',
        'found ← -1',
        'lowがhigh以下 かつ foundが-1である間、繰り返す',
        '  mid ← (low + high) ÷ 2',
        '  もしarr[mid] = targetならば found ← mid',
        '  そうでなくarr[mid] < targetならば low ← mid + 1',
        '  そうでなければ high ← mid - 1',
      ],
      initialVars: { arr: [3, 8, 15, 20, 27, 34, 40], target: 27 },
      program: [
        assign(1, 'low', n(0)),
        assign(2, 'high', sub(len('arr'), n(1))),
        assign(3, 'found', n(-1)),
        whileStmt(4, and(lte(v('low'), v('high')), eq(v('found'), n(-1))), [
          assign(5, 'mid', div(add(v('low'), v('high')), n(2))),
          ifStmt(
            6,
            eq(idx('arr', v('mid')), v('target')),
            [assign(6, 'found', v('mid'))],
            [
              ifStmt(7, lt(idx('arr', v('mid')), v('target')), [assign(7, 'low', add(v('mid'), n(1)))], [
                assign(8, 'high', sub(v('mid'), n(1))),
              ]),
            ],
          ),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-004',
    subject: 'B',
    category: 'algorithm',
    difficulty: 3,
    title: '挿入ソート',
    body:
      '配列 `arr` の値が `[5, 2, 4, 1, 3]` であるとき、次の擬似言語（挿入ソート）を実行する。\n\n' +
      '```\n(1) iを1から4まで1ずつ増やしながら、(2)〜(6)を実行する\n(2)   key ← arr[i]\n(3)   j ← i - 1\n(4)   jが0以上 かつ arr[j] > keyである間、(5)を繰り返す\n(5)     arr[j+1] ← arr[j]、j ← j - 1\n(6)   arr[j+1] ← key\n```\n\n' +
      'ステップ実行では1回の外側ループ（keyを1つ挿入し終えた時点）ごとに配列の状態が表示される。実行終了時の配列 `arr` はどれか。',
    choices: [
      { id: '1', text: '[1, 2, 3, 4, 5]' },
      { id: '2', text: '[2, 5, 4, 1, 3]' },
      { id: '3', text: '[1, 2, 4, 5, 3]' },
      { id: '4', text: '[5, 2, 4, 1, 3]' },
    ],
    answerId: '1',
    explanation:
      '挿入ソートは未整列部分の先頭要素(key)を、整列済み部分の適切な位置に挿入する処理を繰り返す。4回の挿入後、配列は昇順の[1,2,3,4,5]にソートされる。',
    trace: {
      sourceLines: [
        'iを1から4まで1ずつ増やしながら、繰り返す',
        '  key ← arr[i]',
        '  j ← i - 1',
        '  jが0以上 かつ arr[j] > keyである間、繰り返す',
        '    arr[j+1] ← arr[j]、j ← j - 1',
        '  arr[j+1] ← key',
      ],
      initialVars: { arr: [5, 2, 4, 1, 3] },
      program: [
        forTo(1, 'i', n(1), n(4), [
          assign(2, 'key', idx('arr', v('i'))),
          assign(3, 'j', sub(v('i'), n(1))),
          whileStmt(4, and(lt(n(-1), v('j')), gt(idx('arr', v('j')), v('key'))), [
            assignAt(5, 'arr', add(v('j'), n(1)), idx('arr', v('j'))),
            assign(5, 'j', sub(v('j'), n(1))),
          ]),
          assignAt(6, 'arr', add(v('j'), n(1)), v('key')),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-005',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: 'ユークリッドの互除法',
    body:
      '`a = 48`、`b = 18` であるとき、次の擬似言語（ユークリッドの互除法）を実行して最大公約数を求める。\n\n' +
      '```\n(1) bが0でない間、(2)〜(4)を繰り返す\n(2)   r ← a mod b\n(3)   a ← b\n(4)   b ← r\n```\n\n' +
      '実行終了時の `a` の値（48と18の最大公約数）はどれか。',
    choices: [
      { id: '1', text: '2' },
      { id: '2', text: '3' },
      { id: '3', text: '6' },
      { id: '4', text: '9' },
    ],
    answerId: '3',
    explanation:
      '48 mod 18 = 12 → a=18, b=12。18 mod 12 = 6 → a=12, b=6。12 mod 6 = 0 → a=6, b=0。bが0になった時点のaが最大公約数であり、GCD(48,18)=6。',
    trace: {
      sourceLines: ['bが0でない間、繰り返す', '  r ← a mod b', '  a ← b', '  b ← r'],
      initialVars: { a: 48, b: 18 },
      program: [
        whileStmt(1, neq(v('b'), n(0)), [
          assign(2, 'r', mod(v('a'), v('b'))),
          assign(3, 'a', v('b')),
          assign(4, 'b', v('r')),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-006',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: '素数判定',
    body:
      '`n = 21` であるとき、次の擬似言語を実行して `n` が素数かどうかを判定する。\n\n' +
      '```\n(1) isPrime ← 真\n(2) i ← 2\n(3) iがn未満 かつ isPrimeが真である間、(4)〜(5)を繰り返す\n(4)   もしn mod i = 0ならば isPrime ← 偽\n(5)   i ← i + 1\n```\n\n' +
      '実行終了時の `isPrime` の値はどれか。',
    choices: [
      { id: '1', text: '真（素数である）' },
      { id: '2', text: '偽（素数ではない）' },
      { id: '3', text: 'エラーになる' },
      { id: '4', text: '判定できない' },
    ],
    answerId: '2',
    explanation:
      '21 = 3 × 7 であり、i=3のときn mod i = 21 mod 3 = 0となるためisPrimeは偽に更新される。したがって21は素数ではないと正しく判定される。',
    trace: {
      sourceLines: [
        'isPrime ← 真',
        'i ← 2',
        'iがn未満 かつ isPrimeが真である間、繰り返す',
        '  もしn mod i = 0ならば isPrime ← 偽',
        '  i ← i + 1',
      ],
      initialVars: { n: 21 },
      program: [
        assign(1, 'isPrime', bool(true)),
        assign(2, 'i', n(2)),
        whileStmt(3, and(lt(v('i'), v('n')), v('isPrime')), [
          ifStmt(4, eq(mod(v('n'), v('i')), n(0)), [assign(4, 'isPrime', bool(false))]),
          assign(5, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
  {
    id: 'B-ALG-007',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: 'スタックのPUSH/POP',
    body:
      '配列で実装したスタック `stack`（初期値はすべて0、容量5）と、次に積む位置を示す `top`（初期値0）がある。' +
      '次の操作を順に行う擬似言語を実行する。\n\n' +
      '```\n(1) stack[top] ← 5、top ← top + 1        // PUSH(5)\n(2) stack[top] ← 3、top ← top + 1        // PUSH(3)\n(3) top ← top - 1                        // POP()\n(4) stack[top] ← 8、top ← top + 1        // PUSH(8)\n(5) top ← top - 1                        // POP()\n(6) top ← top - 1                        // POP()\n```\n\n' +
      'PUSH(5)→PUSH(3)→POP()→PUSH(8)→POP()→POP() の順に実行したとき、最終的な `top` の値はどれか。',
    choices: [
      { id: '1', text: '0' },
      { id: '2', text: '1' },
      { id: '3', text: '2' },
      { id: '4', text: '3' },
    ],
    answerId: '1',
    explanation:
      '3回のPUSHと3回のPOPが行われるため、スタックは最終的に空になり、topは初期値と同じ0に戻る。',
    trace: {
      sourceLines: [
        'stack[top] ← 5、top ← top + 1  // PUSH(5)',
        'stack[top] ← 3、top ← top + 1  // PUSH(3)',
        'top ← top - 1  // POP()',
        'stack[top] ← 8、top ← top + 1  // PUSH(8)',
        'top ← top - 1  // POP()',
        'top ← top - 1  // POP()',
      ],
      initialVars: { stack: [0, 0, 0, 0, 0], top: 0 },
      program: [
        assignAt(1, 'stack', v('top'), n(5)),
        assign(1, 'top', add(v('top'), n(1))),
        assignAt(2, 'stack', v('top'), n(3)),
        assign(2, 'top', add(v('top'), n(1))),
        assign(3, 'top', sub(v('top'), n(1))),
        assignAt(4, 'stack', v('top'), n(8)),
        assign(4, 'top', add(v('top'), n(1))),
        assign(5, 'top', sub(v('top'), n(1))),
        assign(6, 'top', sub(v('top'), n(1))),
      ],
    },
  },
  {
    id: 'B-ALG-008',
    subject: 'B',
    category: 'algorithm',
    difficulty: 2,
    title: 'キューのENQUEUE/DEQUEUE',
    body:
      '配列で実装したキュー `queue`（初期値はすべて0）、先頭位置 `head`（初期値0）、末尾位置 `tail`（初期値0）がある。' +
      '次の操作を順に行う。\n\n' +
      '```\n(1) queue[tail] ← 10、tail ← tail + 1   // ENQUEUE(10)\n(2) queue[tail] ← 20、tail ← tail + 1   // ENQUEUE(20)\n(3) head ← head + 1                     // DEQUEUE()\n(4) queue[tail] ← 30、tail ← tail + 1   // ENQUEUE(30)\n(5) head ← head + 1                     // DEQUEUE()\n(6) remaining ← tail - head\n```\n\n' +
      'ENQUEUE(10)→ENQUEUE(20)→DEQUEUE()→ENQUEUE(30)→DEQUEUE() の順に実行したとき、キューに残っている要素数 `remaining` の値はどれか。',
    choices: [
      { id: '1', text: '0' },
      { id: '2', text: '1' },
      { id: '3', text: '2' },
      { id: '4', text: '3' },
    ],
    answerId: '2',
    explanation:
      'キューはFIFO（先入れ先出し）である。3回のENQUEUEと2回のDEQUEUEが行われるため、tail=3, head=2となり、残り要素数はtail-head=1（値30のみが残る）。',
    trace: {
      sourceLines: [
        'queue[tail] ← 10、tail ← tail + 1  // ENQUEUE(10)',
        'queue[tail] ← 20、tail ← tail + 1  // ENQUEUE(20)',
        'head ← head + 1  // DEQUEUE()',
        'queue[tail] ← 30、tail ← tail + 1  // ENQUEUE(30)',
        'head ← head + 1  // DEQUEUE()',
        'remaining ← tail - head',
      ],
      initialVars: { queue: [0, 0, 0, 0, 0], head: 0, tail: 0 },
      program: [
        assignAt(1, 'queue', v('tail'), n(10)),
        assign(1, 'tail', add(v('tail'), n(1))),
        assignAt(2, 'queue', v('tail'), n(20)),
        assign(2, 'tail', add(v('tail'), n(1))),
        assign(3, 'head', add(v('head'), n(1))),
        assignAt(4, 'queue', v('tail'), n(30)),
        assign(4, 'tail', add(v('tail'), n(1))),
        assign(5, 'head', add(v('head'), n(1))),
        assign(6, 'remaining', sub(v('tail'), v('head'))),
      ],
    },
  },
  {
    id: 'B-ALG-009',
    subject: 'B',
    category: 'algorithm',
    difficulty: 1,
    title: 'べき乗の計算',
    body:
      '`x = 3`、`n = 4` であるとき、次の擬似言語を実行して `x` の `n` 乗を反復計算で求める。\n\n' +
      '```\n(1) result ← 1\n(2) iを1からnまで1ずつ増やしながら、(3)を実行する\n(3)   result ← result × x\n```\n\n' +
      '実行終了時の `result` の値（3の4乗）はどれか。',
    choices: [
      { id: '1', text: '12' },
      { id: '2', text: '64' },
      { id: '3', text: '81' },
      { id: '4', text: '243' },
    ],
    answerId: '3',
    explanation: '3の4乗 = 3×3×3×3 = 81。ループのたびにresultにxを掛け合わせていく反復計算である。',
    trace: {
      sourceLines: ['result ← 1', 'iを1からnまで1ずつ増やしながら、繰り返す', '  result ← result × x'],
      initialVars: { x: 3, n: 4 },
      program: [
        assign(1, 'result', n(1)),
        forTo(2, 'i', n(1), v('n'), [assign(3, 'result', mul(v('result'), v('x')))]),
      ],
    },
  },
  {
    id: 'B-ALG-010',
    subject: 'B',
    category: 'algorithm',
    difficulty: 3,
    title: '2番目に大きい値',
    body:
      '配列 `arr` の値が `[7, 2, 9, 4, 5, 1]` であるとき、次の擬似言語を実行して1番目・2番目に大きい値を1回の走査で求める。\n\n' +
      '```\n(1) first ← arr[0]\n(2) second ← -9999\n(3) i ← 1\n(4) iが6未満の間、(5)〜(9)を繰り返す\n(5)   もしarr[i] > firstならば\n(6)     second ← first、first ← arr[i]\n(7)   そうでなくarr[i] > secondならば\n(8)     second ← arr[i]\n(9)   i ← i + 1\n```\n\n' +
      '実行終了時の `second`（2番目に大きい値）の値はどれか。',
    choices: [
      { id: '1', text: '9' },
      { id: '2', text: '7' },
      { id: '3', text: '5' },
      { id: '4', text: '4' },
    ],
    answerId: '2',
    explanation:
      '配列を大きい順に並べると9, 7, 5, 4, 2, 1であり、1番大きい値は9、2番目に大きい値は7である。1回の走査でfirstとsecondを同時に更新することで効率よく求められる。',
    trace: {
      sourceLines: [
        'first ← arr[0]',
        'second ← -9999',
        'i ← 1',
        'iが6未満の間、繰り返す',
        '  もしarr[i] > firstならば',
        '    second ← first、first ← arr[i]',
        '  そうでなくarr[i] > secondならば',
        '    second ← arr[i]',
        '  i ← i + 1',
      ],
      initialVars: { arr: [7, 2, 9, 4, 5, 1] },
      program: [
        assign(1, 'first', idx('arr', n(0))),
        assign(2, 'second', n(-9999)),
        assign(3, 'i', n(1)),
        whileStmt(4, lt(v('i'), n(6)), [
          ifStmt(
            5,
            gt(idx('arr', v('i')), v('first')),
            [assign(6, 'second', v('first')), assign(6, 'first', idx('arr', v('i')))],
            [ifStmt(7, gt(idx('arr', v('i')), v('second')), [assign(8, 'second', idx('arr', v('i')))])],
          ),
          assign(9, 'i', add(v('i'), n(1))),
        ]),
      ],
    },
  },
];
