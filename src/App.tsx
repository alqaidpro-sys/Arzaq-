import React, { useState, useRef, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Cell } from "recharts";

/* ═══════════════════════════════════════════════════════════
   DESIGN SYSTEM — Dubizzle-grade professional
   Light: White + Sky Blue accent (#0EA5E9)
   Dark:  Deep Navy (#0B1120) + Same Sky Blue
   Rule: Blue is ONLY for interactive / brand elements
         Backgrounds are pure white / pure dark
         Text is near-black / near-white — clean contrast
═══════════════════════════════════════════════════════════ */
const C = {
  // Brand blues — rich but not neon
  blue:        "#0EA5E9",
  blueDark:    "#0284C7",
  blueDeep:    "#0369A1",
  blueLight:   "#38BDF8",
  bluePale:    "#E0F2FE",   // light mode tint bg
  bluePaleDk:  "rgba(14,165,233,0.12)", // dark mode tint bg

  // Light mode surfaces
  lBg:         "#F1F3F6",   // Overwhelming white glare solution: soft premium gray background
  lSurface:    "#FAFAFB",   // Creamy elegant premium soft off-white surface
  lCard:       "#FFFFFF",   // Pure white card elements pop beautifully above soft lBg
  lBorder:     "#E4E7EB",   // Softer borders compatible with the premium theme
  lBorderMed:  "#D2D6DC",
  lText:       "#0D1B2A",
  lTextSec:    "#52657A",
  lTextMuted:  "#8FA3B8",
  lTextHint:   "#C2D0DC",

  // Dark mode surfaces — DEEP NAVY, not pure black
  dBg:         "#080E1A",
  dSurface:    "#0D1626",
  dCard:       "#111D30",
  dCardHover:  "#162239",
  dElevated:   "#1A2940",
  dBorder:     "rgba(255,255,255,0.07)",
  dBorderMed:  "rgba(255,255,255,0.13)",
  dText:       "#EDF2F8",
  dTextSec:    "#7B95B0",
  dTextMuted:  "#445A72",
  dTextHint:   "#253545",

  // Semantic
  green:       "#10B981",
  greenBg:     "rgba(16,185,129,0.1)",
  orange:      "#F59E0B",
  orangeBg:    "rgba(245,158,11,0.1)",
  red:         "#EF4444",
  redBg:       "rgba(239,68,68,0.1)",
};

/* Theme type structure */
interface ThemeType {
  bg: string;
  surface: string;
  card: string;
  cardHover: string;
  elevated: string;
  border: string;
  borderMed: string;
  text: string;
  textSec: string;
  textMuted: string;
  textHint: string;
  blue: string;
  blueBg: string;
  blueBorder: string;
  green: string;
  greenBg: string;
  orange: string;
  orangeBg: string;
  red: string;
  redBg: string;
  shadow: string;
  shadowCard: string;
}

/* Theme getter */
const T = (dark: boolean): ThemeType => ({
  bg:         dark ? C.dBg        : C.lBg,
  surface:    dark ? C.dSurface   : C.lSurface,
  card:       dark ? C.dCard      : C.lCard,
  cardHover:  dark ? C.dCardHover : "#F0F4FA",
  elevated:   dark ? C.dElevated  : "#FFFFFF",
  border:     dark ? C.dBorder    : C.lBorder,
  borderMed:  dark ? C.dBorderMed : C.lBorderMed,
  text:       dark ? C.dText      : C.lText,
  textSec:    dark ? C.dTextSec   : C.lTextSec,
  textMuted:  dark ? C.dTextMuted : C.lTextMuted,
  textHint:   dark ? C.dTextHint  : C.lTextHint,
  blue:       C.blue,
  blueBg:     dark ? C.bluePaleDk : C.bluePale,
  blueBorder: dark ? "rgba(14,165,233,0.25)" : "rgba(14,165,233,0.3)",
  green:      C.green,
  greenBg:    C.greenBg,
  orange:     C.orange,
  orangeBg:   C.orangeBg,
  red:        C.red,
  redBg:      C.redBg,
  shadow:     dark ? "0 2px 12px rgba(0,0,0,0.5)" : "0 2px 12px rgba(0,0,0,0.08)",
  shadowCard: dark ? "0 1px 4px rgba(0,0,0,0.4)"  : "0 1px 4px rgba(0,0,0,0.06)",
});

/* ── TYPES ───────────────────────────────────────────────── */
interface Job {
  id: number;
  type: string;
  title: string;
  catId: string;
  sub?: string;
  loc: string;
  price: number;
  unit: string;
  urgent: boolean;
  age: string;
  views: number;
  apps: number;
  poster: string;
  pName: string;
  verified: boolean;
  stars: number;
  desc: string;
  ratingCount?: number;
  ratingsList?: number[];
  status?: "active" | "pending" | "completed";
}

interface Category {
  id: string;
  ar: string;
  emoji: string;
  count: number;
  subs: string[];
}

/* ── SVG LOGO ─────────────────────────────────────────────
   Wrench + Gear forming an Arabic ر shape concept
   Text: أرزاق with custom letterform treatment
──────────────────────────────────────────────────────── */
interface ArzaqLogoProps {
  size?: number;
  showText?: boolean;
  dark: boolean;
}

