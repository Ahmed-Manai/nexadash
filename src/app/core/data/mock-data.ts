// Deterministic mock data — no Math.random() and no "today", so screenshots and tests are stable.
// Company names are the usual fictional sample brands; e-mail domains use the reserved .example TLD.
import { ChartPoint, StatMetric, TimeSeries } from '../models/metrics';
import { Order, TopProduct } from '../models/order';
import { User, UserProfile, UserRole, UserStatus } from '../models/user';

// Every generated date is relative to this fixed day instead of the current date
export const REFERENCE_DATE = '2026-10-31';

const DAY_MS = 24 * 60 * 60 * 1000;

function daysBefore(days: number): Date {
  return new Date(Date.parse(`${REFERENCE_DATE}T00:00:00Z`) - days * DAY_MS);
}

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const DASHBOARD_STATS: StatMetric[] = [
  {
    id: 'users',
    label: 'Total Users',
    icon: 'group',
    value: 24521,
    previous: 22980,
    format: 'number',
  },
  {
    id: 'revenue',
    label: 'Revenue',
    icon: 'payments',
    value: 84200,
    previous: 76450,
    format: 'currency',
  },
  {
    id: 'sessions',
    label: 'Active Sessions',
    icon: 'bolt',
    value: 1340,
    previous: 1412,
    format: 'number',
  },
  {
    id: 'conversion',
    label: 'Conversion Rate',
    icon: 'trending_up',
    value: 3.6,
    previous: 3.2,
    format: 'percent',
  },
];

const CALENDAR_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

// The 12 months ending with the reference month (Nov 2025 → Oct 2026)
export const MONTH_LABELS = [...CALENDAR_MONTHS.slice(10), ...CALENDAR_MONTHS.slice(0, 10)];

// Monthly revenue for the last 12 months; the last point matches the Revenue stat card
export const REVENUE: TimeSeries = {
  labels: MONTH_LABELS,
  series: [
    {
      name: 'This year',
      data: [52400, 55100, 58900, 56300, 61200, 64800, 63500, 68900, 72400, 75100, 76450, 84200],
    },
    {
      name: 'Last year',
      data: [41800, 43200, 46500, 45100, 48900, 50200, 51800, 53400, 55900, 57200, 59800, 63100],
    },
  ],
};

// Revenue split for the current month; adds up to the Revenue stat card
export const TOP_PRODUCTS: TopProduct[] = [
  { name: 'Team plan', unitsSold: 412, revenue: 36840 },
  { name: 'Pro plan', unitsSold: 286, revenue: 25740 },
  { name: 'Analytics add-on', unitsSold: 198, revenue: 11880 },
  { name: 'Priority support', unitsSold: 87, revenue: 6960 },
  { name: 'Extra storage', unitsSold: 154, revenue: 2780 },
];

export const RECENT_ORDERS: Order[] = [
  {
    id: 'ORD-10482',
    customer: 'Contoso Ltd.',
    product: 'Team plan (annual)',
    amount: 4320,
    status: 'paid',
    date: '2026-10-31',
  },
  {
    id: 'ORD-10481',
    customer: 'Fabrikam, Inc.',
    product: 'Pro plan (monthly)',
    amount: 90,
    status: 'pending',
    date: '2026-10-31',
  },
  {
    id: 'ORD-10480',
    customer: 'Northwind Traders',
    product: 'Analytics add-on',
    amount: 600,
    status: 'paid',
    date: '2026-10-30',
  },
  {
    id: 'ORD-10479',
    customer: 'Adventure Works',
    product: 'Priority support',
    amount: 960,
    status: 'refunded',
    date: '2026-10-30',
  },
  {
    id: 'ORD-10478',
    customer: 'Tailspin Toys',
    product: 'Team plan (monthly)',
    amount: 360,
    status: 'paid',
    date: '2026-10-29',
  },
  {
    id: 'ORD-10477',
    customer: 'Wide World Importers',
    product: 'Extra storage',
    amount: 180,
    status: 'failed',
    date: '2026-10-29',
  },
  {
    id: 'ORD-10476',
    customer: 'Litware, Inc.',
    product: 'Pro plan (annual)',
    amount: 1080,
    status: 'paid',
    date: '2026-10-28',
  },
  {
    id: 'ORD-10475',
    customer: 'Proseware, Inc.',
    product: 'Team plan (annual)',
    amount: 2880,
    status: 'pending',
    date: '2026-10-27',
  },
];

// ─── Users ───────────────────────────────────────────────────────────────────

