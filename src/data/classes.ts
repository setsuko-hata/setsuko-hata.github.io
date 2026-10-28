/** Content for the クラス page (ja/offerings): plans, prices and class descriptions.
 *  Shared by the 大阪 / 東京 / オンライン tabs, so a price change is a one-line edit here. */

export type City = 'osaka' | 'tokyo';

/** Venues, listed under ご案内 (not in each city tab). */
export const VENUES = [
  {
    city: 'osaka', area: '大阪', name: '大阪市教育会館', note: '木・土 3回対面クラス',
    lines: ['〒540-0006 大阪市中央区法円坂1-1-35 アネックスパル法円坂'],
    access: '',
    map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('大阪市教育会館 大阪市中央区法円坂1-1-35'),
  },
  {
    city: 'osaka', area: '大阪', name: 'カタリーナホール玉造 3階', note: '',
    lines: ['〒543-0014 大阪府大阪市天王寺区玉造元町3-1'],
    access: 'JR大阪環状線 玉造駅 北口改札より徒歩すぐ（「風の街」の向かい）／大阪メトロ長堀鶴見緑地線 玉造駅 徒歩すぐ',
    map: 'https://maps.app.goo.gl/C5dNBBsZLQXG3ihE8',
  },
  {
    city: 'tokyo', area: '東京', name: '東京都港区三田5丁目1-2-301', note: '',
    lines: [] as string[],
    access: '麻布十番駅・白金高輪駅より徒歩約10分／三田駅・田町駅より徒歩約10分',
    map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('東京都港区三田5丁目1-2'),
  },
];

/** SATORIN: the three "included" cards (same content as the SATORIN promotion page). */
export const SATORIN_MORNING = {
  practices: ['全身を使うヨガ（ヨガ・ナマスカール）', '腕を整えるヨガ', '首を整えるヨガ', '音のヨガ（ナーダヨガ）', '呼吸法', 'ミラクル瞑想（Miracle of Mind）'],
  schedule: [
    { time: '6:00〜6:40', what: 'インボケーション・朝ヨガ／各自のスーリヤ・クリヤ' },
    { time: '6:40〜7:00', what: '呼吸法・ミラクル瞑想（Miracle of Mind）' },
  ],
};

export const SATORIN_EVENING = [
  { name: '健康セミナー', when: '毎週月曜日　19:30〜20:10', text: 'ヨガ科学に基づき、心と身体をより健康に保つための方法を実践的に学びます。食生活や日常の過ごし方を見直し、その週から暮らしに取り入れられる、シンプルで実用的なヒントをお伝えします。' },
  { name: '瞑想', when: '毎週月曜日　20:20〜21:00', text: '呼吸法と、Sadhguru によってつくられた瞑想を仲間と一緒に実践します。忙しい一日の終わりに、外側へ向いていた意識を自分の内側へ戻し、静かに自分自身とつながる時間です。' },
  { name: 'コミュニティ交流会', when: '月1回', text: '毎月一つのテーマを持ち、その月に実践したこと、身体や心に感じた変化、難しかったこと、次の一か月で育てたいことを仲間と分かち合います。' },
];

export const SATORIN_COACHING_RATES = [
  { label: '通常・単発（60分）', price: '12,000' },
  { label: 'パーソナルプラン（月1回）1回あたり', price: '9,000' },
  { label: 'プレミアムプラン（月3回）1回あたり', price: '8,000' },
];

/** SATORIN plans, monthly, 税込. Each books its own STORES product. */
const STORES = 'https://setsuko-hata-yoga.stores.jp/reserve/honten-kf004n/products/';
export const SATORIN_PLANS = [
  { no: '01', name: '目覚め', type: '朝ヨガプラン', tagline: '毎朝の実践を、人生の土台に。', price: '6,000', morning: true, evening: false, coaching: null, pick: false,
    features: ['朝ヨガ：月20回・受け放題', '月1回 コミュニティ交流会'], url: `${STORES}151433` },
  { no: '02', name: '安らぎ', type: 'ナイトプラン', tagline: '一日の終わりに、心がほどける夜を。', price: '6,000', morning: false, evening: true, coaching: null, pick: false,
    features: ['健康セミナー：月4回', '瞑想：月4回', '月1回 コミュニティ交流会'], url: `${STORES}363296` },
  { no: '03', name: '整う', type: 'ヨガ＆瞑想プラン', tagline: '実践・学び・瞑想を、一つのリズムに。', price: '12,000', morning: true, evening: true, coaching: null, pick: true,
    features: ['朝ヨガ：月20回・受け放題', '健康セミナー：月4回', '瞑想：月4回', '月1回 コミュニティ交流会'], url: `${STORES}229802` },
  { no: '04', name: '花ひらく', type: 'パーソナルプラン', tagline: '個別の対話から、あなたらしい変化を。', price: '21,000', morning: true, evening: true, coaching: '月1回', pick: false,
    features: ['整うプランのすべて', '1:1 コーチング：月1回（60分）'], url: `${STORES}430979` },
  { no: '05', name: '輝く', type: 'プレミアムプラン', tagline: '細やかな伴走で、変化を加速する。', price: '36,000', morning: true, evening: true, coaching: '月3回', pick: false,
    features: ['整うプランのすべて', '1:1 コーチング：月3回（60分）'], url: `${STORES}541723` },
];

