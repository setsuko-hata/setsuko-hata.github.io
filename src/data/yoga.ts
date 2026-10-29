/** Single source of truth for the /hatha-yoga/ section: URLs, navigation and footer. */

export type Locale = 'ja' | 'en';

export const YOGA_BASE = '/hatha-yoga';

export const BOOKING_FORM_URL =
  'https://docs.google.com/forms/d/1rKoOxcGQyew2a_d341eduWZ4QuhbK7R3YloP14Z6s8w/viewform';

/** SATORIN online membership: plans are booked (and cancelled) on STORES. */
export const SATORIN_BOOKING_URL = 'https://setsuko-hata-yoga.stores.jp/reserve/honten-kf004n/products';

export const SATORIN_PAGE_URL = '/satorin/';

/** オンライン単発 (drop-in) sign-up links (Square). */
export const ONLINE_MEDITATION_URL = 'https://square.link/u/uSdxkndi';
export const ONLINE_SEMINAR_URL = 'https://square.link/u/rEebRXNd';
export const ONLINE_BOTH_URL = 'https://square.link/u/v3I7OYtf';

/** 大阪 木・土 3回対面クラス booking form. */
export const OSAKA_COURSE_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSe-ok_VpxnJaCQyp_05M7fhVDxjMnSJGUv1HKzx_PLA9mZiHg/viewform';

/** Surya Kriya application form. */
export const SURYA_KRIYA_FORM_URL =
  'https://docs.google.com/forms/d/e/1FAIpQLSeVjPhVjYziIatrZLVkluYZ4vvhXAZD64f9h8pjhA7ZhsgBSQ/viewform?usp=dialog';

export const CONTACT_EMAIL = 'yoga@setsukohata.com';

/**
 * Next free trial, shown in the の道 quiz result and map.
 * Fill in `dates` (e.g. '11月8日（土）〜11月22日（土）') when a trial period is set;
 * leave it '' to show 日程は近日公開. Set `url` to the trial's booking page, or
 * leave '' to link to the class calendar.
 */
export const NEXT_FREE_TRIAL = { dates: '', url: '' };

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
        { id: 'path', label: '本格ハタヨガへの道', href: ja('path') },
      ],
    },
    {
      id: 'classes',
      label: 'クラス',
      href: ja('offerings'),
      items: [
        { label: '大阪', href: ja('offerings', 'osaka') },
        { label: '東京', href: ja('offerings', 'tokyo') },
        { label: 'オンライン会員', href: ja('offerings', 'online') },
        { label: 'オンライン単発', href: ja('offerings', 'online-single') },
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
      { label: '本格ハタヨガへの道', href: ja('path') },
      { label: 'クラス', href: ja('offerings') },
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