const ArzaqLogo = ({ size = 32, showText = true, dark }: ArzaqLogoProps) => (
  <div style={{ display:"flex", alignItems:"center", gap:9 }}>
    {/* Icon mark */}
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Outer rounded square */}
      <rect width="40" height="40" rx="11" fill={C.blue}/>
      {/* Gear tooth top */}
      <path d="M20 6 L22 10 L18 10 Z" fill="rgba(255,255,255,0.35)"/>
      {/* Gear body */}
      <circle cx="20" cy="20" r="8" fill="white" opacity="0.95"/>
      <circle cx="20" cy="20" r="5" fill={C.blue}/>
      <circle cx="20" cy="20" r="2.2" fill="white"/>
      {/* Wrench handle */}
      <rect x="24" y="18.5" width="10" height="3" rx="1.5" fill="white" opacity="0.9"
        transform="rotate(35 24 20)"/>
      {/* Wrench head knob */}
      <circle cx="31" cy="14" r="2.5" fill="white" opacity="0.7"/>
      {/* Gear teeth */}
      {[0,45,90,135,180,225,270,315].map((a,i)=>(
        <rect key={i} x="19" y="6" width="2" height="4" rx="1"
          fill="rgba(255,255,255,0.5)"
          transform={`rotate(${a} 20 20)`}/>
      ))}
      {/* Inner highlight dot */}
      <circle cx="20" cy="20" r="1" fill={C.blueLight} opacity="0.8"/>
    </svg>

    {/* Text mark */}
    {showText && (
      <div style={{ lineHeight:1 }}>
        <div style={{
          fontSize: size * 0.65,
          fontWeight: 900,
          letterSpacing: -0.8,
          direction: "rtl",
          fontFamily: "'Cairo','Tajawal',sans-serif",
          background: `linear-gradient(135deg, ${C.blue} 0%, ${C.blueDeep} 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          lineHeight:1.1,
        }}>أرزاق</div>
        <div style={{
          fontSize: size * 0.22,
          letterSpacing: 2.5,
          color: dark ? C.dTextMuted : C.lTextMuted,
          textTransform:"uppercase",
          fontFamily:"'Cairo',sans-serif",
          fontWeight:500,
          marginTop:1,
          paddingRight:2,
        }}>ARZAQ</div>
      </div>
    )}
  </div>
);

/* ── MICRO ICONS ──────────────────────────────────────── */
interface SvgProps {
  key?: any;
  d: string;
  s?: number;
  c?: string;
  f?: string;
  sw?: number;
}

const Svg = ({ d, s=20, c="currentColor", f="none", sw=1.8 }: SvgProps) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill={f} stroke={c}
    strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>
    <path d={d}/>
  </svg>
);

const ic = {
  home:   "M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z M9 21V12h6v9",
  grid:   "M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z",
  plus:   "M12 5v14M5 12h14",
  chat:   "M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z",
  user:   "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z",
  search: "M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z",
  pin:    "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
  clock:  "M12 22a10 10 0 110-20 10 10 0 010 20z M12 6v6l4 2",
  heart:  "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z",
  eye:    "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 100 6 3 3 0 000-6z",
  chevR:  "M9 18l6-6-6-6",
  chevL:  "M15 18l-6-6 6-6",
  chevD:  "M6 9l6 6 6-6",
  check:  "M20 6L9 17l-5-5",
  bell:   "M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 01-3.46 0",
  phone:  "M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.82 19.79 19.79 0 01.01 1.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z",
  send:   "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z",
  cam:    "M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z M12 17a4 4 0 100-8 4 4 0 000 8z",
  star:   "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  x:      "M18 6L6 18M6 6l12 12",
  filter: "M22 3H2l8 9.46V19l4 2v-8.54L22 3z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  bag:    "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z M3 6h18 M16 10a4 4 0 01-8 0",
  list:   "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  edit:   "M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7 M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z",
  sun:    "M12 17a5 5 0 100-10 5 5 0 000 10z M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42",
  moon:   "M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z",
  arrowL: "M19 12H5M12 5l-7 7 7 7",
  dots:   "M12 5h.01M12 12h.01M12 19h.01",
  people: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2 M9 11a4 4 0 100-8 4 4 0 000 8z M23 21v-2a4 4 0 00-3-3.87 M16 3.13a4 4 0 010 7.75",
  wallet: "M21 12V7H5a2 2 0 010-4h14v4 M3 5v14a2 2 0 002 2h16v-5 M18 12a2 2 0 100 4 2 2 0 000-4z",
  share:  "M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8 M16 6l-4-4-4 4 M12 2v13",
};

/* ── DATA ─────────────────────────────────────────────── */
const CATS: Category[] = [
  { id:"clean",  ar:"تنظيف",      emoji:"🧹", count:412, subs:["تنظيف منازل","مكاتب","بعد البناء","خزانات","سجاد","واجهات زجاج"] },
  { id:"plumb",  ar:"سباكة",      emoji:"🔧", count:284, subs:["إصلاح تسربات","تركيب أدوات صحية","شبكات مياه","صرف صحي","سخانات"] },
  { id:"elec",   ar:"كهرباء",     emoji:"⚡", count:376, subs:["تمديدات كهربائية","تركيب إضاءة","لوحات توزيع","صيانة أجهزة","طاقة شمسية"] },
  { id:"build",  ar:"بناء",       emoji:"🏗️", count:198, subs:["ترميم وبناء","باطون وتشطيبات","جبسون بورد","حجر وبلاط","عزل مائي"] },
  { id:"move",   ar:"نقل",        emoji:"🚛", count:156, subs:["نقل أثاث","شحن بضائع","رافعة هيدروليك","تخزين","تغليف"] },
  { id:"paint",  ar:"دهانات",     emoji:"🎨", count:223, subs:["دهان داخلي","دهان خارجي","ورق حائط","ديكور","عزل حراري"] },
  { id:"ac",     ar:"تكييف",      emoji:"❄️", count:309, subs:["تركيب مكيفات","صيانة وإصلاح","شحن فريون","تنظيف فلاتر","تكييف مركزي"] },
  { id:"carp",   ar:"نجارة",      emoji:"🔨", count:187, subs:["أثاث خشبي","مطابخ","أبواب وشبابيك","ديكور حديد","أرضيات باركيه"] },
  { id:"guard",  ar:"حراسة",      emoji:"🛡️", count:94,  subs:["حراسة مباني","حارس شخصي","كاميرات مراقبة","أنظمة إنذار"] },
  { id:"garden", ar:"حدائق",      emoji:"🌿", count:142, subs:["تنسيق حدائق","قص أشجار","ري أوتوماتيك","زراعة نباتات"] },
  { id:"chef",   ar:"طباخ",       emoji:"👨‍🍳", count:88,  subs:["طبخ يومي","مناسبات وأفراح","طبخ صحي","حلويات"] },
  { id:"labor",  ar:"عمالة عامة", emoji:"💪", count:521, subs:["حمالين","مساعدة عامة","عمال يومية","تحميل وتفريغ"] },
];

const JOBS: Job[] = [
  { id:1,  type:"need-worker", title:"مطلوب سباك لإصلاح تسرب مياه عاجل",     catId:"plumb",  sub:"إصلاح تسربات", loc:"طنطا، الغربية",    price:300, unit:"ثابت",  urgent:true,  age:"منذ ساعتين",  views:47,  apps:3,  poster:"أ.م", pName:"أحمد محمد",  verified:true,  stars:4.8, desc:"تسرب في الخط الرئيسي بالحمام. نحتاج سباك ذو خبرة للإصلاح الفوري. العمل لن يأخذ أكثر من ساعتين. توفير قطع الغيار على حسابنا." },
  { id:2,  type:"need-worker", title:"تنظيف شامل للشقة قبل الانتقال",          catId:"clean",  sub:"تنظيف منازل",  loc:"القاهرة الجديدة",  price:250, unit:"ثابت",  urgent:false, age:"منذ 5 ساعات", views:89,  apps:7,  poster:"س.ك", pName:"سارة كمال",   verified:false, stars:4.5, desc:"شقة 120م، ثلاث غرف، تنظيف عميق شامل للأرضيات والحوائط والنوافذ والحمامات والمطبخ. المطلوب فريق من شخصين على الأقل." },
  { id:3,  type:"need-job",    title:"كهربائي معتمد — ١٠ سنوات خبرة",         catId:"elec",   sub:"تمديدات كهربائية", loc:"طنطا",              price:150, unit:"/ يوم", urgent:false, age:"منذ يوم",      views:134, apps:0,  poster:"ع.ف", pName:"علاء فاروق",  verified:true,  stars:4.9, desc:"كهربائي محترف معتمد، متخصص في التمديدات الكهربائية ولوحات التوزيع وتركيب الإضاءة. أعمل بكفاءة وأضمن جميع الأعمال." },
  { id:4,  type:"need-worker", title:"دهان غرفة نوم — لون وتصميم محدد",        catId:"paint",  sub:"دهان داخلي",  loc:"مدينة نصر",        price:200, unit:"ثابت",  urgent:false, age:"منذ 3 أيام",  views:56,  apps:4,  poster:"س.ع", pName:"سامي عادل",   verified:false, stars:0,   desc:"غرفة نوم 3×4 متر. عندنا الدهان والأدوات. المطلوب الخبرة والعمالة فقط. اللون تحديد عند التواصل." },
  { id:5,  type:"need-job",    title:"نجار أثاث محترف — تصنيع وتركيب",        catId:"carp",   sub:"أثاث خشبي",   loc:"6 أكتوبر",         price:200, unit:"/ يوم", urgent:false, age:"منذ يومين",   views:98,  apps:0,  poster:"ن.م", pName:"نادر مصطفى",  verified:true,  stars:4.7, desc:"متخصص في صناعة الأثاث المنزلي والمطابخ والديكور الخشبي. خبرة 15 سنة، أنجزت أكثر من 500 مشروع سابق." },
  { id:6,  type:"need-worker", title:"نقل عفش كامل — شقة ثلاث أوضة",          catId:"move",   sub:"نقل أثاث",    loc:"الشيخ زايد",       price:500, unit:"ثابت",  urgent:true,  age:"منذ ساعة",    views:23,  apps:2,  poster:"ه.س", pName:"هاني سمير",   verified:false, stars:4.2, desc:"نقل عفش كامل من الشيخ زايد إلى مدينة نصر. يشمل التغليف والتحميل والتفريغ. يفضل وجود عمالة مع اللوري." },
  { id:7,  type:"need-worker", title:"تركيب وصيانة مكيفات — 3 وحدات",          catId:"ac",     sub:"تركيب مكيفات", loc:"طنطا",              price:400, unit:"ثابت",  urgent:false, age:"منذ 6 ساعات", views:61,  apps:5,  poster:"م.ر", pName:"محمود رضا",   verified:true,  stars:4.6, desc:"تركيب 3 مكيفات سبليت في شقة جديدة. المكيفات موجودة. نحتاج فني متخصص مع أدوات التركيب." },
  { id:8,  type:"need-job",    title:"عامل تنظيف يومي — متاح فوراً",           catId:"clean",  sub:"تنظيف منازل",  loc:"طنطا، الغربية",    price:120, unit:"/ يوم", urgent:false, age:"منذ 3 أيام",  views:77,  apps:0,  poster:"ك.أ", pName:"كريم أحمد",   verified:false, stars:4.0, desc:"عامل تنظيف منازل ومكاتب بخبرة 5 سنوات. أعمل بمفردي أو ضمن فريق. لدي جميع مستلزمات التنظيف." },
];

interface ChatMessage {
  id: number;
  from: string;
  text: string;
  t: string;
}

interface ChatThread {
  id: string;
  name: string;
  job: string;
  last: string;
  t: string;
  unread: number;
  online: boolean;
  init: string;
  msgs: ChatMessage[];
}

const CHATS_DATA: ChatThread[] = [
  { id:"c1", name:"محمد فايز",    job:"مطلوب سباك لإصلاح تسرب",    last:"تمام، أقدر أيجي بكرة الصبح؟", t:"10:27", unread:2, online:true,  init:"م",
    msgs:[
      {id:1,from:"them",text:"السلام عليكم، هل الإعلان لا يزال متاحاً؟",t:"10:20"},
      {id:2,from:"me",  text:"وعليكم السلام، أيوه متاح",t:"10:22"},
      {id:3,from:"them",text:"كويس. إيه أكتر تفاصيل عن الشغل؟",t:"10:23"},
      {id:4,from:"me",  text:"التسرب في الحمام الرئيسي، محتاج تغيير واشر وحشوة الصنبور",t:"10:25"},
      {id:5,from:"them",text:"تمام، أقدر أيجي بكرة الصبح؟",t:"10:27"},
    ]
  },
  { id:"c2", name:"وائل فاروق",   job:"نقل عفش — شقة 3 غرف",       last:"أيوه مع الفريق، 500 جنيه ثابت",t:"أمس",   unread:0, online:false, init:"و",
    msgs:[
      {id:1,from:"them",text:"لحد 100 كيلو؟",t:"أمس"},
      {id:2,from:"me",  text:"أيوه، مع الفريق طبعاً",t:"أمس"},
      {id:3,from:"them",text:"أيوه مع الفريق، 500 جنيه ثابت",t:"أمس"},
    ]
  },
  { id:"c3", name:"Ahmed Raafat", job:"كهربائي معتمد — 10 سنوات",   last:"سعره الحالي حولي 200 جنيه؟",  t:"الإثنين",unread:1,online:true, init:"A",
    msgs:[
      {id:1,from:"them",text:"سعره الحالي حولي 200 جنيه؟",t:"الإثنين"},
    ]
  },
  { id:"c4", name:"السعيد",       job:"جهاز فيب — مستعمل",           last:"وان شاء الله بكرة",           t:"15 مايو",unread:0,online:false,init:"س",
    msgs:[{id:1,from:"them",text:"وان شاء الله بكرة",t:"15 مايو"}]
  },
  { id:"c5", name:"نجلاء حمدي",   job:"علبة مكياج فرنسية",           last:"شكراً جزيلاً 🙏",             t:"7 مايو",unread:0, online:false,init:"ن",
    msgs:[{id:1,from:"me",text:"شكراً جزيلاً 🙏",t:"7 مايو"}]
  },
];

/* ── AVATAR ─────────────────────────────── */
interface AvatarProps {
  letter: string;
  size?: number;
  online?: boolean;
  style?: React.CSSProperties;
}

const Avatar = ({letter,size=42,online=false,style}: AvatarProps) => {
  const pal = ["#0369A1","#0891B2","#047857","#7C3AED","#B45309","#DC2626","#0284C7"];
  const bg  = pal[letter.charCodeAt(0)%pal.length];
  return (
    <div style={{position:"relative",flexShrink:0,...style}}>
      <div style={{width:size,height:size,borderRadius:size*0.28,background:bg,
        display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"rgba(255,255,255,0.92)",fontWeight:700,fontSize:size*0.38}}>{letter}</span>
      </div>
      {online && <div style={{position:"absolute",bottom:1,right:1,width:size*0.22,height:size*0.22,
        borderRadius:"50%",background:C.green,border:"2px solid white"}}/>}
    </div>
  );
};

/* ── TAG / PILL ─────────────────────────── */
interface TagProps {
  children: React.ReactNode;
  color: string;
  bg?: string;
  border?: string;
  dot?: boolean;
}

const Tag = ({children,color,bg,border,dot}: TagProps) => (
  <span style={{display:"inline-flex",alignItems:"center",gap:4,
    color,background:bg||"transparent",
    border:`1px solid ${border||"transparent"}`,
    fontSize:10,fontWeight:600,letterSpacing:0.3,
    padding:"3px 9px",borderRadius:99,whiteSpace:"nowrap"}}>
    {dot&&<span style={{width:5,height:5,borderRadius:"50%",background:color,flexShrink:0}}/>}
    {children}
  </span>
);

/* ── DIVIDER ─────────────────────────────── */
interface DivProps {
  t: ThemeType;
  mx?: number;
  my?: number;
}

const Div = ({t,mx=0,my=0}: DivProps)=>(
  <div style={{height:1,background:t.border,margin:`${my}px ${mx}px`}}/>
);

/* ── SECTION HEADER (Dubizzle style) ────── */
interface SectionHeadProps {
  title: string;
  action?: string;
  onAction?: () => void;
  t: ThemeType;
}

const SectionHead = ({title,action,onAction,t}: SectionHeadProps)=>(
  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
    padding:"0 16px",marginBottom:10,direction:"rtl"}}>
    <span style={{color:t.text,fontSize:14,fontWeight:700}}>{title}</span>
    {action&&<button onClick={onAction} style={{color:t.blue,fontSize:12,fontWeight:600,
      background:"none",border:"none",cursor:"pointer",padding:0}}>
      {action} <Svg d={ic.chevL} s={12} c={t.blue}/>
    </button>}
  </div>
);

/* ═══════════════════════════════════════════
   JOB CARD — exact Dubizzle layout
═══════════════════════════════════════════ */
interface JobCardProps {
  key?: any;
  job: Job;
  t: ThemeType;
  onClick: () => void;
}

const JobCard = ({job,t,onClick}: JobCardProps)=>{
  const cat = CATS.find(c=>c.id===job.catId);
  const isWork = job.type==="need-worker";
  const [hov,setHov]=useState(false);
  return (
    <div onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?t.cardHover:t.card,
        border:`1px solid ${t.border}`,borderRadius:12,
        padding:"14px 14px 12px",marginBottom:8,cursor:"pointer",
        transition:"background 0.15s,box-shadow 0.15s",
        boxShadow:hov?t.shadow:t.shadowCard,direction:"rtl"}}>

      {/* Row 1: title + price */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
        <div style={{flex:1,paddingLeft:10}}>
          <h3 style={{color:t.text,fontSize:14,fontWeight:700,margin:"0 0 6px",lineHeight:1.4}}>{job.title}</h3>
          {/* Location + age */}
          <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
            <span style={{display:"flex",alignItems:"center",gap:3,color:t.textMuted,fontSize:11}}>
              <Svg d={ic.pin} s={11} c={t.textMuted}/>{job.loc}
            </span>
            <span style={{display:"flex",alignItems:"center",gap:3,color:t.textMuted,fontSize:11}}>
              <Svg d={ic.clock} s={11} c={t.textMuted}/>{job.age}
            </span>
          </div>
        </div>
        {/* Price */}
        <div style={{textAlign:"left",flexShrink:0}}>
          <div style={{color:t.blue,fontSize:16,fontWeight:800,letterSpacing:-0.5,direction:"rtl"}}>
            {job.price.toLocaleString()} <span style={{fontSize:11,fontWeight:600}}>ج.م</span>
          </div>
          <div style={{color:t.textMuted,fontSize:10,textAlign:"center"}}>{job.unit}</div>
        </div>
      </div>

      {/* Row 2: tags + stats */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:6}}>
        <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
          <Tag color={isWork?t.blue:t.green} bg={isWork?t.blueBg:t.greenBg}
            border={isWork?t.blueBorder:""} dot>
            {isWork?"يطلب عامل":"يطلب عمل"}
          </Tag>
          {job.urgent&&<Tag color={t.orange} bg={t.orangeBg}>⚡ عاجل</Tag>}
          {job.verified&&<Tag color={t.textMuted} bg={t.card} border={t.border}>✓</Tag>}
          <Tag color={t.textMuted} bg={t.card} border={t.border}>{cat?.ar}</Tag>
        </div>
        <div style={{display:"flex",gap:12}}>
          <span style={{display:"flex",alignItems:"center",gap:3,color:t.textMuted,fontSize:11}}>
            <Svg d={ic.eye} s={11} c={t.textMuted}/>{job.views}
          </span>
          {isWork&&<span style={{display:"flex",alignItems:"center",gap:3,color:t.textMuted,fontSize:11}}>
            <Svg d={ic.people} s={11} c={t.textMuted}/>{job.apps}
          </span>}
          {job.stars>0&&<span style={{color:C.orange,fontSize:11,fontWeight:600}}>★ {job.stars}</span>}
        </div>
      </div>
    </div>
  );
};

const HorizontalJobCard = ({ job, t, onClick }: JobCardProps) => {
  const cat = CATS.find(c => c.id === job.catId);
  const isWork = job.type === "need-worker";
  const [hov, setHov] = useState(false);
  
  const gradients = [
    `linear-gradient(135deg, ${C.blue}1A, ${C.blueDeep}2A)`,
    `linear-gradient(135deg, ${C.green}1A, ${C.green}30)`,
    `linear-gradient(135deg, ${C.orange}1A, ${C.orange}35)`,
    `linear-gradient(135deg, #8B5CF61A, #8B5CF630)`
  ];
  const bgGrad = gradients[job.id % gradients.length];

  return (
    <div onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? t.cardHover : t.card,
        border: `1.5px solid ${t.border}`,
        borderRadius: 14,
        width: 170,
        flexShrink: 0,
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxShadow: hov ? t.shadow : t.shadowCard,
        direction: "rtl",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden"
      }}>
      
      {/* Decorative Top Thumbnail/Cover */}
      <div style={{
        background: bgGrad,
        height: 90,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderBottom: `1px solid ${t.border}`
      }}>
        <span style={{ fontSize: 36, filter: "drop-shadow(0 4.5px 8px rgba(0,0,0,0.1))" }}>
          {cat?.emoji || "🛠️"}
        </span>
        
        {/* Urgent Badge */}
        {job.urgent && (
          <span style={{
            position: "absolute",
            top: 6,
            right: 6,
            background: C.orange,
            color: "white",
            fontSize: 9,
            fontWeight: 800,
            padding: "2px 6px",
            borderRadius: 6,
            boxShadow: "0 2px 5px rgba(249,115,22,0.3)"
          }}>
            ⚡ عاجل
          </span>
         )}

         {/* Type Tag */}
         <span style={{
           position: "absolute",
           bottom: 6,
           right: 6,
           background: isWork ? t.blueBg : t.greenBg,
           color: isWork ? C.blue : C.green,
           border: `1px solid ${isWork ? t.blueBorder : C.green + "33"}`,
           fontSize: 8,
           fontWeight: 800,
           padding: "1px 5px",
           borderRadius: 4
         }}>
           {isWork ? "مطلوب" : "عرض عمل"}
         </span>
      </div>

      {/* Body Info */}
      <div style={{ padding: 10, display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
        <div>
          {/* Price */}
          <div style={{
            color: t.text,
            fontSize: 13,
            fontWeight: 800,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}>
            {job.price.toLocaleString()} ج.م <span style={{ fontSize: 10, color: t.textSec, fontWeight: 500 }}>/ {job.unit}</span>
          </div>

          {/* Title */}
          <h4 style={{
            color: t.text,
            fontSize: 11,
            fontWeight: 700,
            margin: "0 0 6px",
            lineHeight: 1.3,
            height: 28,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            textOverflow: "ellipsis"
          }}>
            {job.title}
          </h4>
        </div>

        {/* Footer info: Location + time */}
        <div style={{ borderTop: `1px solid ${t.border}`, paddingTop: 6, marginTop: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: t.textMuted, fontSize: 9, marginBottom: 2 }}>
            <Svg d={ic.pin} s={9} c={t.textMuted} />
            <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}>{job.loc}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 3, color: t.textMuted, fontSize: 9 }}>
            <Svg d={ic.clock} s={9} c={t.textMuted} />
            <span>{job.age}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: HOME
═══════════════════════════════════════════ */
interface HomeScreenProps {
  jobsList: Job[];
  t: ThemeType;
  dark: boolean;
  onJob: (job: Job) => void;
  onCats: () => void;
  selectedLocation: "all" | "tanta" | "cairo";
  catFilter: string | null;
  setCatFilter: (v: string | null) => void;
  subFilter: string | null;
  setSubFilter: (v: string | null) => void;
}

const HomeScreen = ({
  jobsList,
  t,
  dark,
  onJob,
  onCats,
  selectedLocation,
  catFilter,
  setCatFilter,
  subFilter,
  setSubFilter
}: HomeScreenProps)=>{
  const [filter,setFilter]=useState("all");
  const [showPriceGuide, setShowPriceGuide] = useState(true);

  // Arabic mapping for selectedLocation
  const locationArName = selectedLocation === "all" 
    ? "كل المحافظات" 
    : (selectedLocation === "tanta" ? "طنطا والغربية" : "القاهرة الكبرى");

  const locationMultiplier = selectedLocation === "all" 
    ? 1.0 
    : (selectedLocation === "tanta" ? 0.85 : 1.25);

  // Default professions to compare when no category is selected
  const defaultProfessions = [
    { name: "تنظيف", price: 180, id: "clean" },
    { name: "سباكة", price: 250, id: "plumb" },
    { name: "كهرباء", price: 220, id: "elec" },
    { name: "دهانات", price: 230, id: "paint" },
    { name: "نجارة", price: 240, id: "carp" },
    { name: "تكييف", price: 300, id: "ac" }
  ];

  const catSubPrices: Record<string, Record<string, number>> = {
    clean: { "تنظيف منازل": 220, "مكاتب": 300, "بعد البناء": 450, "خزانات": 350, "سجاد": 150, "واجهات زجاج": 380 },
    plumb: { "إصلاح تسربات": 240, "تركيب أدوات صحية": 320, "شبكات مياه": 450, "صرف صحي": 280, "سخانات": 190 },
    elec: { "تمديدات كهربائية": 350, "تركيب إضاءة": 150, "لوحات توزيع": 400, "صيانة أجهزة": 200, "طاقة شمسية": 600 },
    build: { "ترميم وبناء": 400, "باطون وتشطيبات": 450, "جبسون بورد": 300, "حجر وبلاط": 350, "عزل مائي": 420 },
    move: { "نقل أثاث": 550, "شحن بضائع": 450, "رافعة هيدروليك": 700, "تخزين": 280, "تغليف": 180 },
    paint: { "دهان داخلي": 250, "دهان خارجي": 350, "ورق حائط": 200, "ديكور": 300, "عزل حراري": 380 },
    ac: { "تركيب مكيفات": 350, "صيانة وإصلاح": 250, "شحن فريون": 400, "تنظيف فلاتر": 150, "تكييف مركزي": 800 },
    carp: { "أثاث خشبي": 300, "مطابخ": 450, "أبواب وشبابيك": 200, "ديكور حديد": 350, "أرضيات باركيه": 400 },
    guard: { "حراسة مباني": 180, "حارس شخصي": 500, "كاميرات مراقبة": 250, "أنظمة إنذار": 300 },
    garden: { "تنسيق حدائق": 300, "قص أشجار": 150, "ري أوتوماتيك": 400, "زراعة نباتات": 120 }
  };

  const currentProfessionName = React.useMemo(() => {
    if (subFilter) return subFilter;
    if (catFilter) {
      return CATS.find(c => c.id === catFilter)?.ar || "المهنة المحددة";
    }
    return "كل المهن";
  }, [catFilter, subFilter]);

  const priceChartData = React.useMemo(() => {
    // If a category filter is active
    if (catFilter) {
      const catObj = CATS.find(c => c.id === catFilter);
      if (catObj) {
        const subs = catObj.subs;
        const pricesObj = catSubPrices[catFilter] || {};
        return subs.map(subName => {
          const basePrice = pricesObj[subName] || 200;
          const adjustedPrice = Math.round((basePrice * locationMultiplier) / 5) * 5;
          return {
            name: subName,
            "متوسط السعر": adjustedPrice,
            isCurrent: subFilter === subName
          };
        });
      }
    }

    // Default top-level comparison across categories
    return defaultProfessions.map(prof => {
      const adjustedPrice = Math.round((prof.price * locationMultiplier) / 5) * 5;
      return {
        name: prof.name,
        "متوسط السعر": adjustedPrice,
        isCurrent: false
      };
    });
  }, [catFilter, subFilter, selectedLocation]);

  const jobs = jobsList
    .filter(j=>filter==="all"||(filter==="work"&&j.type==="need-worker")||(filter==="job"&&j.type==="need-job"))
    .filter(j=>!catFilter||j.catId===catFilter)
    .filter(j=>{
      if (!subFilter) return true;
      if (j.sub) return j.sub === subFilter;
      return j.title.includes(subFilter) || j.desc.includes(subFilter);
    })
    .filter(j=>{
      if (selectedLocation === "all") return true;
      if (selectedLocation === "tanta") {
        return j.loc.includes("طنطا");
      }
      if (selectedLocation === "cairo") {
        return j.loc.includes("القاهرة") || j.loc.includes("نصر") || j.loc.includes("أكتوبر") || j.loc.includes("الشيخ زايد");
      }
      return true;
    });

  return (
    <div style={{paddingBottom:80}}>
      {/* ── HERO BANNER ── */}
      <div style={{
        background: dark
          ? `linear-gradient(160deg, #0D1E3A 0%, #0B1628 50%, #071020 100%)`
          : `linear-gradient(160deg, #E0F2FE 0%, #F0F9FF 50%, #F7F8FA 100%)`,
        padding:"22px 18px 20px",
        borderBottom:`1px solid ${t.border}`,
      }}>
        <div style={{direction:"rtl"}}>
          <p style={{color:t.textMuted,fontSize:11,margin:"0 0 5px",letterSpacing:0.6,fontWeight:500}}>
            منصة العمالة المتخصصة في مصر
          </p>
          <h1 style={{color:t.text,fontSize:21,fontWeight:900,margin:"0 0 16px",lineHeight:1.3,letterSpacing:-0.3}}>
            ابحث عن محترف<br/>أو أعلن عن خدماتك
          </h1>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>setFilter("work")}
              style={{flex:1,background:C.blue,border:"none",borderRadius:10,
                padding:"11px 0",color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",
                boxShadow:`0 3px 12px ${C.blue}55`}}>
              🔍 أحتاج عامل
            </button>
            <button onClick={()=>setFilter("job")}
              style={{flex:1,background:"transparent",
                border:`1.5px solid ${dark?"rgba(14,165,233,0.4)":C.blue}`,
                borderRadius:10,padding:"11px 0",
                color:C.blue,fontSize:13,fontWeight:700,cursor:"pointer"}}>
              💼 أعرض خدماتي
            </button>
          </div>
        </div>
      </div>

      {/* ── STATS ROW ── */}
      <div style={{display:"flex",background:t.surface,borderBottom:`1px solid ${t.border}`}}>
        {[{v:"١٢٠٠+",l:"إعلان نشط"},{v:"٣٨٠٠+",l:"عامل مسجل"},{v:"٨٩٠+",l:"مهمة منجزة"}].map((s,i)=>(
          <div key={i} style={{flex:1,padding:"13px 0",textAlign:"center",
            borderLeft:i>0?`1px solid ${t.border}`:"none"}}>
            <div style={{color:t.blue,fontSize:14,fontWeight:800,letterSpacing:-0.3}}>{s.v}</div>
            <div style={{color:t.textMuted,fontSize:10,marginTop:1}}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* ── CATEGORIES SCROLL ── */}
      <div style={{paddingTop:16,paddingBottom:4}}>
        <SectionHead title="الفئات" action="عرض الكل" onAction={onCats} t={t}/>
        <div style={{
          display: "grid",
          gridAutoFlow: "column",
          gridTemplateRows: "repeat(2, minmax(0, 1fr))",
          gap: "8px 10px",
          padding: "0 16px 8px",
          overflowX: "auto",
          scrollbarWidth: "none",
          direction: "rtl"
        }}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>{
              if (catFilter === c.id) {
                setCatFilter(null);
                setSubFilter(null);
              } else {
                setCatFilter(c.id);
                setSubFilter(null);
              }
            }}
              style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5,
                padding:"10px 10px",minWidth:70,borderRadius:12,
                border:`1.5px solid ${catFilter===c.id?C.blue:t.border}`,
                background:catFilter===c.id?t.blueBg:t.card,
                cursor:"pointer",flexShrink:0,transition:"all 0.15s"}}>
              <span style={{fontSize:20}}>{c.emoji}</span>
              <span style={{color:catFilter===c.id?t.blue:t.textSec,
                fontSize:10,fontWeight:catFilter===c.id?700:500,
                direction:"rtl",textAlign:"center",whiteSpace:"nowrap"}}>{c.ar}</span>
              <span style={{color:t.textMuted,fontSize:9}}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── ACTIVE CATEGORY SUB-SECTIONS ── */}
      {catFilter && (
        <div style={{
          background: t.card,
          borderTop: `1.5px solid ${t.border}`,
          borderBottom: `1.5px solid ${t.border}`,
          padding: "14px 16px",
          direction: "rtl",
          marginTop: 4,
          marginBottom: 8,
          animation: "fadeIn 0.2s"
        }}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{display:"flex",alignItems:"center",gap:8}}>
              <span style={{fontSize:20}}>{CATS.find(c=>c.id===catFilter)?.emoji}</span>
              <div style={{textAlign:"right"}}>
                <span style={{color:t.text,fontSize:13,fontWeight:800,display:"block"}}>
                  تصفح قسم: {CATS.find(c=>c.id===catFilter)?.ar}
                </span>
                <span style={{color:t.textMuted,fontSize:10,display:"block",marginTop:1}}>
                  اختر التخصص الفرعي لتصفية نتائج العمالة
                </span>
              </div>
            </div>
            <button onClick={()=>{setCatFilter(null);setSubFilter(null);}}
              style={{
                background:t.surface,border:`1px solid ${t.border}`,borderRadius:8,
                padding:"5px 12px",color:C.blue,fontSize:11,fontWeight:700,cursor:"pointer",
                transition:"all 0.15s"
              }}>
              إلغاء التصفية ×
            </button>
          </div>

          <div style={{display:"flex",gap:6,overflowX:"auto",scrollbarWidth:"none",paddingBottom:2}}>
            {/* "All" button */}
            <button onClick={()=>setSubFilter(null)}
              style={{
                padding:"6px 14px",borderRadius:99,flexShrink:0,
                border:`1.5px solid ${subFilter===null?C.blue:t.border}`,
                background:subFilter===null?t.blueBg:t.surface,
                color:subFilter===null?C.blue:t.textSec,
                fontSize:11,fontWeight:subFilter===null?700:500,cursor:"pointer",
                transition:"all 0.15s",whiteSpace:"nowrap"
              }}>
              الجميع
            </button>
            {/* Subcategories list */}
            {CATS.find(c=>c.id===catFilter)?.subs.map(s=>(
              <button key={s} onClick={()=>setSubFilter(s)}
                style={{
                  padding:"6px 14px",borderRadius:99,flexShrink:0,
                  border:`1.5px solid ${subFilter===s?C.blue:t.border}`,
                  background:subFilter===s?t.blueBg:t.surface,
                  color:subFilter===s?C.blue:t.textSec,
                  fontSize:11,fontWeight:subFilter===s?700:500,cursor:"pointer",
                  transition:"all 0.15s",whiteSpace:"nowrap"
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── FILTER TABS ── */}
      <div style={{display:"flex",gap:6,padding:"10px 16px 8px",overflowX:"auto",
        scrollbarWidth:"none",direction:"rtl"}}>
        {[{k:"all",l:"الكل"},{k:"work",l:"مطلوب عمال"},{k:"job",l:"باحثون عن عمل"}].map(f=>(
          <button key={f.k} onClick={()=>setFilter(f.k)}
            style={{padding:"7px 15px",borderRadius:99,flexShrink:0,
              border:`1.5px solid ${filter===f.k?C.blue:t.border}`,
              background:filter===f.k?t.blueBg:t.card,
              color:filter===f.k?C.blue:t.textSec,
              fontSize:12,fontWeight:filter===f.k?700:500,cursor:"pointer",
              transition:"all 0.15s",whiteSpace:"nowrap"}}>
            {f.l}
          </button>
        ))}
      </div>

      {/* ── PRICE INDEX CHART ── */}
      <div style={{
        padding: "0 12px 10px",
        direction: "rtl"
      }}>
        <div style={{
          background: t.card,
          border: `1.5px solid ${t.border}`,
          borderRadius: 14,
          padding: "14px 16px",
          display: "flex",
          flexDirection: "column"
        }}>
          {/* Header */}
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            cursor: "pointer"
          }} onClick={() => setShowPriceGuide(!showPriceGuide)}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 16 }}>📈</span>
                <span style={{ color: t.text, fontSize: 13, fontWeight: 800 }}>
                  دليل أسعار الخدمات الاسترشادي
                </span>
                <span style={{
                  background: t.blueBg,
                  color: C.blue,
                  fontSize: 9,
                  fontWeight: 700,
                  padding: "2px 6px",
                  borderRadius: 6
                }}>
                  {locationArName}
                </span>
              </div>
              <p style={{ color: t.textMuted, fontSize: 10, margin: "3px 0 0", textAlign: "right" }}>
                معدل أسعار مهنة <strong style={{ color: C.blue, fontWeight: 800 }}>{currentProfessionName}</strong> (جنيه مصري / باليومية أو بالعملية)
              </p>
            </div>
            <button style={{
              background: "none",
              border: "none",
              color: C.blue,
              fontSize: 11,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 2
            }}>
              {showPriceGuide ? "إخفاء ▲" : "عرض التفاصيل ▼"}
            </button>
          </div>

          {showPriceGuide && (
            <div style={{ marginTop: 14, animation: "fadeIn 0.25s" }}>
              {/* Interactive Info tip */}
              <div style={{
                background: t.surface,
                borderRadius: 8,
                padding: "8px 10px",
                fontSize: 10,
                color: t.textSec,
                marginBottom: 12,
                textAlign: "right",
                lineHeight: 1.4,
                borderRight: `3px solid ${C.blue}`
              }}>
                ℹ️ الأسعار المعروضة استرشادية لمساعدتك في التقديم أو طلب المحترفين. اضغط على أي تخصص لتنشيط التصفية مباشرة!
              </div>

              {/* Chart container */}
              <div style={{ width: "100%", height: 140, direction: "ltr" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart 
                    data={priceChartData} 
                    margin={{ top: 8, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: t.textMuted, fontSize: 8, fontWeight: 600 }}
                    />
                    <YAxis 
                      tickLine={false}
                      axisLine={false}
                      tick={{ fill: t.textMuted, fontSize: 8 }}
                    />
                    <Tooltip 
                      cursor={{ fill: dark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)" }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const isHighlighted = catFilter 
                            ? subFilter === data.name 
                            : catFilter === CATS.find(c => c.ar === data.name)?.id;
                          return (
                            <div style={{
                              background: t.surface,
                              border: `1.5px solid ${isHighlighted ? C.blue : t.border}`,
                              borderRadius: 8,
                              padding: "6px 8px",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                              direction: "rtl",
                              textAlign: "right"
                            }}>
                              <div style={{ color: t.text, fontSize: 10, fontWeight: 800 }}>{data.name}</div>
                              <div style={{ color: C.blue, fontSize: 10, fontWeight: 700, marginTop: 2 }}>
                                💰 متوسط التكلفة: {data["متوسط السعر"]} ج.م
                              </div>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar 
                      dataKey="متوسط السعر" 
                      radius={[4, 4, 0, 0]} 
                      maxBarSize={30} 
                      style={{ cursor: "pointer" }}
                      onClick={(data: any) => {
                        if (data && data.name) {
                          if (catFilter) {
                            setSubFilter(subFilter === data.name ? null : data.name);
                          } else {
                            const foundCat = CATS.find(c => c.ar === data.name);
                            if (foundCat) {
                              setCatFilter(foundCat.id);
                            }
                          }
                        }
                      }}
                    >
                      {priceChartData.map((entry, index) => {
                        const isHighlightSub = subFilter !== null;
                        const isSelectedBar = catFilter 
                          ? subFilter === entry.name 
                          : catFilter === CATS.find(c => c.ar === entry.name)?.id;
                        
                        let barColor = C.blue;
                        if (catFilter) {
                          if (isHighlightSub) {
                            barColor = isSelectedBar ? C.blue : (dark ? "rgba(255,255,255,0.1)" : "#E4E7EB");
                          } else {
                            barColor = C.blue;
                          }
                        } else {
                          barColor = C.blue;
                        }

                        return (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={barColor} 
                          />
                        );
                      })}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── LISTINGS ── */}
      <div style={{padding:"4px 12px 24px"}}>
        {jobs.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:36,marginBottom:12,opacity:0.3}}>🔍</div>
            <div style={{color:t.textMuted,fontSize:13}}>لا توجد نتائج مطابقة</div>
          </div>
        ) : (
          catFilter || subFilter ? (
            // A specific category/sub-specialty is active: Show standard vertical listing
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, direction: "rtl", padding: "0 4px" }}>
                <h3 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: 0 }}>النتائج المتاحة ({jobs.length})</h3>
                <span style={{ color: t.textMuted, fontSize: 11 }}>تصفية نشطة ⚡</span>
              </div>
              {jobs.map(j => (
                <JobCard key={j.id} job={j} t={t} onClick={() => onJob(j)} />
              ))}
            </div>
          ) : (
            // Default home view: Group ads by category matching the query/filter (up to 10 ads per category, scrolling horizontally)
            <div>
              {CATS.map(cat => {
                const catJobs = jobs.filter(j => j.catId === cat.id);
                if (catJobs.length === 0) return null;
                const latestJobs = catJobs.slice(0, 10);

                return (
                  <div key={cat.id} style={{ marginBottom: 22, direction: "rtl" }}>
                    {/* Section Header */}
                    <SectionHead 
                      title={`${cat.emoji} ${cat.ar}`} 
                      action="عرض الكل" 
                      onAction={() => {
                        setCatFilter(cat.id);
                        setSubFilter(null);
                      }} 
                      t={t} 
                    />
                    
                    {/* Horizontal Scroll Rail */}
                    <div style={{
                      display: "flex",
                      gap: 12,
                      overflowX: "auto",
                      scrollbarWidth: "none",
                      padding: "4px 4px 12px",
                      margin: "0 -4px",
                      scrollSnapType: "x mandatory"
                    }}>
                      {latestJobs.map(j => (
                        <div key={j.id} style={{ scrollSnapAlign: "start" }}>
                          <HorizontalJobCard job={j} t={t} onClick={() => onJob(j)} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: CATEGORIES
═══════════════════════════════════════════ */
interface CategoriesScreenProps {
  t: ThemeType;
  catFilter: string | null;
  setCatFilter: (v: string | null) => void;
  subFilter: string | null;
  setSubFilter: (v: string | null) => void;
  setTab: (v: string) => void;
  jobsList: Job[];
  onJob: (job: Job) => void;
}

const CategoriesScreen = ({
  t,
  catFilter,
  setCatFilter,
  subFilter,
  setSubFilter,
  setTab,
  jobsList,
  onJob
}: CategoriesScreenProps)=>{
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);
  const [selectedSub, setSelectedSub] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchJobQuery, setSearchJobQuery] = useState("");
  const [exp, setExp] = useState<string | null>(null);

  const filteredCats = CATS.filter(cat => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return cat.ar.toLowerCase().includes(q) || 
           cat.subs.some(sub => sub.toLowerCase().includes(q));
  });

  // Dedicated Category Page layout
  if (activeCategory) {
    const catJobs = jobsList.filter(job => job.catId === activeCategory.id);
    
    const filteredJobs = catJobs.filter(job => {
      const matchesSub = !selectedSub || job.sub === selectedSub;
      if (!searchJobQuery) return matchesSub;
      const q = searchJobQuery.toLowerCase().trim();
      return matchesSub && (
        job.title.toLowerCase().includes(q) ||
        (job.desc || "").toLowerCase().includes(q) ||
        job.pName.toLowerCase().includes(q)
      );
    });

    return (
      <div style={{ paddingBottom: 100, direction: "rtl", animation: "fadeIn 0.2s" }}>
        {/* Sub-header / Title block */}
        <div style={{
          background: `linear-gradient(135deg, ${C.blue}0A, ${C.blueDeep}14)`,
          borderBottom: `1px solid ${t.border}`,
          padding: "16px 14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12
        }}>
          {/* Right section: Back button & Title */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button onClick={() => { setActiveCategory(null); setSelectedSub(null); setSearchJobQuery(""); }}
              style={{
                background: t.card,
                border: `1.5px solid ${t.border}`,
                width: 36,
                height: 36,
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: t.textSec,
                boxShadow: t.shadowCard
              }}>
              <Svg d={ic.chevR} s={16} c={t.textSec} />
            </button>
            
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 4 }}>
              <span style={{ fontSize: 24 }}>{activeCategory.emoji}</span>
              <div style={{ textAlign: "right" }}>
                <h2 style={{ color: t.text, fontSize: 16, fontWeight: 900, margin: 0 }}>
                  قسم {activeCategory.ar}
                </h2>
                <span style={{ color: t.textMuted, fontSize: 11 }}>
                  {catJobs.length} إعلان نشط متاح حالياً
                </span>
              </div>
            </div>
          </div>
          
          <div style={{
            background: t.blueBg,
            border: `1px solid ${t.blueBorder}`,
            color: C.blue,
            fontSize: 11,
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: 8
          }}>
            تصفح مباشر ⚡
          </div>
        </div>

        {/* Search within Category */}
        <div style={{ padding: "12px 14px 4px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8, background: t.card,
            border: `1px solid ${t.border}`, borderRadius: 10, padding: "9px 13px"
          }}>
            <Svg d={ic.search} s={16} c={t.textMuted} />
            <input
              value={searchJobQuery}
              onChange={(e) => setSearchJobQuery(e.target.value)}
              placeholder={`ابحث داخل قسم ${activeCategory.ar}...`}
              style={{
                flex: 1, background: "none", border: "none",
                color: t.text, fontSize: 13, outline: "none", fontFamily: "inherit"
              }}
            />
            {searchJobQuery && (
              <button onClick={() => setSearchJobQuery("")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
                <Svg d={ic.x} s={14} c={t.textMuted} />
              </button>
            )}
          </div>
        </div>

        {/* Horizontal Subcategories Scroll */}
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <div style={{
            display: "flex", gap: 6, padding: "0 14px", overflowX: "auto",
            scrollbarWidth: "none"
          }}>
            {/* "الكل" (ALL) Tab option */}
            <button
              onClick={() => setSelectedSub(null)}
              style={{
                padding: "8px 16px",
                borderRadius: 99,
                flexShrink: 0,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
                border: `1px solid ${!selectedSub ? C.blue : t.border}`,
                background: !selectedSub ? C.blue : t.card,
                color: !selectedSub ? "#fff" : t.textSec,
                boxShadow: !selectedSub ? `0 4px 12px ${C.blue}33` : "none"
              }}>
              🌟 الكل
            </button>

            {/* Sub-specialties */}
            {activeCategory.subs.map(subName => {
              const isActive = selectedSub === subName;
              return (
                <button
                  key={subName}
                  onClick={() => setSelectedSub(subName)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 99,
                    flexShrink: 0,
                    fontSize: 12,
                    fontWeight: isActive ? 800 : 600,
                    cursor: "pointer",
                    transition: "all 0.15s",
                    border: `1px solid ${isActive ? C.blue : t.border}`,
                    background: isActive ? C.blue : t.card,
                    color: isActive ? "#fff" : t.textSec,
                    boxShadow: isActive ? `0 4px 12px ${C.blue}33` : "none"
                  }}>
                  {subName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ads Cards List */}
        <div style={{ padding: "0 12px 24px" }}>
          {filteredJobs.length === 0 ? (
            <div style={{
              background: t.card,
              border: `1px solid ${t.border}`,
              borderRadius: 16,
              padding: "40px 20px",
              textAlign: "center",
              marginTop: 10
            }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
              <h4 style={{ color: t.text, fontSize: 14, fontWeight: 800, margin: "0 0 6px" }}>
                لا توجد إعلانات مطابقة حالياً
              </h4>
              <p style={{ color: t.textMuted, fontSize: 12, margin: "0 0 16px", lineHeight: 1.6 }}>
                {selectedSub 
                  ? `لم يقم أحد بنشر طلبات أو عروض عمالة في تخصص "${selectedSub}" بعد.`
                  : "لا توجد طلبات أو عروض في هذا القسم حالياً."}
              </p>
              <button 
                onClick={() => setTab("post")}
                style={{
                  background: C.blue,
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer"
                }}>
                كن أول من يعلن الآن ➕
              </button>
            </div>
          ) : (
            filteredJobs.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                t={t} 
                onClick={() => onJob(job)} 
              />
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{paddingBottom:100}}>
      {/* Search inside categories */}
      <div style={{padding:"12px 14px 8px"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,background:t.card,
          border:`1px solid ${t.border}`,borderRadius:10,padding:"9px 13px",direction:"rtl"}}>
          <Svg d={ic.search} s={16} c={t.textMuted}/>
          <input
            value={searchQuery}
            onChange={(e)=>setSearchQuery(e.target.value)}
            placeholder="ابحث في الفئات والتخصصات..."
            style={{flex:1,background:"none",border:"none",
              color:t.text,fontSize:13,outline:"none",fontFamily:"inherit",direction:"rtl"}}
          />
        </div>
      </div>

      <div style={{padding:"6px 12px"}}>
        <div style={{color:t.textMuted,fontSize:11,direction:"rtl",marginBottom:10,paddingRight:4}}>
          {filteredCats.reduce((a,c)=>a+c.count,0).toLocaleString()} إعلان في {filteredCats.length} فئة رئيسية
        </div>

        {filteredCats.map(cat=>(
          <div key={cat.id} style={{background:t.card,border:`1px solid ${t.border}`,
            borderRadius:12,marginBottom:8,overflow:"hidden"}}>
            <button onClick={()=>setExp(exp===cat.id?null:cat.id)}
              style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                padding:"13px 14px",background:"none",border:"none",cursor:"pointer",direction:"rtl"}}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:44,height:44,borderRadius:12,background:t.blueBg,
                  border:`1px solid ${t.blueBorder}`,display:"flex",
                  alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>
                  {cat.emoji}
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:700}}>{cat.ar}</div>
                  <div style={{color:t.textMuted,fontSize:11,marginTop:1}}>
                    {cat.count} إعلان · {cat.subs.length} تخصص
                  </div>
                </div>
              </div>
              <Svg d={exp===cat.id?ic.chevD:ic.chevL} s={16} c={t.textMuted}/>
            </button>

            {exp===cat.id&&(
              <div style={{borderTop:`1px solid ${t.border}`,padding:"12px 14px",background:t.surface,direction:"rtl"}}>
                {/* Enter primary section option */}
                <div style={{marginBottom:10}}>
                  <button onClick={()=>{
                    setActiveCategory(cat);
                    setSelectedSub(null);
                  }} style={{
                    width:"100%",background:C.blue,border:"none",color:"#fff",
                    borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,
                    cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:4,
                    transition:"all 0.15s"
                  }}>
                    <span>👈 دخول قسم {cat.ar} (الجميع)</span>
                  </button>
                </div>

                <div style={{color:t.textMuted,fontSize:10,fontWeight:700,marginBottom:8}}>التخصصات الفرعية:</div>

                <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
                  {cat.subs.map(s=>(
                    <button key={s} onClick={()=>{
                      setActiveCategory(cat);
                      setSelectedSub(s);
                    }}
                      style={{padding:"6px 13px",borderRadius:99,
                        border:`1px solid ${t.border}`,background:t.card,
                        color:t.textSec,fontSize:11,cursor:"pointer",fontWeight:500,
                        transition:"all 0.15s"}}
                      onMouseEnter={e=>{e.currentTarget.style.borderColor=C.blue;e.currentTarget.style.color=C.blue;e.currentTarget.style.background=t.blueBg;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=t.border;e.currentTarget.style.color=t.textSec;e.currentTarget.style.background=t.card;}}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: POST JOB
═══════════════════════════════════════════ */
interface PostScreenProps {
  t: ThemeType;
  onAddJob: (job: Job) => void;
  profile: any;
}

const PostScreen = ({t, onAddJob, profile}: PostScreenProps)=>{
  const [mode,setMode]=useState("need-worker");
  const [cat,setCat]=useState<string | null>(null);
  const [title,setTitle]=useState("");
  const [desc,setDesc]=useState("");
  const [price,setPrice]=useState("");
  const [unit,setUnit]=useState("ثابت");
  const [loc,setLoc]=useState("");
  const [urgent,setUrgent]=useState(false);
  const [nego,setNego]=useState(false);
  const [contact,setContact]=useState("both");
  const [done,setDone]=useState(false);

  const handlePublish = () => {
    if(!valid) return;
    
    const newJobId = Date.now();

    const newJob: Job = {
      id: newJobId,
      type: mode,
      title: title,
      catId: cat || "all",
      sub: "عام",
      loc: loc || "طنطا",
      price: parseInt(price) || 0,
      unit: unit === "ثابت" ? "سعر ثابت" : (unit === "ساعة" ? "ساعة" : "يوم"),
      urgent: urgent,
      age: "الآن",
      views: 1,
      apps: 0,
      poster: profile.avatarColor || C.blue,
      pName: profile.name,
      verified: profile.verified,
      stars: profile.rating,
      desc: desc || "لا يوجد وصف تفصيلي لهذا الإعلان.",
      ratingCount: 1,
      ratingsList: [5],
    };

    onAddJob(newJob);
    setDone(true);
  };

  const inp = (extra: React.CSSProperties = {}): React.CSSProperties => ({
    width:"100%",background:t.card,border:`1px solid ${t.border}`,
    borderRadius:10,padding:"11px 13px",color:t.text,fontSize:13,
    direction:"rtl",outline:"none",boxSizing:"border-box",fontFamily:"inherit",
    transition:"border-color 0.15s",...extra
  });
  
  const lbl: React.CSSProperties = {
    color:t.textSec,fontSize:12,fontWeight:600,display:"block",
    marginBottom:6,direction:"rtl",letterSpacing:0.3
  };

  const foc = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = C.blue;
  };
  const blr = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.target.style.borderColor = t.border;
  };

  if(done) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",padding:"80px 20px",direction:"rtl",textAlign:"center"}}>
      <div style={{width:76,height:76,borderRadius:38,background:t.blueBg,
        border:`2px solid ${t.blueBorder}`,display:"flex",alignItems:"center",
        justifyContent:"center",marginBottom:20}}>
        <Svg d={ic.check} s={34} c={C.blue} sw={2.5}/>
      </div>
      <h2 style={{color:t.text,fontSize:20,fontWeight:800,margin:"0 0 8px"}}>تم نشر الإعلان بنجاح</h2>
      <p style={{color:t.textMuted,fontSize:13,maxWidth:260,lineHeight:1.6,margin:"0 0 24px"}}>
        سيتواصل معك المهنيون قريباً. يمكنك متابعة الإعلان من صفحة إعلاناتي.
      </p>
      <button onClick={()=>{setDone(false);setTitle("");setDesc("");setPrice("");setCat(null);setLoc("");}}
        style={{background:C.blue,border:"none",color:"#fff",borderRadius:10,
          padding:"12px 28px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
        نشر إعلان آخر
      </button>
    </div>
  );

  const valid = title.trim()&&cat&&price;

  return (
    <div style={{padding:"12px 14px 100px",direction:"rtl"}}>
      <div style={{marginBottom:18}}>
        <h2 style={{color:t.text,fontSize:17,fontWeight:800,margin:"0 0 2px"}}>إعلان جديد</h2>
        <p style={{color:t.textMuted,fontSize:12,margin:0}}>انشر احتياجك أو اعرض مهارتك</p>
      </div>

      {/* Mode Toggle */}
      <div style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:12,
        padding:4,display:"flex",gap:3,marginBottom:20}}>
        {[{k:"need-worker",t1:"أحتاج عامل",t2:"أنشر طلب توظيف"},
          {k:"need-job",   t1:"أعرض خدماتي",t2:"ملف مهني"}].map(m=>(
          <button key={m.k} onClick={()=>setMode(m.k)}
            style={{flex:1,padding:"10px 6px",borderRadius:9,border:"none",
              background:mode===m.k?C.blue:"transparent",
              color:mode===m.k?"#fff":t.textSec,
              cursor:"pointer",transition:"all 0.18s",textAlign:"center"}}>
            <div style={{fontSize:13,fontWeight:700}}>{m.t1}</div>
            <div style={{fontSize:10,opacity:0.8,marginTop:1}}>{m.t2}</div>
          </button>
        ))}
      </div>

      {/* Category */}
      <div style={{marginBottom:16}}>
        <label style={lbl}>الفئة *</label>
        <div style={{display:"flex",flexWrap:"wrap",gap:7}}>
          {CATS.map(c=>(
            <button key={c.id} onClick={()=>setCat(c.id)}
              style={{display:"flex",alignItems:"center",gap:5,padding:"6px 12px",borderRadius:99,
                border:`1.5px solid ${cat===c.id?C.blue:t.border}`,
                background:cat===c.id?t.blueBg:t.card,
                color:cat===c.id?C.blue:t.textSec,
                fontSize:11,fontWeight:cat===c.id?700:500,cursor:"pointer",transition:"all 0.15s"}}>
              <span style={{fontSize:13}}>{c.emoji}</span>{c.ar}
            </button>
          ))}
        </div>
      </div>

      {/* Title */}
      <div style={{marginBottom:13}}>
        <label style={lbl}>عنوان الإعلان *</label>
        <input value={title} onChange={e=>setTitle(e.target.value)}
          placeholder={mode==="need-worker"?"مثال: مطلوب سباك لإصلاح تسرب عاجل":"مثال: كهربائي معتمد — ١٠ سنوات خبرة"}
          style={inp()} onFocus={foc} onBlur={blr}/>
      </div>

      {/* Description */}
      <div style={{marginBottom:13}}>
        <label style={lbl}>الوصف التفصيلي</label>
        <textarea value={desc} onChange={e=>setDesc(e.target.value)}
          placeholder="اشرح المهمة بوضوح، المتطلبات، وأي تفاصيل مفيدة..."
          style={{...inp(),height:90,resize:"vertical"}} onFocus={foc} onBlur={blr}/>
      </div>

      {/* Price + Unit */}
      <div style={{display:"flex",gap:10,marginBottom:13}}>
        <div style={{flex:1.5}}>
          <label style={lbl}>السعر (ج.م) *</label>
          <input value={price} onChange={e=>setPrice(e.target.value)}
            placeholder="0" type="number" style={inp()} onFocus={foc} onBlur={blr}/>
        </div>
        <div style={{flex:1}}>
          <label style={lbl}>نوع السعر</label>
          <select value={unit} onChange={e=>setUnit(e.target.value)}
            style={{...inp(),appearance:"none"}} onFocus={foc} onBlur={blr}>
            <option>ثابت</option>
            <option>/ يوم</option>
            <option>/ ساعة</option>
            <option>قابل للتفاوض</option>
          </select>
        </div>
      </div>

      {/* Location */}
      <div style={{marginBottom:13}}>
        <label style={lbl}>الموقع</label>
        <input value={loc} onChange={e=>setLoc(e.target.value)}
          placeholder="المدينة / المنطقة / الحي"
          style={inp()} onFocus={foc} onBlur={blr}/>
      </div>

      {/* Photo upload */}
      <div style={{marginBottom:14}}>
        <label style={lbl}>صور الإعلان</label>
        <div style={{border:`1.5px dashed ${t.borderMed}`,borderRadius:11,
          padding:"20px",textAlign:"center",background:t.card,cursor:"pointer"}}>
          <Svg d={ic.cam} s={26} c={t.textMuted}/>
          <div style={{color:t.textMuted,fontSize:12,marginTop:8}}>اضغط لإضافة صور</div>
          <div style={{color:t.textHint,fontSize:10,marginTop:3}}>JPG · PNG · حتى 5MB لكل صورة</div>
        </div>
      </div>

      {/* Toggles */}
      {[
        {val:urgent,set:setUrgent,label:"إعلان عاجل",sub:"يظهر في مقدمة النتائج"},
        {val:nego,  set:setNego,  label:"قابل للتفاوض",sub:"السعر قابل للمناقشة"},
      ].map((tog,i)=>(
        <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          background:t.card,border:`1px solid ${t.border}`,borderRadius:10,
          padding:"12px 14px",marginBottom:8}}>
          <div>
            <div style={{color:t.text,fontSize:13,fontWeight:600}}>{tog.label}</div>
            <div style={{color:t.textMuted,fontSize:11,marginTop:1}}>{tog.sub}</div>
          </div>
          <button onClick={()=>tog.set(!tog.val)}
            style={{width:44,height:24,borderRadius:12,
              background:tog.val?C.blue:t.surface,
              border:`1px solid ${tog.val?C.blue:t.borderMed}`,
              cursor:"pointer",transition:"all 0.2s",position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",top:2,
              left:tog.val?20:2,width:20,height:20,
              borderRadius:10,background:"#fff",
              transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
          </button>
        </div>
      ))}

      {/* Contact method */}
      <div style={{marginBottom:22}}>
        <label style={{...lbl,marginTop:6}}>طريقة التواصل</label>
        <div style={{display:"flex",gap:8,direction:"rtl"}}>
          {[{k:"both",l:"كلاهما"},{k:"chat",l:"دردشة فقط"},{k:"phone",l:"هاتف فقط"}].map(c=>(
            <button key={c.k} onClick={()=>setContact(c.k)}
              style={{flex:1,padding:"9px 6px",borderRadius:9,textAlign:"center",
                border:`1.5px solid ${contact===c.k?C.blue:t.border}`,
                background:contact===c.k?t.blueBg:t.card,
                color:contact===c.k?C.blue:t.textSec,
                fontSize:12,fontWeight:contact===c.k?700:500,cursor:"pointer",transition:"all 0.15s"}}>
              {c.l}
            </button>
          ))}
        </div>
      </div>

      <button onClick={()=>valid&&handlePublish()}
        style={{width:"100%",
          background:valid?C.blue:t.card,
          border:`1px solid ${valid?C.blue:t.border}`,
          color:valid?"#fff":t.textMuted,
          borderRadius:11,padding:"14px",fontSize:14,fontWeight:700,
          cursor:valid?"pointer":"not-allowed",
          transition:"all 0.2s",letterSpacing:0.2,
          boxShadow:valid?`0 4px 16px ${C.blue}44`:"none"}}>
        نشر الإعلان الآن
      </button>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: CHATS (full — list + detail)
═══════════════════════════════════════════ */
interface ChatsScreenProps {
  t: ThemeType;
  dark: boolean;
}

const ChatsScreen = ({t,dark}: ChatsScreenProps)=>{
  const [open,setOpen]=useState<string | null>(null);
  const [threads,setThreads]=useState<Record<string, ChatMessage[]>>(
    Object.fromEntries(CHATS_DATA.map(c=>[c.id,c.msgs]))
  );
  const [input,setInput]=useState("");
  const [tab,setTab]=useState("all");
  const endRef=useRef<HTMLDivElement | null>(null);

  useEffect(()=>{
    endRef.current?.scrollIntoView({behavior:"smooth"});
  },[open,threads]);

  const sendMsg=()=>{
    if(!input.trim()||!open)return;
    const newMsg={id:Date.now(),from:"me",text:input.trim(),t:"الآن"};
    setThreads(prev=>({...prev,[open]:[...(prev[open]||[]),newMsg]}));
    setInput("");
  };

  /* ── CHAT DETAIL ── */
  if(open){
    const chat=CHATS_DATA.find(c=>c.id===open);
    const thread=threads[open]||[];
    if (chat) {
      return(
        <div style={{display:"flex",flexDirection:"column",height:"calc(100dvh - 116px)"}}>
          {/* Header */}
          <div style={{display:"flex",alignItems:"center",gap:10,
            padding:"10px 14px",background:t.surface,
            borderBottom:`1px solid ${t.border}`,flexShrink:0,direction:"rtl"}}>
            <button onClick={()=>setOpen(null)}
              style={{background:"none",border:"none",cursor:"pointer",
                padding:"6px",borderRadius:8,display:"flex",alignItems:"center"}}>
              <Svg d={ic.chevR} s={20} c={t.text}/>
            </button>
            <Avatar letter={chat.init} size={40} online={chat.online}/>
            <div style={{flex:1,textAlign:"right"}}>
              <div style={{color:t.text,fontSize:14,fontWeight:700}}>{chat.name}</div>
              <div style={{color:t.textMuted,fontSize:11}}>{chat.job}</div>
            </div>
            <div style={{display:"flex",gap:4}}>
              <button style={{width:34,height:34,borderRadius:9,background:t.card,
                border:`1px solid ${t.border}`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Svg d={ic.phone} s={15} c={t.textSec}/>
              </button>
              <button style={{width:34,height:34,borderRadius:9,background:t.card,
                border:`1px solid ${t.border}`,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>
                <Svg d={ic.dots} s={15} c={t.textSec}/>
              </button>
            </div>
          </div>

          {/* Ad reference chip */}
          <div style={{background:t.blueBg,borderBottom:`1px solid ${t.blueBorder}`,
            padding:"8px 14px",direction:"rtl"}}>
            <span style={{color:C.blue,fontSize:11,fontWeight:600}}>
              📋 {chat.job}
            </span>
          </div>

          {/* Messages */}
          <div style={{flex:1,overflowY:"auto",padding:"14px",
            display:"flex",flexDirection:"column",gap:8,scrollbarWidth:"none"}}>
            <div style={{textAlign:"center",margin:"4px 0"}}>
              <span style={{color:t.textMuted,fontSize:10,background:t.card,
                padding:"3px 14px",borderRadius:99,border:`1px solid ${t.border}`}}>اليوم</span>
            </div>
            {thread.map(m=>{
              const mine=m.from==="me";
              return(
                <div key={m.id} style={{display:"flex",
                  justifyContent:mine?"flex-start":"flex-end",direction:"rtl"}}>
                  {!mine&&<Avatar letter={chat.init} size={28} style={{marginLeft:6}}/>}
                  <div style={{maxWidth:"75%",
                    background:mine
                      ?C.blue
                      :(dark?t.elevated:t.card),
                    border:mine?"none":`1px solid ${t.border}`,
                    borderRadius:mine?"16px 4px 16px 16px":"4px 16px 16px 16px",
                    padding:"9px 13px",
                    marginLeft:mine?0:6,marginRight:mine?6:0}}>
                    <p style={{color:mine?"#fff":t.text,
                      fontSize:13,margin:"0 0 4px",lineHeight:1.55,direction:"rtl"}}>{m.text}</p>
                    <span style={{color:mine?"rgba(255,255,255,0.6)":t.textMuted,fontSize:9}}>{m.t}</span>
                  </div>
                </div>
              );
            })}
            <div ref={endRef}/>
          </div>

          {/* Input bar */}
          <div style={{padding:"8px 12px 10px",background:t.surface,
            borderTop:`1px solid ${t.border}`,display:"flex",
            gap:8,alignItems:"flex-end",flexShrink:0}}>
            <button onClick={sendMsg}
              style={{width:40,height:40,borderRadius:11,flexShrink:0,
                background:input.trim()?C.blue:t.card,
                border:`1px solid ${input.trim()?C.blue:t.border}`,
                cursor:"pointer",display:"flex",alignItems:"center",
                justifyContent:"center",transition:"all 0.15s"}}>
              <Svg d={ic.send} s={16} c={input.trim()?"#fff":t.textMuted}/>
            </button>
            <div style={{flex:1,background:t.card,border:`1px solid ${t.border}`,
              borderRadius:11,padding:"10px 13px",
              display:"flex",alignItems:"center",
              minHeight:40,transition:"border-color 0.15s"}}>
              <input value={input}
                onChange={e=>setInput(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&sendMsg()}
                placeholder="اكتب رسالتك..."
                style={{flex:1,background:"none",border:"none",
                  color:t.text,fontSize:13,outline:"none",
                  direction:"rtl",fontFamily:"inherit"}}/>
            </div>
          </div>
        </div>
      );
    }
  }

  /* ── CHATS LIST ── */
  const totalUnread=CHATS_DATA.reduce((a,c)=>a+c.unread,0);
  return(
    <div style={{paddingBottom:100}}>
      {/* Header */}
      <div style={{padding:"12px 16px 10px",direction:"rtl",
        borderBottom:`1px solid ${t.border}`,background:t.surface}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <h2 style={{color:t.text,fontSize:17,fontWeight:800,margin:0}}>
            الدردشات
            {totalUnread>0&&<span style={{marginRight:8,background:C.blue,color:"#fff",
              fontSize:10,fontWeight:700,padding:"1px 7px",borderRadius:99}}>{totalUnread}</span>}
          </h2>
          <button style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:9,
            padding:"6px 10px",display:"flex",alignItems:"center",gap:5,cursor:"pointer"}}>
            <Svg d={ic.filter} s={13} c={t.textSec}/>
            <span style={{color:t.textSec,fontSize:11}}>فلتر</span>
          </button>
        </div>
        {/* Tabs */}
        <div style={{display:"flex",gap:6}}>
          {[{k:"all",l:"الكل"},{k:"buy",l:"شراء"},{k:"sell",l:"بيع"}].map((tb)=>(
            <button key={tb.k} onClick={()=>setTab(tb.k)}
              style={{padding:"6px 16px",borderRadius:99,
                border:`1.5px solid ${tab===tb.k?C.blue:t.border}`,
                background:tab===tb.k?t.blueBg:t.card,
                color:tab===tb.k?C.blue:t.textSec,
                fontSize:11,fontWeight:tab===tb.k?700:500,cursor:"pointer",transition:"all 0.15s"}}>
              {tb.l}
            </button>
          ))}
        </div>
      </div>

      {CHATS_DATA.map((c)=>(
        <button key={c.id} onClick={()=>setOpen(c.id)}
          style={{width:"100%",display:"flex",alignItems:"center",gap:12,
            padding:"13px 16px",background:"none",border:"none",
            borderBottom:`1px solid ${t.border}`,cursor:"pointer",
            direction:"rtl",transition:"background 0.12s",textAlign:"right"}}
          onMouseEnter={e=>e.currentTarget.style.background=t.cardHover}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>
          <Avatar letter={c.init} size={48} online={c.online}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",justifyContent:"space-between",
              alignItems:"center",marginBottom:4}}>
              <span style={{color:t.textMuted,fontSize:10}}>{c.t}</span>
              <span style={{color:t.text,fontSize:14,fontWeight:700}}>{c.name}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              {c.unread>0
                ?<div style={{width:18,height:18,borderRadius:9,background:C.blue,
                    display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                    <span style={{color:"#fff",fontSize:9,fontWeight:700}}>{c.unread}</span>
                  </div>
                :<span/>
              }
              <span style={{color:c.unread>0?t.text:t.textMuted,fontSize:12,
                overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",
                fontWeight:c.unread>0?600:400}}>{c.last}</span>
            </div>
            <div style={{color:t.textMuted,fontSize:10,marginTop:3,
              overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              📋 {c.job}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: JOB DETAIL
═══════════════════════════════════════════ */
interface JobDetailProps {
  job: Job;
  t: ThemeType;
  dark: boolean;
  onBack: () => void;
  onChat: () => void;
  onRate: (rating: number) => void;
  likedJobIds: number[];
  setLikedJobIds: React.Dispatch<React.SetStateAction<number[]>>;
  appliedJobIds: number[];
  setAppliedJobIds: React.Dispatch<React.SetStateAction<number[]>>;
}

const JobDetail=({
  job,
  t,
  dark,
  onBack,
  onChat,
  onRate,
  likedJobIds,
  setLikedJobIds,
  appliedJobIds,
  setAppliedJobIds
}: JobDetailProps)=>{
  const liked = likedJobIds.includes(job.id);
  const applied = appliedJobIds.includes(job.id);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
    };
  }, []);

  const handleApplyToggle = () => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }

    if (!applied) {
      setAppliedJobIds(prev => [...prev, job.id]);
      setShowToast(true);
      toastTimeoutRef.current = window.setTimeout(() => {
        setShowToast(false);
      }, 4000);
    } else {
      setAppliedJobIds(prev => prev.filter(id => id !== job.id));
      setShowToast(false);
    }
  };

  const cat=CATS.find(c=>c.id===job.catId);
  const isWork=job.type==="need-worker";

  // Generate deterministic phone number and WhatsApp url
  const cleanPhone = React.useMemo(() => {
    const numericSuffix = (10000000 + (job.id * 7359) % 90000000).toString(); // 8 digits
    return `201${(job.id % 3) === 0 ? "0" : ((job.id % 3) === 1 ? "1" : "2")}${numericSuffix}`;
  }, [job.id]);

  const whatsappUrl = React.useMemo(() => {
    const whatsappText = `مرحباً ${job.pName}، أنا مهتم بخصوص إعلانك: "${job.title}" على منصة أرزاق.`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(whatsappText)}`;
  }, [cleanPhone, job.pName, job.title]);

  const [ratingVal, setRatingVal] = useState(0);
  const [hoverVal, setHoverVal] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [commentText, setCommentText] = useState("");
  const [isRated, setIsRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  return(
    <div style={{paddingBottom:110}}>
      {/* Nav bar */}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
        padding:"10px 14px",background:t.surface,borderBottom:`1px solid ${t.border}`,
        position:"sticky",top:0,zIndex:40}}>
        <button onClick={() => {
          if (liked) {
            setLikedJobIds(prev => prev.filter(id => id !== job.id));
          } else {
            setLikedJobIds(prev => [...prev, job.id]);
          }
        }}
          style={{width:36,height:36,borderRadius:9,background:t.card,
            border:`1px solid ${t.border}`,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Svg d={ic.heart} s={17} c={liked?C.red:t.textMuted} f={liked?C.red:"none"}/>
        </button>
        <span style={{color:t.text,fontSize:14,fontWeight:700}}>تفاصيل الإعلان</span>
        <button onClick={onBack}
          style={{width:36,height:36,borderRadius:9,background:t.card,
            border:`1px solid ${t.border}`,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center"}}>
          <Svg d={ic.chevR} s={17} c={t.text}/>
        </button>
      </div>

      <div style={{padding:"16px 14px",direction:"rtl"}}>
        {/* Cat + Title block */}
        <div style={{display:"flex",gap:13,alignItems:"flex-start",marginBottom:14}}>
          <div style={{width:52,height:52,borderRadius:14,background:t.blueBg,
            border:`1px solid ${t.blueBorder}`,display:"flex",
            alignItems:"center",justifyContent:"center",fontSize:24,flexShrink:0}}>
            {cat?.emoji}
          </div>
          <div style={{flex:1}}>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
              <Tag color={isWork?C.blue:C.green} bg={isWork?t.blueBg:t.greenBg}
                border={isWork?t.blueBorder:""} dot>
                {isWork?"يطلب عامل":"يبحث عن عمل"}
              </Tag>
              {job.urgent&&<Tag color={C.orange} bg={C.orangeBg}>⚡ عاجل</Tag>}
              {job.verified&&<Tag color={t.textMuted} bg={t.card} border={t.border}>✓ موثق</Tag>}
            </div>
            <h1 style={{color:t.text,fontSize:16,fontWeight:800,margin:"0 0 4px",lineHeight:1.4}}>{job.title}</h1>
            <span style={{color:t.textMuted,fontSize:11}}>{cat?.ar}</span>
          </div>
        </div>

        {/* Price + stats row */}
        <div style={{background:t.blueBg,border:`1px solid ${t.blueBorder}`,
          borderRadius:12,padding:"14px 16px",marginBottom:12,
          display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.blue,fontSize:22,fontWeight:900,
              letterSpacing:-0.5,direction:"rtl",lineHeight:1.1}}>
              {job.price.toLocaleString()}
              <span style={{fontSize:13,fontWeight:600}}> ج.م</span>
            </div>
            <div style={{color:t.textMuted,fontSize:11,marginTop:2}}>{job.unit}</div>
          </div>
          <div style={{display:"flex",gap:20}}>
            <div style={{textAlign:"center"}}>
              <div style={{color:t.text,fontSize:14,fontWeight:700}}>{job.views}</div>
              <div style={{color:t.textMuted,fontSize:10}}>مشاهدة</div>
            </div>
            {isWork&&<div style={{textAlign:"center"}}>
              <div style={{color:t.text,fontSize:14,fontWeight:700}}>{job.apps}</div>
              <div style={{color:t.textMuted,fontSize:10}}>متقدم</div>
            </div>}
            <div style={{textAlign:"center"}}>
              <div style={{color:C.orange,fontSize:14,fontWeight:700}}>★ {job.stars > 0 ? job.stars.toFixed(1) : "جديد"}</div>
              <div style={{color:t.textMuted,fontSize:10}}>{job.stars > 0 ? `${job.ratingCount || 12} تقييم` : "بدون تقييم"}</div>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div style={{background:t.card,border:`1px solid ${t.border}`,
          borderRadius:12,overflow:"hidden",marginBottom:12}}>
          {[
            {icon:ic.pin,  label:"الموقع",    val:job.loc},
            {icon:ic.clock,label:"وقت النشر", val:job.age},
          ].map((r,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",
              alignItems:"center",padding:"12px 14px",
              borderBottom:i===0?`1px solid ${t.border}`:"none"}}>
              <span style={{color:t.text,fontSize:13,fontWeight:600}}>{r.val}</span>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <span style={{color:t.textMuted,fontSize:12}}>{r.label}</span>
                <Svg d={r.icon} s={14} c={t.textMuted}/>
              </div>
            </div>
          ))}
        </div>

        {/* ── Mini Map Card ── */}
        <div style={{background:t.card,border:`1px solid ${t.border}`,
          borderRadius:12,padding:"14px",marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
            <span style={{color:t.textSec,fontSize:11,fontWeight:600}}>الإحداثيات التقريبية للموقع</span>
            <span style={{color:t.text,fontSize:13,fontWeight:700}}>خريطة المنطقة</span>
          </div>
          
          <div style={{height:140,borderRadius:10,background:dark?"#111B2C":"#E0E5EC",
            position:"relative",overflow:"hidden",border:`1px solid ${t.border}`}}>
            
            {/* Simulated layout grids / streets */}
            <svg width="100%" height="100%" style={{position:"absolute",top:0,left:0,opacity:dark?0.35:0.65}}>
              {/* Rivers or major highways */}
              <path d="M-20,40 Q150,80 300,50" stroke={dark?"#1E3A5F":"#93C5FD"} strokeWidth="12" fill="none" />
              <path d="M120,-20 Q180,60 220,180" stroke={dark?"#2A4E7F":"#BFDBFE"} strokeWidth="8" fill="none" />
              
              {/* Streets */}
              <line x1="0" y1="20" x2="480" y2="20" stroke={dark?"#1D2A44":"#F3F4F6"} strokeWidth="5" />
              <line x1="0" y1="100" x2="480" y2="100" stroke={dark?"#1D2A44":"#F3F4F6"} strokeWidth="4" />
              <line x1="60" y1="0" x2="60" y2="140" stroke={dark?"#1D2A44":"#F3F4F6"} strokeWidth="4" />
              <line x1="240" y1="0" x2="240" y2="140" stroke={dark?"#1D2A44":"#F3F4F6"} strokeWidth="5" />
              
              {/* Minor streets */}
              <line x1="0" y1="65" x2="480" y2="65" stroke={dark?"#18233C":"#E5E7EB"} strokeWidth="1.5" strokeDasharray="4,4" />
              <line x1="160" y1="0" x2="160" y2="140" stroke={dark?"#18233C":"#E5E7EB"} strokeWidth="1.5" />
            </svg>
            
            {/* Animated Radar Pulse around Marker */}
            <div style={{
              position:"absolute",top:"50%",left:"50%",transform:"translate(-50%, -50%)",
              display:"flex",alignItems:"center",justifyContent:"center"
            }}>
              {/* Outer pulsing ring */}
              <div style={{
                position:"absolute",width:46,height:46,borderRadius:"50%",
                background:`${C.blue}20`,border:`1.5px solid ${C.blue}`,
              }} className="animate-ping" />
              
              {/* Inner rotating dashed compass grid */}
              <div style={{
                position:"absolute",width:80,height:80,borderRadius:"50%",
                background:`${C.blue}08`,border:`1px dashed ${C.blue}44`,
              }} className="animate-spin" />
              
              {/* Pin Marker */}
              <div style={{
                position:"absolute",transform:"translateY(-12px)",zIndex:10,
                filter:"drop-shadow(0 4px 6px rgba(0,0,0,0.3))"
              }}>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 13.5 12 22 12 22C12 22 19 13.5 19 9C19 5.13 15.87 2 12 2Z" fill={C.blue} stroke="#ffffff" strokeWidth="1.5"/>
                  <circle cx="12" cy="9" r="3.5" fill="#ffffff" />
                </svg>
              </div>
            </div>
            
            {/* Map Controls Overlay */}
            <div style={{position:"absolute",top:8,right:8,display:"flex",flexDirection:"column",gap:4}}>
              <button style={{width:24,height:24,borderRadius:4,background:t.elevated,color:t.text,
                border:`1px solid ${t.border}`,fontSize:14,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>+</button>
              <button style={{width:24,height:24,borderRadius:4,background:t.elevated,color:t.text,
                border:`1px solid ${t.border}`,fontSize:14,fontWeight:700,cursor:"pointer",
                display:"flex",alignItems:"center",justifyContent:"center"}}>-</button>
            </div>
            
            {/* Location badge on map */}
            <div style={{position:"absolute",top:8,left:8,background:"rgba(11, 17, 32, 0.75)",
              backdropFilter:"blur(4px)",padding:"3px 8px",borderRadius:6,border:"1px solid rgba(255,255,255,0.15)"}}>
              <span style={{color:"#fff",fontSize:10,fontWeight:600}}>{job.loc}</span>
            </div>
            
            {/* Compass scale layout */}
            <div style={{position:"absolute",bottom:8,left:8,background:"rgba(11, 17, 32, 0.65)",
              padding:"2px 6px",borderRadius:4,color:"#fff",fontSize:8,fontFamily:"monospace"}}>
              {job.loc.includes("طنطا") ? "30.788° N, 31.001° E" : job.loc.includes("أكتوبر") ? "29.972° N, 30.949° E" : "30.026° N, 31.491° E"}
            </div>
          </div>
          
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:8,direction:"rtl"}}>
            <span style={{color:t.textMuted,fontSize:11}}>
              دقة التقريب: نصف قطر ١٠٠م من {job.loc}
            </span>
            <button style={{background:"none",border:"none",color:C.blue,fontSize:11,fontWeight:700,
              cursor:"pointer",display:"flex",alignItems:"center",gap:3,padding:0}}>
              رؤية في خرائط Google
              <Svg d={ic.share} s={11} c={C.blue}/>
            </button>
          </div>
        </div>

        {/* Description */}
        <div style={{marginBottom:12}}>
          <div style={{color:t.textSec,fontSize:12,fontWeight:600,
            marginBottom:7,letterSpacing:0.4}}>الوصف</div>
          <p style={{color:t.text,fontSize:13,lineHeight:1.75,margin:0}}>{job.desc}</p>
        </div>

        <Div t={t} my={6}/>

        {/* Safety box */}
        <div style={{background:t.orangeBg,border:"1px solid rgba(245,158,11,0.2)",
          borderRadius:12,padding:"13px 14px",marginBottom:12}}>
          <div style={{color:C.orange,fontSize:12,fontWeight:700,marginBottom:7}}>
            ⚠️ نصائح السلامة
          </div>
          {["تقابل فقط في الأماكن العامة","لا تدفع أي مبلغ قبل فحص العمل",
            "تحقق من هوية العامل قبل الاتفاق"].map((s,i)=>(
            <div key={i} style={{color:C.orange,fontSize:11,opacity:0.9,
              marginBottom:3,direction:"rtl",paddingRight:10,position:"relative"}}>
              ← {s}
            </div>
          ))}
        </div>

        {/* ── INTERACTIVE RATING WIDGET (5-STARS) ── */}
        <div style={{
          background: t.card,
          border: `1.5px solid ${isRated ? C.green : t.border}`,
          borderRadius: 12,
          padding: "16px 14px",
          marginBottom: 12,
          position: "relative",
          overflow: "hidden"
        }}>
          {isRated ? (
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: C.greenBg, border: `1.5px solid ${C.green}`,
                display: "flex", alignItems: "center", justifyItems: "center",
                justifyContent: "center", margin: "0 auto 10px"
              }}>
                <Svg d={ic.check} s={20} c={C.green} sw={3} />
              </div>
              <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: "0 0 6px" }}>تم إرسال تقييمك بنجاح!</h4>
              <p style={{ color: t.textSec, fontSize: 11, lineHeight: 1.5, margin: "0 0 10px" }}>
                شكراً لمشاركتك! لقد ساعدت في توثيق جدارة وأمانة العامل <strong>{job.pName}</strong> ودعم مجتمع أرزاق للخدمات.
              </p>
              
              <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 12 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Svg key={s} d={ic.star} s={16} c={C.orange} f={s <= ratingVal ? C.orange : "none"} />
                ))}
              </div>

              {selectedTags.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 8 }}>
                  {selectedTags.map((tag, idx) => (
                    <span key={idx} style={{
                      fontSize: 10, background: t.blueBg, color: C.blue,
                      padding: "2px 8px", borderRadius: 99, fontWeight: 600
                    }}>{tag}</span>
                  ))}
                </div>
              )}
              
              {commentText && (
                <div style={{
                  background: t.surface, border: `1px solid ${t.border}`,
                  padding: "8px 10px", borderRadius: 8, fontSize: 11,
                  color: t.textSec, display: "inline-block", maxWidth: "90%",
                  fontStyle: "italic"
                }}>
                  "{commentText}"
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ color: t.textMuted, fontSize: 10, fontWeight: 700 }}>نظام التقييم السريع</span>
                <span style={{ color: t.text, fontSize: 13, fontWeight: 800 }}>⭐ تقييم جودة العمل ونجمية الخدمة</span>
              </div>
              
              <p style={{ color: t.textSec, fontSize: 11, lineHeight: 1.4, margin: "0 0 12px" }}>
                هل أكملت العمل مع <strong>{job.pName}</strong>؟ يمكنك مراجعة وتقييم أدائه بسبل تفاعلية سريعة.
              </p>

              {/* Stars container */}
              <div style={{ display: "flex", justifyContent: "center", gap: 10, margin: "8px 0 14px", direction: "ltr" }}>
                {[1, 2, 3, 4, 5].map((star) => {
                  const isHighlighted = star <= (hoverVal || ratingVal);
                  return (
                    <button
                      key={star}
                      onMouseEnter={() => setHoverVal(star)}
                      onMouseLeave={() => setHoverVal(0)}
                      onClick={() => setRatingVal(star)}
                      style={{
                        background: "none", border: "none", padding: 0, cursor: "pointer",
                        transform: (hoverVal === star || ratingVal === star) ? "scale(1.15)" : "scale(1)",
                        transition: "transform 0.15s"
                      }}
                    >
                      <Svg d={ic.star} s={28}
                        c={isHighlighted ? C.orange : (dark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)")}
                        f={isHighlighted ? C.orange : "none"} sw={1.6} />
                    </button>
                  );
                })}
              </div>

              {ratingVal > 0 && (
                <div style={{ animation: "fadeIn 0.2s" }}>
                  <div style={{ color: t.text, fontSize: 11, fontWeight: 700, marginBottom: 8, marginTop: 10 }}>
                    ميزات تميز بها {job.pName}:
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 12 }}>
                    {[
                      "⏱️ التزام صارم بالوقت",
                      "🧼 جودة ونظافة مذهلة",
                      "💼 أمانة وخلق دمث",
                      "💰 سعر عادل ومناسب للخدمة",
                      "🤝 حرفية ومعدات ممتازة"
                    ].map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setSelectedTags(prev => prev.filter(t => t !== tag));
                            } else {
                              setSelectedTags(prev => [...prev, tag]);
                            }
                          }}
                          style={{
                            background: isSelected ? t.blueBg : t.card,
                            color: isSelected ? C.blue : t.textSec,
                            border: `1.5px solid ${isSelected ? C.blue : t.border}`,
                            borderRadius: 99, padding: "5px 10px", fontSize: 10,
                            fontWeight: 600, cursor: "pointer"
                          }}
                        >
                          {tag} {isSelected && "✓"}
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ color: t.text, fontSize: 11, fontWeight: 700, marginBottom: 6 }}>تعليق مختصر (اختياري):</div>
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="شارك أفراد المجتمع بكلمة شكر أو نصيحة..."
                    style={{
                      width: "100%", height: 50, background: t.surface,
                      border: `1px solid ${t.border}`, borderRadius: 8,
                      padding: "8px 10px", color: t.text, fontSize: 12,
                      fontFamily: "inherit", resize: "none", outline: "none",
                      marginBottom: 12
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setIsSubmitting(true);
                      setTimeout(() => {
                        setIsSubmitting(false);
                        setIsRated(true);
                        onRate(ratingVal);
                      }, 600);
                    }}
                    style={{
                      width: "100%", background: C.blue, border: "none",
                      color: "#fff", borderRadius: 8, padding: "10px 0",
                      fontSize: 12, fontWeight: 700, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6
                    }}
                  >
                    {isSubmitting ? (
                      <div className="animate-spin" style={{
                        width: 14, height: 14, border: "2px solid #fff",
                        borderTopColor: "transparent", borderRadius: "50%"
                      }} />
                    ) : (
                      <>
                        <span>إرسال التقييم وتأكيد الإتمام</span>
                        <Svg d={ic.send} s={12} c="#fff" />
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Poster */}
        <div style={{background:t.card,border:`1px solid ${t.border}`,
          borderRadius:12,padding:"13px 14px"}}>
          <div style={{color:t.textMuted,fontSize:10,letterSpacing:0.5,marginBottom:9}}>
            نشر بواسطة
          </div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Avatar letter={job.poster[0]} size={44}/>
            <div style={{flex:1,textAlign:"right"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,flexWrap:"wrap"}}>
                <div style={{color:t.text,fontSize:14,fontWeight:700}}>{job.pName}</div>
                {/* Average rating next to worker's name */}
                <div style={{
                  display:"flex",alignItems:"center",gap:3,
                  background:t.orangeBg,padding:"2px 8px",borderRadius:6,
                  border: `1px solid rgba(245, 158, 11, 0.2)`
                }}>
                  <span style={{color:C.orange,fontSize:11,fontWeight:800}}>★ {job.stars > 0 ? job.stars.toFixed(1) : "جديد"}</span>
                  <span style={{color:t.textSec,fontSize:9,fontWeight:600}}>({job.ratingCount || (job.stars > 0 ? 12 : 0)})</span>
                </div>
              </div>
              <div style={{color:t.textMuted,fontSize:11,marginTop:2}}>
                عضو منذ 2022 · طنطا، الغربية
              </div>
            </div>
            {job.verified&&<Tag color={t.textMuted} bg={t.surface} border={t.border}>✓ موثق</Tag>}
          </div>
        </div>
      </div>

      {/* ── TOAST ALERT FOR SUCCESSFUL APPLICATION ── */}
      {showToast && (
        <div className="animate-slideDown" style={{
          position: "fixed",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          background: "#10B981", // Emerald Green
          color: "#ffffff",
          boxShadow: "0 10px 25px -5px rgba(16, 185, 129, 0.4), 0 8px 10px -6px rgba(16, 185, 129, 0.4)",
          padding: "12px 16px",
          borderRadius: 12,
          zIndex: 9999,
          width: "calc(100% - 32px)",
          maxWidth: 440,
          direction: "rtl",
          display: "flex",
          alignItems: "center",
          gap: 12,
          border: "1px solid rgba(255,255,255,0.2)"
        }}>
          <div style={{
            background: "rgba(255,255,255,0.2)",
            width: 28,
            height: 28,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0
          }}>
            <Svg d={ic.check} s={15} c="#fff" sw={3} />
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <div style={{ fontSize: 13, fontWeight: 800, lineHeight: 1.4 }}>تم التقديم بنجاح!</div>
            <div style={{ fontSize: 11, fontWeight: 500, opacity: 0.9, marginTop: 1 }}>تم إرسال طلبك بنجاح لصاحب العمل.</div>
          </div>
          <button onClick={() => setShowToast(false)} style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#fff",
            opacity: 0.7,
            fontSize: 16,
            padding: 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <span>×</span>
          </button>
        </div>
      )}

      {/* CTA bottom bar */}
      <div style={{position:"fixed",bottom:0,left:0,right:0,maxWidth:480,
        margin:"0 auto",padding:"10px 12px 14px",
        background:t.surface,borderTop:`1px solid ${t.border}`,
        display:"flex",gap:8,zIndex:100}}>
        
        {/* Call Button */}
        <a href={`tel:${cleanPhone}`} style={{
          flex: 1,
          background: t.card,
          border: `1px solid ${t.borderMed}`,
          color: t.text,
          borderRadius: 10,
          padding: "12px 6px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          textDecoration: "none",
          textAlign: "center"
        }}>
          <Svg d={ic.phone} s={14} c={t.text}/>
          <span>اتصال</span>
        </a>

        {/* WhatsApp Button */}
        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" style={{
          flex: 1.2,
          background: "#25D366",
          border: "none",
          color: "#fff",
          borderRadius: 10,
          padding: "12px 6px",
          fontSize: 12,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          textDecoration: "none",
          textAlign: "center",
          boxShadow: "0 3px 10px rgba(37, 211, 102, 0.3)"
        }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0, color: "#fff" }}>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.455 5.71 1.456h.006c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413"/>
          </svg>
          <span>واتساب</span>
        </a>

        {/* Apply Button */}
        <button onClick={handleApplyToggle}
          style={{
            flex: 1.5,
            background: applied?C.green:C.blue,
            border: "none",
            color: "#fff",
            borderRadius: 10,
            padding: "12px 6px",
            fontSize: 12,
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 4,
            transition: "background 0.2s",
            boxShadow: `0 3px 10px ${applied?C.green:C.blue}44`
          }}>
          <Svg d={applied?ic.check:ic.chat} s={14} c="#fff"/>
          <span>{applied?"تم التقديم ✓":"تقدم للوظيفة"}</span>
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCREEN: PROFILE
═══════════════════════════════════════════ */
interface ProfileScreenProps {
  t: ThemeType;
  dark: boolean;
  toggle: () => void;
  profile: any;
  setProfile: React.Dispatch<React.SetStateAction<any>>;
  likedJobIds: number[];
  setLikedJobIds: React.Dispatch<React.SetStateAction<number[]>>;
  appliedJobIds: number[];
  setAppliedJobIds: React.Dispatch<React.SetStateAction<number[]>>;
  jobsList: Job[];
  setJobsList: React.Dispatch<React.SetStateAction<Job[]>>;
  onViewJob: (job: Job) => void;
  walletTransactions: any[];
  setWalletTransactions: React.Dispatch<React.SetStateAction<any[]>>;
  privacySettings: any;
  setPrivacySettings: React.Dispatch<React.SetStateAction<any>>;
  notifSettings: any;
  setNotifSettings: React.Dispatch<React.SetStateAction<any>>;
  isLoggedOut: boolean;
  setIsLoggedOut: (value: boolean) => void;
}

const ProfileScreen=({
  t,
  dark,
  toggle,
  profile,
  setProfile,
  likedJobIds,
  setLikedJobIds,
  appliedJobIds,
  setAppliedJobIds,
  jobsList,
  setJobsList,
  onViewJob,
  walletTransactions,
  setWalletTransactions,
  privacySettings,
  setPrivacySettings,
  notifSettings,
  setNotifSettings,
  isLoggedOut,
  setIsLoggedOut
}: ProfileScreenProps)=>{
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  // Stats
  const myAds = jobsList.filter(j => j.pName === profile.name || j.pName === "أبو ميرا");
  const favorites = jobsList.filter(j => likedJobIds.includes(j.id));
  const myApplications = jobsList.filter(j => appliedJobIds.includes(j.id));

  // State trackers for sub-views
  // Wallet
  const [depositAmt, setDepositAmt] = useState("");
  const [depositMethod, setDepositMethod] = useState("vodafone");
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [withdrawAmt, setWithdrawAmt] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("vodafone");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [walletError, setWalletError] = useState("");
  const [walletSuccess, setWalletSuccess] = useState("");

  // Edit Profile Form
  const [editName, setEditName] = useState(profile.name);
  const [editPhone, setEditPhone] = useState(profile.phone);
  const [editCity, setEditCity] = useState(profile.city);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editExp, setEditExp] = useState(profile.experience || "8 سنوات");
  const [editSkills, setEditSkills] = useState<string[]>(profile.skills);
  const [editSuccess, setEditSuccess] = useState(false);

  // Privacy & Security Form
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [pinSuccess, setPinSuccess] = useState(false);

  // Notifications alerts
  const [localNotifs, setLocalNotifs] = useState([
    { id: 1, text: `💸 تم شحن المحفظة بنجاح بمبلغ 200 ج.م`, date: "منذ ساعتين", icon: "✨" },
    { id: 2, text: `⭐ حصلت على تقييم 5 نجوم من أحمد الحريري للإصلاح المتميز`, date: "منذ يوم", icon: "🌟" },
    { id: 3, text: `📢 حصل إعلانك "سباك شاطر" على 12 مشاهدة جديدة هذا الأسبوع`, date: "منذ يومين", icon: "📈" },
    { id: 4, text: `🛡️ تم تدوين حماية الحساب بنجاح عبر الرقم المؤكد`, date: "منذ 4 أيام", icon: "🔒" },
  ]);

  const [activeRatingTab, setActiveRatingTab] = useState<"client" | "worker">("client");

  // Suspended ads tracker
  const [suspendedAds, setSuspendedAds] = useState<number[]>([]);

  const handleToggleSuspend = (jobId: number) => {
    if (suspendedAds.includes(jobId)) {
      setSuspendedAds(prev => prev.filter(id => id !== jobId));
    } else {
      setSuspendedAds(prev => [...prev, jobId]);
    }
  };

  const handleSetAdStatus = (jobId: number, status: "active" | "pending" | "completed") => {
    setJobsList(prev => prev.map(j => j.id === jobId ? { ...j, status } : j));
  };

  const handleDeleteAd = (jobId: number) => {
    if (confirm("هل أنت متأكد من رغبتك في حذف هذا الإعلان نهائياً؟")) {
      setJobsList(prev => prev.filter(j => j.id !== jobId));
    }
  };

  const handleSaveProfile = () => {
    setProfile({
      ...profile,
      name: editName,
      phone: editPhone,
      city: editCity,
      locationDetail: `${editCity}، مصر`,
      bio: editBio,
      skills: editSkills,
      experience: editExp
    });
    setEditSuccess(true);
    setTimeout(() => setEditSuccess(false), 3000);
  };

  const handleToggleSkill = (skill: string) => {
    if (editSkills.includes(skill)) {
      setEditSkills(prev => prev.filter(s => s !== skill));
    } else {
      setEditSkills(prev => [...prev, skill]);
    }
  };

  const ALL_SKILLS = ["تنظيف", "سباكة", "كهرباء", "دهانات", "نجارة", "تكييف", "حراسة مباني", "تنسيق حدائق", "نقل أثاث"];

  const handleAddDeposit = () => {
    const amt = parseFloat(depositAmt);
    if (isNaN(amt) || amt <= 0) {
      setWalletError("الرجاء إدخال مبلغ صحيح لشحن الرصيد.");
      return;
    }
    const methodNames: Record<string, string> = {
      vodafone: "فودافون كاش",
      instapay: "إنستا باي",
      credit: "بطاقة ائتمانية / ميزة"
    };
    setProfile((prev: any) => ({ ...prev, walletBalance: prev.walletBalance + amt }));
    setWalletTransactions((prev: any[]) => [
      {
        id: Date.now(),
        title: `شحن رصيد عبر ${methodNames[depositMethod] || "المحفظة"}`,
        amount: amt,
        type: "deposit",
        date: "الآن"
      },
      ...prev
    ]);
    setDepositAmt("");
    setShowDepositForm(false);
    setWalletError("");
    setWalletSuccess("تم شحن الرصيد بنجاح! الرصيد الجديد متاح الآن وموثق.");
    setTimeout(() => setWalletSuccess(""), 4000);
  };

  const handleWithdraw = () => {
    const amt = parseFloat(withdrawAmt);
    if (isNaN(amt) || amt <= 0) {
      setWalletError("الرجاء إدخال مبلغ سحب صحيح.");
      return;
    }
    if (amt > profile.walletBalance) {
      setWalletError("رصيدك الحالي غير كافٍ لإتمام هذه المعاملة.");
      return;
    }
    const methodNames: Record<string, string> = {
      vodafone: "فودافون كاش",
      instapay: "إنستا باي",
      credit: "حساب بنكي / ميزة"
    };
    setProfile((prev: any) => ({ ...prev, walletBalance: prev.walletBalance - amt }));
    setWalletTransactions((prev: any[]) => [
      {
        id: Date.now(),
        title: `طلب سحب رصيد إلى ${methodNames[withdrawMethod] || "المحفظة"}`,
        amount: -amt,
        type: "charge",
        date: "الآن"
      },
      ...prev
    ]);
    setWithdrawAmt("");
    setShowWithdrawForm(false);
    setWalletError("");
    setWalletSuccess("تم تسجيل طلب السحب بنجاح! يستغرق المعالجة عادة 15 دقيقة.");
    setTimeout(() => setWalletSuccess(""), 4000);
  };

  const handleUpdatePin = () => {
    if (!oldPin || !newPin) {
      alert("يرجى ملء الرمز القديم والجديد.");
      return;
    }
    setPinSuccess(true);
    setOldPin("");
    setNewPin("");
    setTimeout(() => setPinSuccess(false), 3500);
  };

  const menu=[
    {i:ic.list,  l:"إعلاناتي",       s:`${myAds.length} إعلانات منشورة`,      badge: myAds.length > 0 ? myAds.length.toString() : undefined, id: "my-ads"},
    {i:ic.heart, l:"المفضلة",         s:`${favorites.length} عناصر محفوظة`,     badge: favorites.length > 0 ? favorites.length.toString() : undefined, id: "favorites"},
    {i:ic.bag,   l:"الطلبات",         s:`${myApplications.length} طلبات تقدمت لها`, badge: myApplications.length > 0 ? myApplications.length.toString() : undefined, id: "orders"},
    {i:ic.star,  l:"التقييمات",       s:`متوسط تقييمك ★ ${profile.rating}`, id: "ratings"},
    {i:ic.wallet,l:"المحفظة",         s:`الرصيد: ${profile.walletBalance.toFixed(2)} ج.م`, id: "wallet"},
    {i:ic.edit,  l:"تعديل الملف",     s:"البيانات الشخصية والمهارات", id: "edit-profile"},
    {i:ic.shield,l:"الخصوصية والأمان",s:"تحديث الرمز السري وحالة الظهور", id: "privacy"},
    {i:ic.bell,  l:"الإشعارات",       s:"تفضيلات الإرسال ومراجعة التنبيهات", badge: localNotifs.length > 0 ? localNotifs.length.toString() : undefined, id: "notifications"},
  ];

  const chartData = React.useMemo(() => {
    const data = [];
    const adDays = [2, 10, 18, 27]; 
    for (let i = 29; i >= 0; i--) {
      const d = new Date(2026, 4, 23); 
      d.setDate(d.getDate() - i);
      const isAdDay = adDays.includes(29 - i);
      const adsCount = isAdDay ? 1 : 0;
      
      let viewsCount = 2; 
      if (29 - i >= 2 && 29 - i < 10) {
        viewsCount = Math.round(15 * Math.exp(-(29 - i - 2) * 0.15)) + 3;
      } else if (29 - i >= 10 && 29 - i < 18) {
        viewsCount = Math.round(22 * Math.exp(-(29 - i - 10) * 0.2)) + 4;
      } else if (29 - i >= 18 && 29 - i < 27) {
        viewsCount = Math.round(18 * Math.exp(-(29 - i - 18) * 0.18)) + 3;
      } else if (29 - i >= 27) {
        viewsCount = Math.round(35 * Math.exp(-(29 - i - 27) * 0.1)) + 5;
      }
      
      viewsCount = Math.max(1, viewsCount + Math.floor(Math.sin((29 - i) * 1.5) * 3));

      const monthsAr = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
      const fullDateStr = `${d.getDate()} ${monthsAr[d.getMonth()]} ${d.getFullYear()}`;

      data.push({
        date: `${d.getMonth() + 1}/${d.getDate()}`,
        fullDate: fullDateStr,
        "الإعلانات": adsCount,
        "المشاهدات": viewsCount
      });
    }
    return data;
  }, []);

  // Back to profile list helper
  const renderHeader = (title: string) => (
    <div style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "13px 14px",
      background: t.surface,
      borderBottom: `1px solid ${t.border}`,
      direction: "rtl"
    }}>
      <h3 style={{ color: t.text, fontSize: 15, fontWeight: 800, margin: 0 }}>{title}</h3>
      <button onClick={() => { setActiveSection(null); setWalletError(""); setWalletSuccess(""); }}
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: t.card,
          border: `1px solid ${t.border}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
        <Svg d={ic.chevR} s={16} c={t.text} />
      </button>
    </div>
  );

  // If we are in a sub-section modal / overlay
  if (activeSection) {
    return (
      <div style={{ paddingBottom: 110, animation: "fadeIn 0.2s", minHeight: "100%" }}>
        {activeSection === "my-ads" && (
          <div>
            {renderHeader("إعلاناتي المنشورة")}
            <div style={{ padding: 14, direction: "rtl" }}>
              {myAds.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px", color: t.textMuted }}>
                  <span style={{ fontSize: 40 }}>📢</span>
                  <p style={{ fontSize: 13, fontWeight: 700, marginTop: 12 }}>لا توجد لديك إعلانات بعد!</p>
                  <p style={{ fontSize: 11, maxWidth: 260, margin: "6px auto 0", lineHeight: 1.5 }}>
                    يمكنك نشر إعلان لطلب العمالة أو عرض خدماتك المهنية بضغطة زر (+) في الأسفل.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 11, color: t.textMuted, margin: "0 0 6px" }}>ادمج، عدل، أو عطل إعلاناتك المعروضة في التطبيق لتعديل رغباتك:</p>
                  {myAds.map(ad => {
                    const isSuspended = suspendedAds.includes(ad.id);
                    const currentStatus = ad.status || "active";
                    
                    // Set up badge status colors and labels
                    let statusLabel = "نشط";
                    let statusColor = C.green;
                    let statusBg = C.greenBg;
                    
                    if (isSuspended) {
                      statusLabel = "موقوف مؤقتاً";
                      statusColor = t.textMuted;
                      statusBg = t.border;
                    } else if (currentStatus === "pending") {
                      statusLabel = "قيد المراجعة";
                      statusColor = C.orange;
                      statusBg = C.orangeBg;
                    } else if (currentStatus === "completed") {
                      statusLabel = "مكتمل";
                      statusColor = C.blue;
                      statusBg = C.blue + "15";
                    }

                    return (
                      <div key={ad.id} style={{
                        background: t.card,
                        border: `1.5px solid ${isSuspended ? t.border : (currentStatus === "pending" ? C.orange : (currentStatus === "completed" ? C.blue : C.blue))}33`,
                        borderRadius: 12,
                        padding: 12,
                        opacity: isSuspended ? 0.65 : 1,
                        transition: "all 0.15s"
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                          <span style={{
                            background: statusBg,
                            color: statusColor,
                            fontSize: 9,
                            fontWeight: 800,
                            padding: "3px 8px",
                            borderRadius: 6,
                            display: "flex",
                            alignItems: "center",
                            gap: 4
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: "50%", background: statusColor, display: "inline-block" }}></span>
                            {statusLabel}
                          </span>
                          <span style={{ fontSize: 12, fontWeight: 800, color: C.green }}>{ad.price} ج.م {ad.unit}</span>
                        </div>
                        <h4 style={{ color: t.text, fontSize: 13, fontWeight: 700, margin: "6px 0 10px", textAlign: "right" }}>{ad.title}</h4>
                        <div style={{ display: "flex", gap: 15, fontSize: 10, color: t.textMuted, borderBottom: `1px solid ${t.border}`, paddingBottom: 10, marginBottom: 10, justifyContent: "flex-start" }}>
                          <span>👁️ {ad.views} مشاهدة</span>
                          <span>📩 {ad.apps} تطبيق</span>
                          <span>📍 {ad.loc}</span>
                        </div>

                        {/* Interactive Status Switcher (only when not suspended) */}
                        {!isSuspended && (
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            background: t.surface,
                            padding: "6px 10px",
                            borderRadius: 8,
                            border: `1px solid ${t.border}`,
                            marginBottom: 10,
                            direction: "rtl"
                          }}>
                            <span style={{ fontSize: 10, fontWeight: 800, color: t.textSec }}>حالة الإعلان:</span>
                            <div style={{ display: "flex", gap: 4 }}>
                              {[
                                { statusKey: "active", label: "نشط", color: C.green, bg: C.greenBg },
                                { statusKey: "pending", label: "مراجعة", color: C.orange, bg: C.orangeBg },
                                { statusKey: "completed", label: "مكتمل", color: C.blue, bg: C.blue + "15" }
                              ].map(st => {
                                const isCurrent = currentStatus === st.statusKey;
                                return (
                                  <button
                                    key={st.statusKey}
                                    onClick={() => handleSetAdStatus(ad.id, st.statusKey as any)}
                                    style={{
                                      background: isCurrent ? st.bg : "none",
                                      color: isCurrent ? st.color : t.textMuted,
                                      border: isCurrent ? `1px solid ${st.color}55` : "1px solid transparent",
                                      borderRadius: 6,
                                      padding: "3px 8px",
                                      fontSize: 10,
                                      fontWeight: 800,
                                      cursor: "pointer",
                                      transition: "all 0.1s"
                                    }}>
                                    {st.label}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                          <button onClick={() => onViewJob(ad)}
                            style={{
                              background: t.blueBg, color: C.blue, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                            }}>عرض</button>
                          <button onClick={() => handleToggleSuspend(ad.id)}
                            style={{
                              background: t.surface, color: t.textSec, border: `1px solid ${t.border}`, borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer"
                            }}>{isSuspended ? "تفعيل" : "إيقاف مؤقت"}</button>
                          <button onClick={() => handleDeleteAd(ad.id)}
                            style={{
                              background: t.redBg, color: C.red, border: "none", borderRadius: 8, padding: "6px 12px", fontSize: 11, fontWeight: 700, cursor: "pointer"
                            }}>حذف 🗑️</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "favorites" && (
          <div>
            {renderHeader("المفضلة وعناصر المتابعة")}
            <div style={{ padding: 14, direction: "rtl" }}>
              {favorites.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px", color: t.textMuted }}>
                  <div style={{ fontSize: 44 }}>❤️</div>
                  <p style={{ fontSize: 13, fontWeight: 700, marginTop: 12 }}>المفضلة فارغة حالياً</p>
                  <p style={{ fontSize: 11, maxWidth: 260, margin: "6px auto 0", lineHeight: 1.5 }}>
                    عند تصفحك للرئيسية، اضغط على زر القلب في زاوية أي إعلان لحفظه هنا والعودة إليه لاحقاً.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>الوظائف والمهنيين الذين قمت بحفظهم للوصول السريع:</p>
                  {favorites.map(item => (
                    <div key={item.id} style={{
                      background: t.card,
                      border: `1.5px solid ${t.border}`,
                      borderRadius: 12,
                      padding: 12,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      direction: "rtl"
                    }}>
                      <div style={{ flex: 1, textAlign: "right" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{ fontSize: 10, color: t.textMuted }}>{item.loc}</span>
                          <span style={{ fontSize: 11, fontWeight: 800, color: C.blue }}>{item.price} ج.م</span>
                        </div>
                        <h4 onClick={() => onViewJob(item)}
                          style={{ color: t.text, fontSize: 13, fontWeight: 700, margin: "4px 0", cursor: "pointer" }}>
                          {item.title}
                        </h4>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
                          <span style={{ fontSize: 10, color: t.textHint }}>نشر: {item.age}</span>
                          <div style={{ display: "flex", gap: 6 }}>
                            <button onClick={() => onViewJob(item)}
                              style={{ background: t.blueBg, color: C.blue, border: "none", padding: "4px 10px", fontSize: 10, fontWeight: 700, borderRadius: 6, cursor: "pointer" }}>
                              اتصال
                            </button>
                            <button onClick={() => setLikedJobIds(prev => prev.filter(id => id !== item.id))}
                              style={{ background: t.redBg, color: C.red, border: "none", padding: "4px 8px", fontSize: 10, borderRadius: 6, cursor: "pointer", display: "flex", alignItems: "center" }}>
                              إزالة 🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "orders" && (
          <div>
            {renderHeader("طلبات العمل وعروض التقديم")}
            <div style={{ padding: 14, direction: "rtl" }}>
              {myApplications.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px 10px", color: t.textMuted }}>
                  <span style={{ fontSize: 44 }}>💼</span>
                  <p style={{ fontSize: 13, fontWeight: 700, marginTop: 12 }}>لم تتقدم بطلبات بعد</p>
                  <p style={{ fontSize: 11, maxWidth: 260, margin: "6px auto 0", lineHeight: 1.5 }}>
                    تصح إعلانات توظيف العمالة في طنطا وكل المحافظات، وانقر على زر "تقدم للوظيفة" لتتبع المراجعات هنا فورياً.
                  </p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <p style={{ fontSize: 11, color: t.textMuted, marginBottom: 6 }}>تتبع حالة طلباتك وعروض التوظيف التي أرسلتها لأصحاب الأعمال:</p>
                  {myApplications.map(app => (
                    <div key={app.id} style={{
                      background: t.card,
                      border: `1px solid ${t.border}`,
                      borderRadius: 12,
                      padding: 12
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{
                          background: C.orange + "15",
                          color: C.orange,
                          fontSize: 10,
                          fontWeight: 800,
                          padding: "2px 8px",
                          borderRadius: 6
                        }}>
                          ⏳ قيد المراجعة الفنية
                        </span>
                        <span style={{ fontSize: 10, color: t.textMuted }}>مقدم إلى: {app.pName}</span>
                      </div>
                      <h4 style={{ color: t.text, fontSize: 13, fontWeight: 700, margin: "4px 0 10px", textAlign: "right" }}>{app.title}</h4>
                      
                      {/* Interactive Step Progress */}
                      <div style={{ background: t.surface, borderRadius: 8, padding: 8, margin: "6px 0 12px", fontSize: 10, color: t.textSec, borderRight: `3px solid ${C.blue}` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.green, fontWeight: 700 }}>
                          ✓ الخطوة ١: تم إرسال ملفك وسيرتك وصورتك للعميل
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, color: C.orange, fontWeight: 700 }}>
                          ⏳ الخطوة ٢: بانتظار قراءة العروض ومطابقة الرقم الهاتفي
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                        <button onClick={() => onViewJob(app)}
                          style={{ background: t.blueBg, color: C.blue, border: "none", padding: "6px 12px", fontSize: 11, fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>
                          تفاصيل الإعلان
                        </button>
                        <button onClick={() => setAppliedJobIds(prev => prev.filter(id => id !== app.id))}
                          style={{ background: t.redBg, color: C.red, border: "none", padding: "6px 12px", fontSize: 11, fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>
                          سحب الطلبي الغاء التقديم
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === "ratings" && (
          <div>
            {renderHeader("التقييمات وآراء العملاء")}
            <div style={{ padding: 14, direction: "rtl", textAlign: "right" }}>
              {/* Stars Overview Box */}
              <div style={{
                background: t.card,
                border: `1.5px solid ${t.border}`,
                borderRadius: 14,
                padding: 16,
                display: "flex",
                alignItems: "center",
                gap: 20,
                marginBottom: 14
              }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 950, color: t.text }}>4.8</div>
                  <div style={{ display: "flex", gap: 2, justifyContent: "center", margin: "4px 0" }}>
                    {[1, 2, 3, 4, 5].map(st => (
                      <span key={st} style={{ color: st <= 4 ? "#F59E0B" : t.borderMed, fontSize: 14 }}>★</span>
                    ))}
                  </div>
                  <div style={{ fontSize: 9, color: t.textMuted }}>بناءً على 16 تقييم</div>
                </div>
                
                {/* Stats bars */}
                <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
                  {[
                    { stars: "5 نجوم", pct: "85%" },
                    { stars: "4 نجوم", pct: "15%" },
                    { stars: "3 نجوم", pct: "0%" },
                    { stars: "2 نجوم", pct: "0%" },
                    { stars: "1 نجمة", pct: "0%" }
                  ].map((row, idx) => (
                    <div key={idx} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 10 }}>
                      <span style={{ minWidth: 32, color: t.textMuted }}>{row.stars}</span>
                      <div style={{ flex: 1, height: 6, background: t.surface, borderRadius: 3, overflow: "hidden" }}>
                        <div style={{ width: row.pct, height: "100%", background: "#F59E0B", borderRadius: 3 }} />
                      </div>
                      <span style={{ color: t.textSec, width: 22, textAlign: "left", fontWeight: 700 }}>{row.pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Badge */}
              <div style={{
                background: t.blueBg,
                color: C.blue,
                fontSize: 11,
                padding: "8px 12px",
                borderRadius: 10,
                fontWeight: 700,
                marginBottom: 16,
                textAlign: "center",
                border: `1px solid ${t.blueBorder}`
              }}>
                🎯 تقييمك مرتفع جداً! هذا يزيد من فرص ظهور عروضك وأعمالك بنسبة 2.5x في نتائج البحث المميزة.
              </div>

              {/* Sub tabs */}
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <button onClick={() => setActiveRatingTab("client")}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: 8,
                    border: "none",
                    background: activeRatingTab === "client" ? C.blue : t.card,
                    color: activeRatingTab === "client" ? "#fff" : t.textSec,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}>
                  آراء أصحاب الأعمال عني {`(${12})`}
                </button>
                <button onClick={() => setActiveRatingTab("worker")}
                  style={{
                    flex: 1,
                    padding: "8px 4px",
                    borderRadius: 8,
                    border: "none",
                    background: activeRatingTab === "worker" ? C.blue : t.card,
                    color: activeRatingTab === "worker" ? "#fff" : t.textSec,
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: "pointer"
                  }}>
                  تقييماتي للمحترفين {`(${4})`}
                </button>
              </div>

              {/* Comment logs list */}
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeRatingTab === "client" ? (
                  [
                    { name: "علاء فاروق (مقاول طنطا)", rate: 5, date: "منذ يومين", text: `${profile.name} محترف وملتزم للغاية بالمواعيد والمطابقة الفنية. أنصح بالعمل معه بشدة دون أي تفكير.` },
                    { name: "سارة كمال (طنطا الجديدة)", rate: 5, date: "منذ أسبوع", text: "شغل ممتاز، دقة، سرعة ونظافة تامة في التسليم والتعامل قمة في الأدب والاحترام الفني." },
                    { name: "محمد أبو رشاد (الغربية)", rate: 4, date: "منذ ٣ أسابيع", text: "شخص خلوق وعمل متكامل وصادق، كان متأخر قليلاً عن الموعد لكن العذر مقبول وجودة العمل عوضت الانتظار." }
                  ].map((rev, i) => (
                    <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{rev.name}</span>
                        <span style={{ fontSize: 10, color: t.textHint }}>{rev.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 5 }}>
                        {Array(rev.rate).fill(0).map((_, k) => (
                          <span key={k} style={{ color: "#F59E0B", fontSize: 11 }}>★</span>
                        ))}
                      </div>
                      <p style={{ color: t.textSec, fontSize: 11, margin: 0, lineHeight: 1.5 }}>{rev.text}</p>
                    </div>
                  ))
                ) : (
                  [
                    { name: "محمود لتركيب التكييف", rate: 5, date: "أبريل 2026", text: "فني ممتاز قام بتركيب الأجهزة بسرعة فائقة واحترافية منقطعة النظير." },
                    { name: "فريق تنظيف الغربية", rate: 5, date: "مارس 2026", text: "أسرع فريق لتنظيف الشقق ووجوه الزجاج، قاموا بالعمل على أكمل وجه وبأدوات حديثة." }
                  ].map((rev, i) => (
                    <div key={i} style={{ background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: t.text }}>{rev.name}</span>
                        <span style={{ fontSize: 10, color: t.textHint }}>{rev.date}</span>
                      </div>
                      <div style={{ display: "flex", gap: 2, marginBottom: 5 }}>
                        {Array(rev.rate).fill(0).map((_, k) => (
                          <span key={k} style={{ color: "#F59E0B", fontSize: 11 }}>★</span>
                        ))}
                      </div>
                      <p style={{ color: t.textSec, fontSize: 11, margin: 0, lineHeight: 1.4 }}>{rev.text}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeSection === "wallet" && (
          <div>
            {renderHeader("المحفظة والرصيد")}
            <div style={{ padding: 14, direction: "rtl", textAlign: "right" }}>
              {/* Feedback messages */}
              {walletError && (
                <div style={{ background: t.redBg, color: C.red, padding: 10, borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                  ⚠️ {walletError}
                </div>
              )}
              {walletSuccess && (
                <div style={{ background: t.greenBg, color: C.green, padding: 10, borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                  ✓ {walletSuccess}
                </div>
              )}

              {/* Gold Credit Card View */}
              <div style={{
                background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
                borderRadius: 16,
                padding: "18px 20px",
                color: "white",
                boxShadow: "0 6px 18px rgba(30,58,138,0.3)",
                marginBottom: 16,
                position: "relative",
                overflow: "hidden"
              }}>
                {/* Logo and branding */}
                <div style={{ display: "flex", justifySelf: "space-between", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
                  <div style={{ fontSize: 13, fontWeight: 900, letterSpacing: 0.5, color: "#fff" }}>أرزاق باي · ARZAQ PAY</div>
                  <div style={{ fontSize: 18 }}>💳</div>
                </div>

                <div style={{ marginTop: 24 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.7)", display: "block" }}>الرصيد المتاح حالياً</span>
                  <span style={{ fontSize: 26, fontWeight: 950, color: "#fff" }}>{profile.walletBalance.toFixed(2)} <span style={{ fontSize: 13, fontWeight: 500 }}>جنيه مصري</span></span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
                  <div>
                    <span style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", display: "block" }}>صاحب الحساب</span>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>{profile.name}</span>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: "rgba(255,255,255,0.8)" }}>**** **** **** 7359</div>
                </div>

                {/* Card decoration vector */}
                <div style={{
                  position: "absolute",
                  bottom: -30,
                  left: -30,
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.06)"
                }} />
              </div>

              {/* Actions buttons */}
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                <button onClick={() => { setShowDepositForm(!showDepositForm); setShowWithdrawForm(false); setWalletError(""); }}
                  style={{
                    flex: 1,
                    background: C.blue,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "11px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center"
                  }}>
                  شحن المحفظة ➕
                </button>
                <button onClick={() => { setShowWithdrawForm(!showWithdrawForm); setShowDepositForm(false); setWalletError(""); }}
                  style={{
                    flex: 1,
                    background: t.surface,
                    color: t.text,
                    border: `1.5px solid ${t.border}`,
                    borderRadius: 10,
                    padding: "11px",
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: "pointer",
                    textAlign: "center"
                  }}>
                  سحب الرصيد 💸
                </button>
              </div>

              {/* Dynamic Deposit Inline Form */}
              {showDepositForm && (
                <div style={{ background: t.card, border: `1.5px solid ${C.blue}`, borderRadius: 12, padding: 12, marginBottom: 16, animation: "slideDown 0.2s" }}>
                  <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: "0 0 10px" }}>شحن رصيد المحفظة</h4>
                  
                  <label style={{ fontSize: 11, color: t.textSec, display: "block", marginBottom: 4 }}>المبلغ المراد شحنه (جنيه مصري):</label>
                  <input type="number" value={depositAmt} onChange={e => setDepositAmt(e.target.value)} placeholder="مثال: 200"
                    style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, fontSize: 12, marginBottom: 10, outline: "none", direction: "rtl", boxSizing: "border-box" }} />
                  
                  <label style={{ fontSize: 11, color: t.textSec, display: "block", marginBottom: 4 }}>طريقة الدفع والشحن:</label>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[
                      { id: "vodafone", label: "فودافون كاش" },
                      { id: "instapay", label: "إنستا باي" },
                      { id: "credit", label: "فيزا / ميزة" }
                    ].map(ch => (
                      <button key={ch.id} onClick={() => setDepositMethod(ch.id)}
                        style={{
                          flex: 1,
                          padding: "6px 2px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          border: `1.5px solid ${depositMethod === ch.id ? C.blue : t.border}`,
                          background: depositMethod === ch.id ? t.blueBg : t.surface,
                          color: depositMethod === ch.id ? C.blue : t.textSec,
                          cursor: "pointer"
                        }}>
                        {ch.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={handleAddDeposit} style={{ flex: 1, background: C.blue, color: "white", padding: "8px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>تأكيد الشحن</button>
                    <button onClick={() => setShowDepositForm(false)} style={{ background: t.surface, color: t.textSec, border: `1px solid ${t.border}`, padding: "8px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>إلغاء</button>
                  </div>
                </div>
              )}

              {/* Dynamic Withdraw Inline Form */}
              {showWithdrawForm && (
                <div style={{ background: t.card, border: `1.5px solid ${C.orange}`, borderRadius: 12, padding: 12, marginBottom: 16, animation: "slideDown 0.2s" }}>
                  <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: "0 0 10px" }}>طلب سحب رصيد</h4>
                  
                  <label style={{ fontSize: 11, color: t.textSec, display: "block", marginBottom: 4 }}>المبلغ المراد سحبه (ج.م):</label>
                  <input type="number" value={withdrawAmt} onChange={e => setWithdrawAmt(e.target.value)} placeholder="مثال: 150"
                    style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 9, color: t.text, fontSize: 12, marginBottom: 10, outline: "none", direction: "rtl", boxSizing: "border-box" }} />
                  
                  <label style={{ fontSize: 11, color: t.textSec, display: "block", marginBottom: 4 }}>وسيلة التحويل والسحب:</label>
                  <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                    {[
                      { id: "vodafone", label: "فودافون كاش" },
                      { id: "instapay", label: "إنستا باي" },
                      { id: "credit", label: "حساب بنكي" }
                    ].map(ch => (
                      <button key={ch.id} onClick={() => setWithdrawMethod(ch.id)}
                        style={{
                          flex: 1,
                          padding: "6px 2px",
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          border: `1.5px solid ${withdrawMethod === ch.id ? C.orange : t.border}`,
                          background: withdrawMethod === ch.id ? C.orange + "15" : t.surface,
                          color: withdrawMethod === ch.id ? C.orange : t.textSec,
                          cursor: "pointer"
                        }}>
                        {ch.label}
                      </button>
                    ))}
                  </div>

                  <div style={{ display: "flex", gap: 6 }}>
                    <button onClick={handleWithdraw} style={{ flex: 1, background: C.orange, color: "white", padding: "8px", borderRadius: 6, border: "none", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>تسجيل طلب السحب</button>
                    <button onClick={() => setShowWithdrawForm(false)} style={{ background: t.surface, color: t.textSec, border: `1px solid ${t.border}`, padding: "8px 12px", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>إلغاء</button>
                  </div>
                </div>
              )}

              {/* Transactions History */}
              <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: "14px 0 8px" }}>سجل كشف الحساب والعمليات</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {walletTransactions.map(trans => {
                  const isDeposit = trans.type === "deposit";
                  return (
                    <div key={trans.id} style={{
                      background: t.card,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10,
                      padding: 10,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}>
                      <div>
                        <div style={{ color: t.text, fontSize: 11, fontWeight: 700 }}>{trans.title}</div>
                        <div style={{ color: t.textMuted, fontSize: 9, marginTop: 2 }}>التاريخ: {trans.date}</div>
                      </div>
                      <span style={{
                        fontSize: 12,
                        fontWeight: 900,
                        color: isDeposit ? C.green : C.red
                      }}>
                        {isDeposit ? `+${trans.amount}` : `${trans.amount}`} ج.م
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeSection === "edit-profile" && (
          <div>
            {renderHeader("تعديل معلومات الملف والشغل")}
            <div style={{ padding: 14, direction: "rtl", textAlign: "right" }}>
              {editSuccess && (
                <div style={{ background: t.greenBg, color: C.green, padding: 10, borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                  ✓ تم تحديث الملف بنجاح! تم تطبيق الإعدادات وتثبيتها في الهوية واللوجو لجميع عملياتك.
                </div>
              )}

              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {/* Visual Identity / Avatar selection */}
                <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 6 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 14,
                    background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, fontWeight: 900, color: "white"
                  }}>
                    {editName ? editName[0] : "أ"}
                  </div>
                  <div>
                    <span style={{ fontSize: 11, color: t.textSec, display: "block", fontWeight: 700 }}>صورة الهوية الفنية</span>
                    <span style={{ fontSize: 9, color: t.textHint }}>يتم توليد اللوجو تلقائياً بناء على الحرف الأول لتسهيل التعرف.</span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 4 }}>الاسم الكامل / الاسم التجاري:</label>
                  <input type="text" value={editName} onChange={e => setEditName(e.target.value)}
                    style={{ width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                </div>

                {/* Phone */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 4 }}>رقم الهاتف / واتساب مؤكد:</label>
                  <input type="text" value={editPhone} onChange={e => setEditPhone(e.target.value)}
                    style={{ width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, color: t.text, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
                </div>

                {/* Dropdowns */}
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 4 }}>الموقع الإقليمي:</label>
                    <select value={editCity} onChange={e => setEditCity(e.target.value)}
                      style={{ width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, color: t.text, fontSize: 11, outline: "none" }}>
                      <option value="طنطا">طنطا، مصر</option>
                      <option value="القاهرة">القاهرة، مصر</option>
                      <option value="المحلة">المحلة، الغربية</option>
                      <option value="الجيزة">الجيزة</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 4 }}>سنوات الخبرة:</label>
                    <select value={editExp} onChange={e => setEditExp(e.target.value)}
                      style={{ width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, color: t.text, fontSize: 11, outline: "none" }}>
                      <option value="سنة واحدة">سنة واحدة</option>
                      <option value="3 سنوات">3 سنوات</option>
                      <option value="5 سنوات">5 سنوات</option>
                      <option value="8 سنوات">8 سنوات</option>
                      <option value="أكثر من 10 سنوات">أكثر من 10 سنوات</option>
                    </select>
                  </div>
                </div>

                {/* Bio text */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 4 }}>نبذة تعريفية للمهنيين وأصحاب الإعلانات:</label>
                  <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                    style={{ width: "100%", background: t.card, border: `1px solid ${t.border}`, borderRadius: 10, padding: 10, color: t.text, fontSize: 12, outline: "none", resize: "none", boxSizing: "border-box" }} />
                </div>

                {/* Skills tags selection */}
                <div>
                  <label style={{ fontSize: 11, fontWeight: 700, color: t.textSec, display: "block", marginBottom: 6 }}>اختر مهاراتك الفنية لتلقي إشعارات مطابقة {`(اضغط للتحديد)`}:</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {ALL_SKILLS.map(sk => {
                      const isActive = editSkills.includes(sk);
                      return (
                        <button key={sk} onClick={() => handleToggleSkill(sk)}
                          style={{
                            padding: "6px 12px",
                            borderRadius: 12,
                            fontSize: 10,
                            fontWeight: 700,
                            cursor: "pointer",
                            transition: "all 0.15s",
                            border: `1.5px solid ${isActive ? C.blue : t.border}`,
                            background: isActive ? t.blueBg : t.card,
                            color: isActive ? C.blue : t.textSec
                          }}>
                          {isActive ? "✓ " : ""}{sk}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button onClick={handleSaveProfile}
                  style={{
                    background: C.blue,
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "12px",
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: "pointer",
                    marginTop: 10,
                    boxShadow: `0 4px 12px ${C.blue}44`
                  }}>
                  حفظ معلومات التعديل
                </button>
              </div>
            </div>
          </div>
        )}

        {activeSection === "privacy" && (
          <div>
            {renderHeader("الخصوصية والأمان المتقدم")}
            <div style={{ padding: 14, direction: "rtl", textAlign: "right" }}>
              {pinSuccess && (
                <div style={{ background: t.greenBg, color: C.green, padding: 10, borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
                  ✓ تم تحديث كود الأمان بنجاح!
                </div>
              )}

              {/* Secret code pin change */}
              <div style={{
                background: t.card,
                border: `1px solid ${t.border}`,
                borderRadius: 12,
                padding: 12,
                marginBottom: 16
              }}>
                <h4 style={{ color: t.text, fontSize: 12, fontWeight: 800, margin: "0 0 10px" }}>تحديث كود المرور والتحقق (رمز PIN)</h4>
                
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: t.textSec, display: "block", marginBottom: 4 }}>كود PIN القديم:</label>
                    <input type="password" placeholder="****" maxLength={4} value={oldPin} onChange={e => setOldPin(e.target.value)}
                      style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 8, color: t.text, fontSize: 12, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: 10, color: t.textSec, display: "block", marginBottom: 4 }}>كود PIN الجديد:</label>
                    <input type="password" placeholder="****" maxLength={4} value={newPin} onChange={e => setNewPin(e.target.value)}
                      style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 8, padding: 8, color: t.text, fontSize: 12, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
                  </div>
                </div>
                <button onClick={handleUpdatePin} style={{ width: "100%", background: C.blue, color: "white", border: "none", padding: "8px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>تحديث كود الأمان</button>
              </div>

              {/* Toggles */}
              <h4 style={{ color: t.text, fontSize: 12, fontWeight: 800, margin: "14px 0 10px" }}>إعدادات الهوية وسجل الظهور في المنصة</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  {
                    val: privacySettings.twoFactor,
                    set: (v: boolean) => setPrivacySettings({ ...privacySettings, twoFactor: v }),
                    label: "تفعيل التحقق الثنائي (2FA)",
                    sub: "يطلب مصادقة جوالك عند الدخول من متصفح جديد"
                  },
                  {
                    val: privacySettings.appearInSearch,
                    set: (v: boolean) => setPrivacySettings({ ...privacySettings, appearInSearch: v }),
                    label: "الظهور العام في محركات البحث",
                    sub: "يتيح للناس خارج تطبيق أرزاق العثور على خدماتك عبر جوجل"
                  },
                  {
                    val: privacySettings.shareContactDirectly,
                    set: (v: boolean) => setPrivacySettings({ ...privacySettings, shareContactDirectly: v }),
                    label: "مشاركة الاتصال تلقائياً",
                    sub: "تخطي نافذة التأكيد وإرسال جوالك بمجرد التقديم"
                  },
                ].map((tg, i) => (
                  <div key={i} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: t.card,
                    border: `1px solid ${t.border}`,
                    borderRadius: 11,
                    padding: "12px 14px"
                  }}>
                    <div>
                      <div style={{ color: t.text, fontSize: 12, fontWeight: 700 }}>{tg.label}</div>
                      <div style={{ color: t.textMuted, fontSize: 10, marginTop: 2, lineHeight: 1.3 }}>{tg.sub}</div>
                    </div>
                    <button onClick={() => tg.set(!tg.val)}
                      style={{
                        width: 42, height: 22, borderRadius: 12,
                        background: tg.val ? C.blue : t.surface,
                        border: `1.5px solid ${tg.val ? C.blue : t.borderMed}`,
                        cursor: "pointer", transition: "all 0.2s", position: "relative", flexShrink: 0
                      }}>
                      <div style={{
                        position: "absolute", top: 1.5,
                        left: tg.val ? 19 : 2.5, width: 17, height: 17,
                        borderRadius: "50%", background: "#fff",
                        transition: "all 0.2s"
                      }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === "notifications" && (
          <div>
            {renderHeader("الإشعارات وإدارة التنبيهات")}
            <div style={{ padding: 14, direction: "rtl", textAlign: "right" }}>
              {/* Toggles */}
              <div style={{
                background: t.card,
                border: `1.1px solid ${t.border}`,
                borderRadius: 12,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                gap: 12,
                marginBottom: 16
              }}>
                {[
                  { val: notifSettings.newJobs, set: (v: boolean) => setNotifSettings({ ...notifSettings, newJobs: v }), label: "إشعارات الوظائف المتطابقة" },
                  { val: notifSettings.messages, set: (v: boolean) => setNotifSettings({ ...notifSettings, messages: v }), label: "إشعارات الرسائل والدردشات الفورية" },
                  { val: notifSettings.offers, set: (v: boolean) => setNotifSettings({ ...notifSettings, offers: v }), label: "تنبيهات العروض الحصرية وزيادة التفاعل" }
                ].map((notTog, ki) => (
                  <div key={ki} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: t.textSec }}>{notTog.label}</span>
                    <button onClick={() => notTog.set(!notTog.val)}
                      style={{
                        width: 38, height: 20, borderRadius: 10,
                        background: notTog.val ? C.blue : t.surface,
                        border: `1.5px solid ${notTog.val ? C.blue : t.borderMed}`,
                        cursor: "pointer", transition: "all 0.2s", position: "relative", flexShrink: 0
                      }}>
                      <div style={{
                        position: "absolute", top: 1.5,
                        left: notTog.val ? 18 : 2, width: 14, height: 14,
                        borderRadius: "50%", background: "#fff",
                        transition: "all 0.2s"
                      }} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Feed logs list */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: 0 }}>التنبيهات المستلمة</h4>
                {localNotifs.length > 0 && (
                  <button onClick={() => setLocalNotifs([])}
                    style={{ background: "none", border: "none", color: C.red, fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                    مسح الكل 🗑️
                  </button>
                )}
              </div>

              {localNotifs.length === 0 ? (
                <div style={{ textAlign: "center", padding: "30px 10px", color: t.textMuted }}>
                  <span style={{ fontSize: 34 }}>🔔</span>
                  <p style={{ fontSize: 12, fontWeight: 700, marginTop: 10 }}>مجل الإشعارات فارغ تماماً!</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {localNotifs.map(lf => (
                    <div key={lf.id} style={{
                      background: t.card,
                      border: `1px solid ${t.border}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10
                    }}>
                      <span style={{ fontSize: 16 }}>{lf.icon}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ color: t.text, fontSize: 11, fontWeight: 600, lineHeight: 1.4 }}>{lf.text}</div>
                        <div style={{ color: t.textHint, fontSize: 8, marginTop: 4 }}>{lf.date}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return(
    <div style={{paddingBottom:100}}>
      {/* Profile card */}
      <div style={{
        background:dark
          ?"linear-gradient(160deg,#0D1E3A,#0B1628)"
          :`linear-gradient(160deg,${C.bluePale},#F7FBFF)`,
        padding:"22px 16px 0",borderBottom:`1px solid ${t.border}`}}>
        <div style={{display:"flex",gap:14,alignItems:"center",
          marginBottom:18,direction:"rtl"}}>
          <div style={{position:"relative"}}>
            <div style={{width:64,height:64,borderRadius:18,
              background:`linear-gradient(135deg,${C.blue},${C.blueDeep})`,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:26,fontWeight:950,color:"white",
              boxShadow:`0 4px 16px ${C.blue}44`}}>
              {profile.name ? profile.name[0] : "أ"}
            </div>
            <div style={{position:"absolute",bottom:1,right:1,width:14,height:14,
              borderRadius:7,background:C.green,
              border:`2px solid ${dark?C.dSurface:C.lSurface}`}}/>
          </div>
          <div>
            <h2 style={{color:t.text,fontSize:18,fontWeight:900,margin:"0 0 2px"}}>{profile.name}</h2>
            <div style={{color:t.textSec,fontSize:12}}>{profile.city} · مصر</div>
            <div style={{marginTop:6}}>
              <Tag color={C.blue} bg={t.blueBg} border={t.blueBorder}>✓ حساب موثق</Tag>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{display:"flex",borderTop:`1px solid ${t.border}`,
          paddingTop:0}}>
          {[
            {v: myAds.length.toString(),l:"إعلان"},
            {v:"84",l:"مشاهدة"},
            {v:`★ ${profile.rating}`,l:"تقييم"},
            {v: profile.since || "2022",l:"عضو منذ"}
          ].map((s,i)=>(
            <div key={i} style={{flex:1,padding:"13px 0",textAlign:"center",
              borderLeft:i>0?`1px solid ${t.border}`:"none"}}>
              <div style={{color:i===2?C.orange:t.text,fontSize:14,fontWeight:850}}>{s.v}</div>
              <div style={{color:t.textMuted,fontSize:10,marginTop:1}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"12px 14px"}}>
        {/* Dark mode row */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
          background:t.card,border:`1px solid ${t.border}`,borderRadius:11,
          padding:"12px 14px",marginBottom:8}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:9,
              background:t.blueBg,border:`1px solid ${t.blueBorder}`,
              display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Svg d={dark?ic.sun:ic.moon} s={16} c={C.blue}/>
            </div>
            <div style={{direction:"rtl"}}>
              <div style={{color:t.text,fontSize:13,fontWeight:600}}>
                {dark?"الوضع الليلي":"الوضع النهاري"}
              </div>
              <div style={{color:t.textMuted,fontSize:11}}>تغيير مظهر التطبيق</div>
            </div>
          </div>
          <button onClick={toggle}
            style={{width:44,height:24,borderRadius:12,
              background:dark?C.blue:t.surface,
              border:`1px solid ${dark?C.blue:t.borderMed}`,
              cursor:"pointer",transition:"all 0.2s",position:"relative",flexShrink:0}}>
            <div style={{position:"absolute",top:2,
              left:dark?20:2,width:20,height:20,
              borderRadius:10,background:"#fff",
              transition:"left 0.2s",boxShadow:"0 1px 3px rgba(0,0,0,0.2)"}}/>
          </button>
        </div>

        {/* ── RECHARTS USER ACTIVITY CHART ── */}
        <div style={{
          background: t.card,
          border: `1.5px solid ${t.border}`,
          borderRadius: 12,
          padding: "16px 14px",
          marginBottom: 12,
          direction: "rtl",
          animation: "fadeIn 0.2s"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ textAlign: "right" }}>
              <h4 style={{ color: t.text, fontSize: 13, fontWeight: 800, margin: 0 }}>📊 معدل النشاط اليومي</h4>
              <p style={{ color: t.textMuted, fontSize: 10, marginTop: 2, margin: 0 }}>عدد الإعلانات المنشورة وتفاعل المشاهدات خلال آخر 30 يوماً</p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.blue }} />
                <span style={{ color: t.textSec, fontSize: 9, fontWeight: 600 }}>إعلانات</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B" }} />
                <span style={{ color: t.textSec, fontSize: 9, fontWeight: 600 }}>مشاهدات</span>
              </div>
            </div>
          </div>

          <div style={{ width: "100%", height: 160, direction: "ltr" }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAds" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={C.blue} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={C.blue} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={dark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"} vertical={false} />
                <XAxis 
                  dataKey="date" 
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: t.textMuted, fontSize: 9 }}
                  interval={4}
                />
                <YAxis 
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: t.textMuted, fontSize: 9 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div style={{
                          background: t.surface,
                          border: `1.5px solid ${t.border}`,
                          borderRadius: 8,
                          padding: "8px 10px",
                          direction: "rtl",
                          textAlign: "right",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}>
                          <div style={{ color: t.text, fontSize: 10, fontWeight: 800, marginBottom: 4 }}>التاريخ: {data.fullDate}</div>
                          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                            <div style={{ color: C.blue, fontSize: 10, fontWeight: 700 }}>
                              📢 الإعلانات المنشورة: {data.الإعلانات}
                            </div>
                            <div style={{ color: "#F59E0B", fontSize: 10, fontWeight: 700 }}>
                              👁️ المشاهدات اليومية: {data.المشاهدات}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="المشاهدات" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="الإعلانات" 
                  stroke={C.blue} 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorAds)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Menu */}
        <div style={{background:t.card,border:`1px solid ${t.border}`,
          borderRadius:11,overflow:"hidden",marginBottom:16}}>
          {menu.map((m,i)=>(
            <button key={i}
              onClick={() => setActiveSection(m.id)}
              style={{width:"100%",display:"flex",alignItems:"center",
                justifyContent:"space-between",padding:"13px 14px",background:"none",
                border:"none",borderBottom:i<menu.length-1?`1px solid ${t.border}`:"none",
                cursor:"pointer",direction:"rtl",transition:"background 0.12s"}}
              onMouseEnter={e=>e.currentTarget.style.background=t.cardHover}
              onMouseLeave={e=>e.currentTarget.style.background="none"}>
              <div style={{display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:34,height:34,borderRadius:9,background:t.surface,
                  border:`1px solid ${t.border}`,display:"flex",
                  alignItems:"center",justifyContent:"center",flexShrink:0}}>
                  <Svg d={m.i} s={15} c={t.textSec}/>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:t.text,fontSize:13,fontWeight:600}}>
                    {m.l}
                    {m.badge&&<span style={{marginRight:6,background:C.blue,color:"#fff",
                      fontSize:9,padding:"1px 6px",borderRadius:99,fontWeight:700}}>{m.badge}</span>}
                  </div>
                  <div style={{color:t.textMuted,fontSize:11,marginTop:1}}>{m.s}</div>
                </div>
              </div>
              <Svg d={ic.chevL} s={14} c={t.textMuted}/>
            </button>
          ))}
        </div>

        <button onClick={() => setShowLogoutConfirm(true)}
          style={{width:"100%",background:t.redBg,
          border:"1.5px solid rgba(239,68,68,0.15)",color:C.red,
          borderRadius:10,padding:"13px",fontSize:13,fontWeight:700,cursor:"pointer"}}>
          تسجيل الخروج
        </button>
      </div>

      {/* Logout confirmation custom dialog overlay */}
      {showLogoutConfirm && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: 20
        }}>
          <div style={{
            background: t.surface,
            border: `1.5px solid ${t.border}`,
            borderRadius: 16,
            padding: 20,
            width: "100%",
            maxWidth: 320,
            direction: "rtl",
            textAlign: "center"
          }}>
            <span style={{ fontSize: 36 }}>🚪</span>
            <h4 style={{ color: t.text, fontSize: 16, fontWeight: 800, margin: "10px 0 6px" }}>تسجيل الخروج</h4>
            <p style={{ color: t.textMuted, fontSize: 11, lineHeight: 1.5, margin: "0 0 18px" }}>
              هل أنت متأكد من رغبتك في تسجيل الخروج والعودة لشاشة البدء؟ لن تفقد بياناتك المحلية.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { setIsLoggedOut(true); setShowLogoutConfirm(false); }}
                style={{ flex: 1, background: C.red, color: "white", border: "none", padding: "10px", borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                نعم، خروج
              </button>
              <button onClick={() => setShowLogoutConfirm(false)}
                style={{ flex: 1, background: t.card, border: `1px solid ${t.border}`, color: t.textSec, padding: "10px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════
   ROOT — App Entry Point
═══════════════════════════════════════════ */
const LoginView = ({ t, onLogin }: { t: ThemeType; onLogin: () => void }) => {
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !pin) {
      setErrorCode("يرجى إدخال رقم الهاتف ورمز الأمان.");
      return;
    }
    if (phone.length < 10) {
      setErrorCode("رقم الهاتف الذي أدخلته غير صحيح.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin();
    }, 1200);
  };

  return (
    <div style={{
      fontFamily: "'Cairo','Tajawal',sans-serif",
      background: t.bg,
      height: "100dvh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
      direction: "rtl"
    }}>
      {/* Centered logo container */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 30 }}>
        <div style={{
          width: 72, height: 72, borderRadius: 22,
          background: `linear-gradient(135deg, ${C.blue}, ${C.blueDeep})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 8px 24px ${C.blue}33`,
          marginBottom: 14
        }}>
          <span style={{ fontSize: 32, fontWeight: 950, color: "white" }}>أ</span>
        </div>
        <h1 style={{ color: t.text, fontSize: 24, fontWeight: 950, margin: "0 0 6px" }}>أرزاق · ARZAQ</h1>
        <p style={{ color: t.textMuted, fontSize: 12, margin: 0, textAlign: "center", maxWidth: 280, lineHeight: 1.5 }}>
          بوابتك الآمنة لتوظيف العمالة وعرض الخدمات الفنية في طنطا وكل المحافظات
        </p>
      </div>

      <form onSubmit={handleLoginSubmit} style={{
        background: t.card,
        border: `1.5px solid ${t.border}`,
        borderRadius: 16,
        padding: 20,
        width: "100%",
        maxWidth: 340,
        boxShadow: t.shadowCard
      }}>
        <h3 style={{ color: t.text, fontSize: 16, fontWeight: 800, margin: "0 0 16px", textAlign: "center" }}>تسجيل الدخول للمنصة</h3>

        {errorCode && (
          <div style={{ background: t.redBg, color: C.red, padding: "8px 12px", borderRadius: 8, fontSize: 11, fontWeight: 700, marginBottom: 12 }}>
            ⚠️ {errorCode}
          </div>
        )}

        <div style={{ marginBottom: 12 }}>
          <label style={{ color: t.textSec, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 6 }}>رقم الموبايل:</label>
          <input type="tel" placeholder="01xxxxxxxxx" value={phone} onChange={e => { setPhone(e.target.value); setErrorCode(""); }}
            style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 11, color: t.text, fontSize: 13, outline: "none", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={{ color: t.textSec, fontSize: 11, fontWeight: 700, display: "block", marginBottom: 6 }}>رمز الدخول السري (PIN):</label>
          <input type="password" placeholder="****" maxLength={4} value={pin} onChange={e => { setPin(e.target.value); setErrorCode(""); }}
            style={{ width: "100%", background: t.surface, border: `1px solid ${t.border}`, borderRadius: 10, padding: 11, color: t.text, fontSize: 13, textAlign: "center", outline: "none", boxSizing: "border-box" }} />
        </div>

        <button type="submit" disabled={isLoading}
          style={{
            width: "100%", background: C.blue, color: "white", border: "none", borderRadius: 10, padding: 13, fontSize: 13, fontWeight: 700, cursor: isLoading ? "not-allowed" : "pointer"
          }}>
          {isLoading ? "جاري التحقق من أوراق المصادقة..." : "تسجيل الدخول الآمن"}
        </button>

        <div style={{ textAlign: "center", marginTop: 14 }}>
          <span style={{ fontSize: 11, color: t.textMuted }}>ليس لديك حساب مهني؟</span>
          <button type="button" onClick={() => onLogin()} style={{ background: "none", border: "none", color: C.blue, fontSize: 11, fontWeight: 700, cursor: "pointer", marginRight: 5 }}>
            الدخول كزائر مؤقتاً
          </button>
        </div>
      </form>
    </div>
  );
};

export default function App(){
  const [dark,setDark]=useState(true);
  const [tab,setTab]=useState("home");
  const [jobsList,setJobsList]=useState<Job[]>(JOBS);
  const [job,setJob]=useState<Job | null>(null);
  const [catFilter, setCatFilter] = useState<string | null>(null);
  const [subFilter, setSubFilter] = useState<string | null>(null);
  const t=T(dark);

  // User Profile Global States
  const [profile, setProfile] = useState({
    name: "أبو ميرا",
    city: "طنطا",
    locationDetail: "طنطا، الغربية",
    phone: "01023456789",
    verified: true,
    rating: 4.8,
    since: "2022",
    walletBalance: 350.00,
    bio: "أعمل في مجال التشطيبات والديكورات المنزلية بخبرة تزيد عن 8 سنوات. ملتزم بالجودة والمواعيد.",
    skills: ["سباكة", "دهان داخلي", "تركيب أدوات صحية"],
    experience: "8 سنوات",
    avatarColor: C.blue
  });

  const [likedJobIds, setLikedJobIds] = useState<number[]>([1, 2]);
  const [appliedJobIds, setAppliedJobIds] = useState<number[]>([]);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 101, title: "شحن رصيد - فودافون كاش", amount: 100, type: "deposit", date: "أمس" },
    { id: 102, title: "شحن رصيد - إنستا باي", amount: 250, type: "deposit", date: "منذ ٣ أيام" },
  ]);
  const [privacySettings, setPrivacySettings] = useState({
    twoFactor: false,
    appearInSearch: true,
    shareContactDirectly: true,
  });
  const [notifSettings, setNotifSettings] = useState({
    newJobs: true,
    messages: true,
    offers: false,
  });
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleRateJob = (jobId: number, rating: number) => {
    setJobsList(prevJobs => {
      const updatedJobs = prevJobs.map(j => {
        if (j.id === jobId) {
          const count = j.ratingCount || (j.stars > 0 ? 12 : 0);
          const currentList = j.ratingsList || (j.stars > 0 ? Array(count).fill(Math.round(j.stars)) : []);
          const updatedList = [...currentList, rating];
          const sum = updatedList.reduce((sumVal, val) => sumVal + val, 0);
          const average = parseFloat((sum / updatedList.length).toFixed(1));
          
          const updatedJob = {
            ...j,
            stars: average,
            ratingCount: updatedList.length,
            ratingsList: updatedList
          };
          
          if (job && job.id === jobId) {
            setJob(updatedJob);
          }
          return updatedJob;
        }
        return j;
      });
      return updatedJobs;
    });
  };

  const [selectedLocation, setSelectedLocation] = useState<"all" | "tanta" | "cairo">("tanta"); 
  const [showLocModal, setShowLocModal] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [resolvedGpsName, setResolvedGpsName] = useState<string | null>(null);

  const requestGPS = () => {
    setGpsLoading(true);
    if (!navigator.geolocation) {
      alert("متصفحك لا يدعم نظام تحديد المواقع (GPS)");
      setGpsLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const distToCairo = Math.sqrt(Math.pow(lat - 30.044, 2) + Math.pow(lon - 31.235, 2));
        const distToTanta = Math.sqrt(Math.pow(lat - 30.788, 2) + Math.pow(lon - 31.001, 2));
        
        if (distToTanta < distToCairo) {
          setSelectedLocation("tanta");
          setResolvedGpsName("طنطا (GPS)");
        } else {
          setSelectedLocation("cairo");
          setResolvedGpsName("القاهرة (GPS)");
        }
        setGpsLoading(false);
        setShowLocModal(false);
      },
      (error) => {
        console.warn(error);
        setSelectedLocation("tanta");
        setResolvedGpsName("طنطا (GPS افتراضي)");
        setGpsLoading(false);
        setShowLocModal(false);
      },
      { timeout: 8000 }
    );
  };

  const nav=[
    {k:"home",  l:"الرئيسية",d:ic.home},
    {k:"cats",  l:"الفئات",  d:ic.grid},
    {k:"post",  l:"",         d:ic.plus},
    {k:"chats", l:"الدردشات",d:ic.chat},
    {k:"profile",l:"حساب",   d:ic.user},
  ];

  const handleAddJob = (newJob: Job) => {
    setJobsList(prev => [newJob, ...prev]);
    setTab("home");
  };

  const content=()=>{
    if(job) return <JobDetail job={job} t={t} dark={dark}
      onBack={()=>setJob(null)}
      onChat={()=>{setJob(null);setTab("chats");}}
      onRate={(rating)=>handleRateJob(job.id, rating)}
      likedJobIds={likedJobIds}
      setLikedJobIds={setLikedJobIds}
      appliedJobIds={appliedJobIds}
      setAppliedJobIds={setAppliedJobIds}/>;
    switch(tab){
      case"home":   return <HomeScreen jobsList={jobsList} t={t} dark={dark} onJob={setJob} onCats={()=>setTab("cats")} selectedLocation={selectedLocation} catFilter={catFilter} setCatFilter={setCatFilter} subFilter={subFilter} setSubFilter={setSubFilter}/>;
      case"cats":   return <CategoriesScreen t={t} catFilter={catFilter} setCatFilter={setCatFilter} subFilter={subFilter} setSubFilter={setSubFilter} setTab={setTab} jobsList={jobsList} onJob={setJob}/>;
      case"post":   return <PostScreen t={t} onAddJob={handleAddJob} profile={profile}/>;
      case"chats":  return <ChatsScreen t={t} dark={dark}/>;
      case"profile":return <ProfileScreen 
        t={t} 
        dark={dark} 
        toggle={()=>setDark(d=>!d)}
        profile={profile}
        setProfile={setProfile}
        likedJobIds={likedJobIds}
        setLikedJobIds={setLikedJobIds}
        appliedJobIds={appliedJobIds}
        setAppliedJobIds={setAppliedJobIds}
        jobsList={jobsList}
        setJobsList={setJobsList}
        onViewJob={setJob}
        walletTransactions={walletTransactions}
        setWalletTransactions={setWalletTransactions}
        privacySettings={privacySettings}
        setPrivacySettings={setPrivacySettings}
        notifSettings={notifSettings}
        setNotifSettings={setNotifSettings}
        isLoggedOut={isLoggedOut}
        setIsLoggedOut={setIsLoggedOut}/>;
      default:      return <HomeScreen jobsList={jobsList} t={t} dark={dark} onJob={setJob} onCats={()=>setTab("cats")} selectedLocation={selectedLocation} catFilter={catFilter} setCatFilter={setCatFilter} subFilter={subFilter} setSubFilter={setSubFilter}/>;
    }
  };

  if (isLoggedOut) {
    return <LoginView t={t} onLogin={() => { setIsLoggedOut(false); setTab("home"); }} />;
  }

  return(
    <div style={{fontFamily:"'Cairo','Tajawal','Segoe UI',sans-serif",
      background:t.bg,height:"100dvh",maxHeight:"100dvh",maxWidth:480,
      margin:"0 auto",display:"flex",flexDirection:"column",
      position:"relative",overflow:"hidden"}}>

      {/* ── TOP BAR ── */}
      <div style={{background:t.surface,borderBottom:`1px solid ${t.border}`,
        padding:"9px 14px",display:"flex",justifyContent:"space-between",
        alignItems:"center",flexShrink:0,position:"relative",zIndex:100,
        boxShadow:t.shadowCard}}>

        {/* Left: icons */}
        <div style={{display:"flex",gap:7}}>
          <button onClick={()=>setDark(d=>!d)}
            style={{width:34,height:34,borderRadius:9,background:t.card,
              border:`1px solid ${t.border}`,cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center"}}>
            <Svg d={dark?ic.sun:ic.moon} s={16} c={t.textSec}/>
          </button>
          <button style={{width:34,height:34,borderRadius:9,background:t.card,
            border:`1px solid ${t.border}`,cursor:"pointer",
            display:"flex",alignItems:"center",justifyContent:"center",
            position:"relative"}}>
            <Svg d={ic.bell} s={16} c={t.textSec}/>
            <div style={{position:"absolute",top:6,right:6,width:7,height:7,
              borderRadius:4,background:C.red,border:`1.5px solid ${t.surface}`}}/>
          </button>
        </div>

        {/* Center: LOGO */}
        <ArzaqLogo size={30} showText={true} dark={dark}/>

        {/* Right: location */}
        <button onClick={() => setShowLocModal(true)}
          style={{display:"flex",alignItems:"center",gap:4,
          background:t.card,border:`1px solid ${t.border}`,
          borderRadius:9,padding:"6px 9px",cursor:"pointer"}}>
          <Svg d={ic.pin} s={12} c={C.blue}/>
          <span style={{color:t.text,fontSize:11,fontWeight:600}}>
            {selectedLocation === "all" ? "كل مصر" : (selectedLocation === "tanta" ? (resolvedGpsName || "طنطا") : (resolvedGpsName || "القاهرة"))}
          </span>
          <Svg d={ic.chevD} s={11} c={t.textMuted}/>
        </button>
      </div>

      {/* ── SEARCH (home only) ── */}
      {!job&&tab==="home"&&(
        <div style={{background:t.surface,padding:"8px 12px 10px",
          borderBottom:`1px solid ${t.border}`,flexShrink:0}}>
          <div style={{display:"flex",gap:8,alignItems:"center",background:t.card,
            border:`1px solid ${t.border}`,borderRadius:10,
            padding:"9px 12px",direction:"rtl",
            transition:"border-color 0.15s"}}>
            <Svg d={ic.search} s={16} c={t.textMuted}/>
            <input placeholder="ابحث عن عامل أو وظيفة..."
              style={{flex:1,background:"none",border:"none",color:t.textSec,
                fontSize:13,outline:"none",fontFamily:"inherit",direction:"rtl"}}/>
            <div style={{width:1,height:18,background:t.border}}/>
            <button style={{display:"flex",alignItems:"center",gap:5,
              background:"none",border:"none",cursor:"pointer",padding:0}}>
              <Svg d={ic.filter} s={14} c={t.textSec}/>
              <span style={{color:t.textSec,fontSize:11,fontWeight:500}}>فلتر</span>
            </button>
          </div>
        </div>
      )}

      {/* ── CONTENT ── */}
      <div style={{flex:1,overflowY:"auto",scrollbarWidth:"none",position:"relative"}}>
        {content()}
      </div>

      {/* ── BOTTOM NAV ── */}
      {!job && (
        <div style={{background:t.surface,borderTop:`1px solid ${t.border}`,
          display:"flex",alignItems:"center",
          paddingBottom:"env(safe-area-inset-bottom,6px)",
          paddingTop:6,flexShrink:0,position:"relative",
          bottom:0,zIndex:100,boxShadow:`0 -1px 0 ${t.border}`}}>
          {nav.map(n=>{
            const isPost=n.k==="post";
            const active=tab===n.k&&!job;
            if(isPost) return(
              <button key={n.k} onClick={()=>{setJob(null);setTab(n.k);}}
                style={{flex:1,display:"flex",justifyContent:"center",
                  background:"none",border:"none",cursor:"pointer",
                  paddingTop:0,paddingBottom:4}}>
                <div style={{width:46,height:46,borderRadius:14,
                  background:C.blue,display:"flex",
                  alignItems:"center",justifyContent:"center",
                  boxShadow:`0 4px 16px ${C.blue}55`,
                  marginTop:-12,transition:"transform 0.15s"}}>
                  <Svg d={n.d} s={22} c="#fff" sw={2.3}/>
                </div>
              </button>
            );
            return(
              <button key={n.k} onClick={()=>{setJob(null);setTab(n.k);}}
                style={{flex:1,display:"flex",flexDirection:"column",
                  alignItems:"center",gap:3,background:"none",border:"none",
                  cursor:"pointer",padding:"5px 2px 4px",position:"relative"}}>
                <Svg d={n.d} s={21} c={active?C.blue:t.textMuted}/>
                <span style={{fontSize:10,color:active?C.blue:t.textMuted,
                  fontWeight:active?700:400,letterSpacing:0.2}}>{n.l}</span>
                {active&&<div style={{position:"absolute",top:0,width:24,
                  height:2.5,borderRadius:99,background:C.blue}}/>}
                {n.k==="chats"&&<div style={{position:"absolute",top:3,
                  left:"50%",marginLeft:5,width:7,height:7,borderRadius:4,
                  background:C.red,border:`2px solid ${t.surface}`}}/>}
              </button>
            );
          })}
        </div>
      )}

      {/* ── LOCATION SELECTOR MODAL ── */}
      {showLocModal && (
        <div style={{
          position:"absolute",top:0,left:0,right:0,bottom:0,
          background:"rgba(0,0,0,0.6)",backdropFilter:"blur(3.5px)",
          zIndex:1000,display:"flex",flexDirection:"column",
          justifyContent:"flex-end"
        }}>
          {/* Backdrop Clicker to Close */}
          <div onClick={()=>setShowLocModal(false)} style={{flex:1}} />
          
          {/* Content Card */}
          <div style={{
            background:t.surface,
            borderTop:`1px solid ${t.border}`,
            borderTopRightRadius:20,
            borderTopLeftRadius:20,
            padding:"20px 16px 24px",
            direction:"rtl",
            boxShadow:"0 -10px 25px rgba(0,0,0,0.15)",
            zIndex:1001,
            animation:"fadeIn 0.2s"
          }}>
            {/* Header */}
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h3 style={{color:t.text,fontSize:15,fontWeight:800,margin:0}}>نطاق البحث الجغرافي</h3>
              <button onClick={()=>setShowLocModal(false)}
                style={{background:t.card,border:`1px solid ${t.border}`,borderRadius:8,
                  width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",
                  cursor:"pointer",color:t.textSec}}>
                <Svg d={ic.x} s={13} c={t.textSec}/>
              </button>
            </div>

            <p style={{color:t.textMuted,fontSize:11,marginTop:-8,marginBottom:18,lineHeight:1.4}}>
              اختر نطاقاً محدداً لتصفية الإعلانات وطلبات التشغيل المعروضة لك في القائمة الرئيسية.
            </p>

            {/* Options list */}
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              
              {/* Option 1: All Egypt */}
              <button onClick={()=>{setSelectedLocation("all");setResolvedGpsName(null);setShowLocModal(false);}}
                style={{
                  width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"11px 12px",borderRadius:10,
                  background:selectedLocation==="all" && !resolvedGpsName ? t.blueBg : t.card,
                  border:`1px solid ${selectedLocation==="all" && !resolvedGpsName ? C.blue : t.border}`,
                  cursor:"pointer",transition:"all 0.15s",textAlign:"right"
                }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:20}}>🇪🇬</div>
                  <div>
                    <div style={{color:t.text,fontSize:12,fontWeight:700}}>كل جمهورية مصر العربية</div>
                    <div style={{color:t.textMuted,fontSize:10,marginTop:2}}>عرض كل إعلانات المهن والوظائف بكافة المحافظات</div>
                  </div>
                </div>
                {selectedLocation==="all" && !resolvedGpsName && <Svg d={ic.check} s={14} c={C.blue} sw={3}/>}
              </button>

              {/* Option 2: Tanta */}
              <button onClick={()=>{setSelectedLocation("tanta");setResolvedGpsName(null);setShowLocModal(false);}}
                style={{
                  width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"11px 12px",borderRadius:10,
                  background:selectedLocation==="tanta" && !resolvedGpsName ? t.blueBg : t.card,
                  border:`1px solid ${selectedLocation==="tanta" && !resolvedGpsName ? C.blue : t.border}`,
                  cursor:"pointer",transition:"all 0.15s",textAlign:"right"
                }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:20}}>📍</div>
                  <div>
                    <div style={{color:t.text,fontSize:12,fontWeight:700}}>طنطا والغربية</div>
                    <div style={{color:t.textMuted,fontSize:10,marginTop:2}}>التركيز على إعلانات مدينة طنطا ومحيطها بالدلتا</div>
                  </div>
                </div>
                {selectedLocation==="tanta" && !resolvedGpsName && <Svg d={ic.check} s={14} c={C.blue} sw={3}/>}
              </button>

              {/* Option 3: Cairo */}
              <button onClick={()=>{setSelectedLocation("cairo");setResolvedGpsName(null);setShowLocModal(false);}}
                style={{
                  width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"11px 12px",borderRadius:10,
                  background:selectedLocation==="cairo" && !resolvedGpsName ? t.blueBg : t.card,
                  border:`1px solid ${selectedLocation==="cairo" && !resolvedGpsName ? C.blue : t.border}`,
                  cursor:"pointer",transition:"all 0.15s",textAlign:"right"
                }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:20}}>🏙️</div>
                  <div>
                    <div style={{color:t.text,fontSize:12,fontWeight:700}}>القاهرة الكبرى والجديدة</div>
                    <div style={{color:t.textMuted,fontSize:10,marginTop:2}}>مدينة نصر، 6 أكتوبر، الشيخ زايد، والقاهرة الجديدة</div>
                  </div>
                </div>
                {selectedLocation==="cairo" && !resolvedGpsName && <Svg d={ic.check} s={14} c={C.blue} sw={3}/>}
              </button>

              {/* Option 4: GPS */}
              <button onClick={requestGPS} disabled={gpsLoading}
                style={{
                  width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",
                  padding:"11px 12px",borderRadius:10,
                  background:resolvedGpsName ? t.blueBg : t.card,
                  border:`1px solid ${resolvedGpsName ? C.blue : t.border}`,
                  cursor:gpsLoading?"not-allowed":"pointer",transition:"all 0.15s",textAlign:"right"
                }}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{fontSize:20}}>🛰️</div>
                  <div style={{flex:1}}>
                    <div style={{color:t.text,fontSize:12,fontWeight:700,display:"flex",alignItems:"center",gap:6}}>
                      تحديد موقعي التلقائي (GPS)
                      {gpsLoading && <div className="animate-spin" style={{
                        width:12,height:12,border:"2.5px solid #0ea5e9",
                        borderTopColor:"transparent",borderRadius:"50%"
                      }}/>}
                    </div>
                    <div style={{color:C.blue,fontSize:10,fontWeight:resolvedGpsName?700:500,marginTop:2}}>
                      {gpsLoading ? "جاري قراءة إحداثيات جهازك..." : (resolvedGpsName ? `محدد ذكياً: ${resolvedGpsName}` : "تحديد أقرب إعلانات لك فورياً")}
                    </div>
                  </div>
                </div>
                {resolvedGpsName && <Svg d={ic.check} s={14} c={C.blue} sw={3}/>}
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