/** Osaka monthly membership (in person). */
export const OSAKA_PLANS = [
  { no: '①', name: '対面のみ', price: '7,000', online: null },
  { no: '②', name: '対面＋オンライン2回', price: '10,000', online: '月2回' },
  { no: '③', name: '対面＋オンライン4回', price: '13,000', online: '月4回' },
];

/** In-person drop-in rate (1回・約75分), Osaka and Tokyo. */
export const IN_PERSON_RATES = [
  { format: 'グループ対面', price: '4,000' },
];

/** Osaka in-person 3-session course (Upa Yoga Parts 1–3). */
export const OSAKA_COURSE = {
  title: '本格ハタヨガ 3回コース',
  subtitle: '11月・3月 特別開催',
  heading: '木曜日・土曜日クラス｜初心者歓迎',
  description: [
    'インドの伝統に基づく本格的なハタヨガを、3回のコースでじっくり体験してみませんか？',
    '初心者の方でも無理なく取り組める「ウパヨガ（Upa Yoga）」を段階的に学び、身体の柔軟性を高めながら、呼吸とエネルギーのバランスを整えていきます。',
  ],
  tagline: '一度学べば、一生自分でできるヨガ。',
  quote: 'ヨガが初めての方、身体の硬い方、ご年配の方も大歓迎！',
  closing: 'ヨガを、特別な時間から日常の習慣へ。',
  forWhom: [
    '肩こりや首・背中のこわばりが気になる方',
    '疲れやすく、日々の活力を高めたい方',
    'ストレスや不安を和らげたい方',
    '睡眠の質を向上したい方',
    '慢性的な不調を緩和したい方',
    '自律神経・ホルモンバランスを整えたい方',
  ],
  // TODO(Setsuko): the one-line focus of each session is placeholder copy.
  sessions: [
    { no: 1, name: 'Part 1', focus: '関節をほぐし、身体の緊張を解く' },
    { no: 2, name: 'Part 2', focus: '呼吸を深め、背骨をしなやかに' },
    { no: 3, name: 'Part 3', focus: 'エネルギーを巡らせ、日常の実践へ' },
  ],
  sessionsNote: '3回を通して、身体と呼吸への意識を深め、ご自宅でも継続できるヨガの実践を身につけていきます。',
  venue: '大阪市教育会館',
  address: '〒540-0006 大阪市中央区法円坂1-1-35 アネックスパル法円坂',
  map: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('大阪市教育会館 大阪市中央区法円坂1-1-35'),
  payment: '当日現金及びPayPay',
  schedule: [
    { month: '11月', courses: [
      { day: '木', time: '14:00〜16:00', dates: ['5日', '12日', '19日'] },
      { day: '土', time: '10:00〜12:00', dates: ['7日', '14日', '21日'] },
    ] },
    { month: '3月', courses: [
      { day: '木', time: '10:00〜12:00', dates: ['4日', '11日', '18日'] },
      { day: '土', time: '10:00〜12:00', dates: ['6日', '13日', '20日'] },
    ] },
  ],
  scheduleNote: ['木曜日・土曜日の振替受講が可能です。', 'ご都合が合わない日程がある場合は、事前にご相談いただければ、別の曜日への振替も可能です。'],
  /** ご参加について: what to bring and wear, who it suits, food. */
  notes: [
    { label: '持ち物', text: 'ヨガマットまたはバスタオルをご持参ください', key: true },
    { label: '服装', text: '動きやすい服装でご参加ください' },
    { label: '対象', text: '初めての方から経験者まで歓迎いたします' },
    { label: 'お食事', text: '空腹の状態でご参加ください（お食事後は2時間半以上空けてください）' },
  ],
  /** Price options; `recommended` marks the highlighted one. */
  prices: [
    { name: '全3回', amount: '10,000', unit: '円（税込）', note: '3回通して段階的に学べます', recommended: true },
    { name: '単発', amount: '4,000', unit: '円（税込）', note: 'ご都合のよい回だけ参加できます', recommended: false },
  ],
};

