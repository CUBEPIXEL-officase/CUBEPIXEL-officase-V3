import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'zh' | 'ja';

const translationMap: Record<string, string> = {
  // Navigation & General
  '團體介紹': 'グループ紹介',
  '小基地任務': 'スモールベースミッション',
  '公演活動': 'ライブ公演',
  '選擇你的推': '推しを選択',
  '社群連結': 'SNSリンク',
  '合作邀約': 'コラボ・お問い合わせ',
  '特別感謝': 'スペシャルサンクス',
  '尚未開放': '近日公開',
  '前夜傳：第一章': '前夜譚：第一章',
  '創團物語：第一章': '結成物語：第一章',
  '涼海璃': '涼海璃',
  '鈴未 藪': '鈴未 藪',
  '出禁名單': '出禁リスト',
  '返回主頁': 'ホームへ戻る',
  '返回分類': 'カテゴリーへ戻る',
  '周邊商品專區': 'グッズショップ',
  '店面最新資訊': '店舗最新情報',
  '社群預約功能': 'コミュニティ予約',
  '店鋪專用行事曆': '店舗カレンダー',
  '角色介紹': 'キャラクター紹介',
  '下載手機 App (PWA / APK)': 'アプリをダウンロード',
  '下載手機 App': 'アプリをダウンロード',

  // Buttons & Controls
  '換成日文': '日本語に切換',
  '換成中文': '中文に切換',
  '切換日文': '日本語',
  '切換中文': '中文',
  '日文': '日本語',
  '中文': '中文',
  'Game Start': 'Game Start',

  // Intro & Stories
  '夢開始的地方': '夢が始まる場所',
  '歡迎來到我們的官方小基地！': '公式スモールベースへようこそ！',
  '公演活動即將隆重推出！\n\n我們正全力籌備最精彩的舞台演出，這將是一場結合像素藝術、動感音樂與豐富互動的全新體驗。\n\n最新公演時間、售票資訊與現場限定活動詳情，皆會在此處即時更新，敬請所有迷你像素們拭目以待！':
    'ライブ公演が間もなく解禁！\n\n最高のステージをお届けするため全力で準備中です。ピクセルアート、音楽、インタラクティブ体験が融合した新しい世界をお楽しみに！\n\n最新の公演日程やチケット情報はこちらで随時更新いたします。',
  '特別感謝 團長 涼海璃 對幹程式碼一個月\n徒手造出紡塊像素的官方網站':
    'スペシャルサンクス 團長 涼海璃 コードと1ヶ月格闘し公式Webサイトをゼロから構築',

  // Sections & Categories
  '熱門商品專區': '人気商品エリア',
  '模型區(盒損)': 'フィギュア(箱傷み)',
  '模型區(拆擺)': 'フィギュア(開封展示)',
  '瑕疵特惠區': '訳ありアウトレット区',
  '文創小設計區(不補)': 'オリジナルデザイン区(再入荷なし)',
  '請選擇商品分類區域進入觀看商品': '商品カテゴリーを選択してご覧ください',
  '請點擊下方商品瀏覽詳情或門市預約': '商品をクリックして詳細確認または店舗予約',
  '門市專區': '店舗限定',
  '外盒輕微碰撞 / 高CP值': '外箱に軽微な傷み / コスパ抜群',
  '櫥櫃展示 / 高CP值': 'ショーケース展示品 / コスパ抜群',
  '瑕疵釋出 / 優惠特價': '訳あり放出品 / 特別割引',
  '原創設計 / 售完不補': 'オリジナルデザイン / 再入荷なし',
  '限量不補': '限定・再入荷なし',

  // Products
  '萬代 鬼滅之刃 一隻豬2P色': 'バンダイ 鬼滅の刃 嘴平伊之助 2Pカラー',
  '⚠️ 軟腳 已動正骨手術': '⚠️ 自立不可（骨格補正済み）',
  '萬代 一拳超人 地獄吹雪': 'バンダイ ワンパンマン 地獄のフブキ',
  '啊璃的袋袋小精靈紅包袋': 'アリスのぽち袋スモールスピリットお年玉袋',
  '數量：3個 (售完不補)': '在庫：3個（再入荷なし）',
  '剩 3 個': '残り 3個',
  '編號 01': 'No.01',
  '編號 02': 'No.02',
  '編號 03': 'No.03',
  '淺灰紫 01': '浅灰紫 01',

  // Info banners
  '⚠️ 【瑕疵特惠區】門市特別標示與特惠商品，商品狀況如備註標示，歡迎現場看貨。':
    '⚠️ 【訳ありアウトレット区】状態はメモに記載されています。店頭での確認も大歓迎です。',
  '📦 【模型區(盒損)】門市限定特惠商品，外盒可能有些微壓痕或碰撞痕跡，內部模型全新完好！':
    '📦 【フィギュア(箱傷み)】外箱に若干の圧迫や傷みがありますが、中のフィギュアは新品同様です！',
  '✨ 【模型區(拆擺)】門市展示品釋出，狀況良好，完美主義者歡迎至現場看貨確認。':
    '✨ 【フィギュア(開封展示)】店舗展示品の放出品です。状態良好。ぜひ店頭にてご確認ください。',
  '🧧 【文創小設計區(不補)】獨立原創設計週邊商品，限量發售、售完不再補貨。':
    '🧧 【オリジナルデザイン区】オリジナルデザイングッズ。数量限定、完売後の再入荷はありません。',

  // Izakaya info
  '紡塊像素官方小基地': '紡塊像素 公式スモールベース',
  '「酸欠像素偶像居酒屋」': '「酸欠ピクセルアイドル居酒屋」',
  '現正營業中': '絶賛営業中',
  '營業時間': '営業時間',
  '最新動態與特別活動': '最新ニュース＆特別イベント',
  '團員招募中': 'メンバー募集中',
  '聯繫酸欠像素居酒屋': '酸欠ピクセル居酒屋へのお問い合わせ',
  '地址: 福和路120號之2': '住所: 福和路120号之2',
  '電話: 02-8925-2329': '電話: 02-8925-2329',
  '其他合作邀約請聯繫': 'その他コラボ・お問い合わせ',
  '海璃海狸工作室電子郵件': '海璃海狸スタジオ Eメール',
  '或於平日早上9:00至晚上8:00': 'または平日 9:00〜20:00',
  '至海璃海狸工作室進行商談': '海璃海狸スタジオにてご相談ください',

  // Banned list
  '本區為店鋪安全與維護消費品質之記錄': '店舗の安全およびサービス品質維持のための記録です',
  '原因: ': '理由: ',

  // App Install
  '體驗更順暢的專屬 App': 'よりスムーズな専用アプリ体験を',
  '安裝 App': 'アプリをインストール',

  // Footer credits
  '紡塊像素CubePixel_2026 感謝團長涼海璃製作 《QPKS-VER3.0.0》':
    '紡塊像素CubePixel_2026 團長涼海璃に感謝 《QPKS-VER3.0.0》',
  '紡塊像素CubePixel_2026 感謝團長涼海璃 大半夜不睡覺還在更新官網 《QPKS-VER3.0.0》':
    '紡塊像素CubePixel_2026 團長涼海璃が深夜までサイトを更新中 《QPKS-VER3.0.0》',
};

interface LanguageContextType {
  lang: Language;
  toggleLanguage: () => void;
  setLanguage: (lang: Language) => void;
  t: (zhText: string, jaText?: string) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: 'zh',
  toggleLanguage: () => {},
  setLanguage: () => {},
  t: (zhText) => zhText,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('qpks_lang') as Language) || 'zh';
    }
    return 'zh';
  });

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'ja' : 'zh';
      if (typeof window !== 'undefined') {
        localStorage.setItem('qpks_lang', next);
      }
      return next;
    });
  };

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('qpks_lang', newLang);
    }
  };

  const t = (zhText: string, jaText?: string): string => {
    if (lang === 'ja') {
      if (jaText) return jaText;
      if (translationMap[zhText]) return translationMap[zhText];
    }
    return zhText;
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
