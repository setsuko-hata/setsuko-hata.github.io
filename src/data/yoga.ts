/** Single source of truth for the /hatha-yoga/ section: URLs, navigation and footer. */

export type Locale = 'ja' | 'en';

export const YOGA_BASE = '/hatha-yoga';

export const BOOKING_FORM_URL =
  'https://docs.google.com/forms/d/1rKoOxcGQyew2a_d341eduWZ4QuhbK7R3YloP14Z6s8w/viewform';

export const CONTACT_EMAIL = 'yoga@setsukohata.com';

/** Absolute, trailing-slash URL of a page in the section ('' = locale home). */
export const yogaHref = (locale: Locale, page = '', hash = '') =>
  `${YOGA_BASE}/${locale}/${page ? `${page}/` : ''}${hash ? `#${hash}` : ''}`;

export interface NavItem {
  id: string;
  label: string;
  href: string;
  /** Dropdown entries; when present the item renders as a menu button. */
  items?: { id?: string; label: string; href: string }[];
}

const ja = (page = '', hash = '') => yogaHref('ja', page, hash);
const en = (page = '', hash = '') => yogaHref('en', page, hash);

export const NAV: Record<Locale, NavItem[]> = {
  ja: [
    { id: 'home', label: 'ホーム', href: ja() },
    { id: 'about', label: '秦 節子｜SETSUKO HATA', href: ja('about') },
    {
      id: 'hatha',
      label: 'ハタヨガ',
      href: ja('hatha-yoga'),
      items: [
        { id: 'hatha-yoga', label: 'ハタヨガとは', href: ja('hatha-yoga') },
        { id: 'hatha-types', label: 'ハタヨガの種類', href: ja('hatha-types') },
      ],
    },
    {
      id: 'classes',
      label: 'クラス',
      href: ja('offerings'),
      items: [
        { label: '初めての方へ', href: ja('offerings', 'trial') },
        { label: '対面クラス', href: ja('offerings', 'inperson') },
        { label: 'オンラインクラス', href: ja('offerings', 'online-class') },
        { label: '特別プログラム', href: ja('offerings', 'special') },
        { label: 'クラス価格', href: ja('offerings', 'pricing') },
      ],
    },
    {
      id: 'corporate',
      label: '法人・団体向け',
      href: ja('wellness'),
      items: [{ label: '企業・健康経営', href: ja('wellness') }],
    },
    {
      id: 'schools',
      label: '学校・教育機関向け',
      href: ja('schools'),
      items: [
        { label: '小学校', href: ja('schools', 'stage-es') },
        { label: '中学校', href: ja('schools', 'stage-jhs') },
        { label: '高校', href: ja('schools', 'stage-hs') },
        { label: '大学', href: ja('schools', 'stage-uni') },
      ],
    },
    { id: 'contact', label: 'お問い合わせ', href: ja('contact') },
  ],
  en: [
    { id: 'home', label: 'Home', href: en() },
    { id: 'about', label: 'About', href: en('about') },
    { id: 'offerings', label: 'Offerings', href: en('offerings') },
    { id: 'membership', label: 'Membership', href: en('membership') },
    { id: 'contact', label: 'Contact', href: en('contact') },
  ],
};

export const FOOTER = {
  ja: {
    tagline: '本格的なハタヨガを、日常へ。',
    siteHeading: 'サイトマップ',
    contactHeading: 'お問い合わせ',
    links: [
      { label: 'ホーム', href: ja() },
      { label: '秦 節子｜SETSUKO HATA', href: ja('about') },
      { label: 'ハタヨガとは', href: ja('hatha-yoga') },
      { label: 'ハタヨガの種類', href: ja('hatha-types') },
      { label: 'クラス・月額会員', href: ja('offerings') },
      { label: 'ご参加の準備', href: ja('prepare') },
      { label: '企業・健康経営', href: ja('wellness') },
      { label: '学校・教育機関', href: ja('schools') },
      { label: 'お問い合わせ', href: ja('contact') },
    ],
    contactName: '秦 節子',
    contactEmail: CONTACT_EMAIL,
    rights: 'All rights reserved.',
    places: '',
  },
  en: {
    tagline: 'Authentic Hatha Yoga, for everyday life.',
    siteHeading: 'Site',
    contactHeading: 'Contact',
    links: [
      { label: 'Home', href: en() },
      { label: 'About', href: en('about') },
      { label: 'Offerings', href: en('offerings') },
      { label: 'Membership', href: en('membership') },
      { label: 'Contact', href: en('contact') },
    ],
    contactName: 'Osaka, Japan',
    contactEmail: '',
    rights: 'All rights reserved.',
    places: 'Tokyo · Osaka · India',
  },
} as const;