/** Osaka regular (drop-in) in-person classes: ヨガ and 瞑想, about 75 minutes. */
export const REGULAR_CLASS = {
  title: '通常クラス',
  description: '大阪のスタジオで開催する対面クラスです。同じ空間で呼吸を合わせ、その場で姿勢や身体の使い方を直接お伝えできるのが対面の大きな魅力です。ヨガクラスと瞑想クラスを、1回から単発でご参加いただけます。',
  classes: [
    { name: 'ヨガクラス', tagline: '身体を整え、軽やかな毎日へ', dialog: 'dlg-yoga' },
    { name: '瞑想クラス', tagline: '意識を内側へ。心に静けさを。', dialog: 'dlg-meditation' },
  ],
  forWhom: [
    '身体の疲れやこわばりを感じている方',
    '運動不足を感じている方',
    '直接指導を受けながら学びたい方',
    'ヨガや瞑想を初めて体験する方',
    '大阪で通えるクラスを探している方',
  ],
  venue: 'カタリーナホール玉造',
  map: 'https://maps.app.goo.gl/C5dNBBsZLQXG3ihE8',
  duration: '約75分',
};

export const SURYA_BENEFITS = [
  '筋力・柔軟性・持久力の向上',
  '体力と生命エネルギー（活力）の向上',
  '代謝を活性化し、健康を促進',
  'ホルモンバランスをサポートする',
  '深い集中力と精神的な安定を育む',
  'ストレスや不安を和らげ、心身の調和をもたらす',
  '瞑想をより深いレベルへ導く',
];

/** One description per class, shared by every tab (opened as a popup). */
export const CLASS_DIALOGS = [
  {
    id: 'dlg-yoga',
    title: 'ヨガクラス',
    tagline: '身体を整え、軽やかな毎日へ',
    body: [
      'ヨガが初めての方にも取り組みやすい、シンプルでありながらパワフルな実践です。関節・筋肉・エネルギーシステムに働きかけ、身体をやさしく活性化。日々の疲れやこわばりをほぐし、より軽やかで快適な状態へと導いていきます。',
      '難しいポーズに挑戦するのではなく、身体の動き、呼吸、内側の感覚へ意識を向けていきます。対面ではお一人おひとりの身体を見ながら姿勢や動きを丁寧にお伝えし、オンラインではご自宅のマット一枚分のスペースで、ご自身のペースで進めていけます。',
    ],
    listTitle: 'こんな方におすすめ',
    list: ['身体の疲れやこわばりを感じている方', '運動不足を感じている方', 'ヨガを初めて体験する方', '日常に無理なくヨガを取り入れたい方'],
    times: [
      { label: 'オンライン（SATORIN 朝ヨガ）', value: '月〜金 6:00〜7:00' },
      { label: '対面', value: '約75分' },
    ],
  },
  {
    id: 'dlg-meditation',
    title: '瞑想',
    tagline: '意識を内側へ。心に静けさを。',
    body: [
      'サドグルによるさまざまなガイド瞑想を、その日のテーマに合わせて一緒に実践します。普段は仕事や人間関係、情報など外側へ向いている意識を、自分自身の内側へ向け、身体・心・感情との向き合い方を見つめていきます。',
      '瞑想が初めての方も、ガイドに沿って安心してご参加いただけます。',
    ],
    listTitle: 'テーマ例',
    list: ['心を穏やかにする瞑想', '自分自身と深くつながる瞑想', '理想の人生や未来へ意識を向ける瞑想', '自然とのつながりを感じる瞑想'],
    times: [
      { label: 'オンライン（夜の瞑想会）', value: '毎週月曜 20:20〜21:00' },
      { label: '対面', value: '約75分' },
    ],
  },
  {
    id: 'dlg-seminar',
    title: '健康セミナー',
    tagline: 'ヨガ科学に基づき、日常そのものを意識的に。',
    body: [
      '健康とは、運動することや食事に気をつけることだけではありません。どう食べ、どう眠り、どう呼吸し、どう身体を使い、どのような意識で毎日を過ごすか。ヨガの科学には、日常をより意識的に生きるための智慧があります。',
      '知識を学ぶだけではなく、「今日から自分の生活で何ができるか」を大切にした、取り入れやすいセミナーです。',
    ],
    listTitle: 'テーマ例',
    list: ['食事とエネルギー', '睡眠の質を整える', '呼吸と心の状態', '自然のサイクルと生活リズム'],
    times: [{ label: 'オンラインのみ', value: '毎週月曜 19:30〜20:10' }],
  },
];