const FIRST_NAMES = [
  'Olivia',
  'Liam',
  'Emma',
  'Noah',
  'Ava',
  'Lucas',
  'Mia',
  'Ethan',
  'Sofia',
  'Mason',
  'Isla',
  'Leo',
  'Chloe',
  'Adam',
  'Nora',
  'Omar',
];

const LAST_NAMES = [
  'Bennett',
  'Carter',
  'Diaz',
  'Ellis',
  'Fischer',
  'Garcia',
  'Hughes',
  'Khan',
  'Martin',
  'Novak',
  'Patel',
  'Rossi',
];

const EMAIL_DOMAINS = ['contoso.example', 'fabrikam.example', 'northwind.example'];

function userRole(index: number): UserRole {
  if (index % 7 === 0) return 'Admin';
  if (index % 3 === 0) return 'Editor';
  return 'Viewer';
}

function userStatus(index: number): UserStatus {
  if (index % 11 === 4) return 'suspended';
  if (index % 5 === 2) return 'invited';
  return 'active';
}

export const USER_COUNT = 48;

// Name combinations are chosen so that all 48 first/last pairs are unique
export const USERS: User[] = Array.from({ length: USER_COUNT }, (_, i) => {
  const first = FIRST_NAMES[i % FIRST_NAMES.length];
  const last = LAST_NAMES[(5 * (i % 16) + 9 * Math.floor(i / 16)) % LAST_NAMES.length];
  return {
    id: i + 1,
    name: `${first} ${last}`,
    email: `${first}.${last}@${EMAIL_DOMAINS[i % EMAIL_DOMAINS.length]}`.toLowerCase(),
    role: userRole(i),
    status: userStatus(i),
    joined: isoDate(daysBefore(i * 13 + (i % 4) * 3)),
  };
});

// ─── Analytics ───────────────────────────────────────────────────────────────

// Relative traffic per weekday (Sunday first): quieter weekends, busy mid-week
const WEEKDAY_FACTOR = [0.72, 1, 1.06, 1.08, 1.03, 0.92, 0.78];

const SESSION_DAYS = 30;

const sessionDates = Array.from({ length: SESSION_DAYS }, (_, i) =>
  daysBefore(SESSION_DAYS - 1 - i),
);

function sessionsFor(base: number, growth: number): number[] {
  return sessionDates.map((date, i) =>
    Math.round((base + i * growth) * WEEKDAY_FACTOR[date.getUTCDay()]),
  );
}

export const SESSIONS: TimeSeries = {
  // Built by hand rather than with toLocaleDateString() so labels never depend on the locale
  labels: sessionDates.map((date) => `${CALENDAR_MONTHS[date.getUTCMonth()]} ${date.getUTCDate()}`),
  series: [
    { name: 'This period', data: sessionsFor(1180, 7) },
    { name: 'Previous period', data: sessionsFor(1060, 5) },
  ],
};

function sum(values: number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

export const ANALYTICS_STATS: StatMetric[] = [
  {
    id: 'sessions',
    label: 'Sessions (30 days)',
    icon: 'visibility',
    value: sum(SESSIONS.series[0].data),
    previous: sum(SESSIONS.series[1].data),
    format: 'number',
  },
  {
    id: 'duration',
    label: 'Avg. Session Duration',
    icon: 'timer',
    value: 222,
    previous: 205,
    format: 'duration',
  },
  {
    id: 'bounce',
    label: 'Bounce Rate',
    icon: 'logout',
    value: 41.8,
    previous: 44.2,
    format: 'percent',
    lowerIsBetter: true,
  },
  {
    id: 'pages',
    label: 'Pages / Session',
    icon: 'layers',
    value: 4.3,
    previous: 4.1,
    format: 'number',
  },
];

export const TRAFFIC_SOURCES: ChartPoint[] = [
  { label: 'Organic search', value: 7340 },
  { label: 'Direct', value: 4820 },
  { label: 'Social', value: 3260 },
  { label: 'Paid ads', value: 2480 },
  { label: 'Referral', value: 2150 },
  { label: 'Email', value: 1890 },
];

// New sign-ups per month; the last month matches the Total Users growth on the dashboard
export const SIGNUPS: ChartPoint[] = [
  820, 910, 1040, 980, 1120, 1210, 1180, 1290, 1360, 1420, 1390, 1541,
].map((value, i) => ({ label: MONTH_LABELS[i], value }));

// ─── Settings ────────────────────────────────────────────────────────────────

export const DEFAULT_PROFILE: UserProfile = {
  fullName: 'Jordan Doe',
  email: 'jordan.doe@contoso.example',
  jobTitle: 'Operations Manager',
  company: 'Contoso Ltd.',
  bio: '',
};
