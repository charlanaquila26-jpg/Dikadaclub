import React, { useState, useMemo } from "react";
import {
  MapPin, Star, Clock, Users, Trophy, Search, X, Check,
  ChevronRight, CalendarDays, Plus, Minus, ArrowRight,
  CircleDot, Menu, Facebook, Instagram, Youtube, Music2,
  CalendarCheck, PartyPopper, TrendingUp, UserPlus, RefreshCcw, Zap
} from "lucide-react";

const C = {
  ink: "#16241C",
  sub: "#4B5A50",
  green900: "#0E3B2E",
  green700: "#175C43",
  green500: "#2C8C5E",
  lime: "#8FD14F",
  limeDark: "#6BAE34",
  sun: "#FFC738",
  cream: "#FAF8F2",
  card: "#FFFFFF",
  line: "#E4E1D6",
};

const FEE_RATE = 0.05;
const peso = (n) => `\u20B1${Math.round(n).toLocaleString("en-PH")}`;

const COURTS = [
  { id: "c1", name: "Playtopia Makati", area: "Makati, Metro Manila", rating: 4.8, reviews: 120, price: 350, surface: "Indoor cushioned" },
  { id: "c2", name: "The Pickle Yard BGC", area: "Taguig, Metro Manila", rating: 4.7, reviews: 98, price: 300, surface: "Outdoor acrylic" },
  { id: "c3", name: "SM North EDSA Pickleball", area: "Quezon City", rating: 4.5, reviews: 76, price: 280, surface: "Indoor cushioned" },
  { id: "c4", name: "The Grid Pasig", area: "Pasig, Metro Manila", rating: 4.6, reviews: 54, price: 300, surface: "Outdoor acrylic" },
  { id: "c5", name: "Sunburst Courts Cebu", area: "Cebu City", rating: 4.9, reviews: 63, price: 320, surface: "Indoor cushioned" },
  { id: "c6", name: "Davao Dink Park", area: "Davao City", rating: 4.4, reviews: 31, price: 260, surface: "Outdoor acrylic" },
];

const TIME_SLOTS = ["7:00 AM", "8:00 AM", "9:00 AM", "4:00 PM", "5:00 PM", "6:00 PM"];
const NEXT_DAYS = (() => {
  const days = [];
  const now = new Date();
  for (let i = 0; i < 5; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({
      key: d.toISOString().slice(0, 10),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : d.toLocaleDateString("en-PH", { weekday: "short", month: "short", day: "numeric" }),
    });
  }
  return days;
})();

const INITIAL_GAMES = [
  { id: "g1", title: "Morning Dinks", venue: "The Pickle Yard BGC", time: "Today, 8:00 AM", price: 300, level: "Intermediate", spots: 8, joined: 5 },
  { id: "g2", title: "Afternoon Social Play", venue: "Playtopia Makati", time: "Today, 4:00 PM", price: 250, level: "All Levels", spots: 12, joined: 7 },
  { id: "g3", title: "Ladies Open Play", venue: "The Grid Pasig", time: "Tomorrow, 9:00 AM", price: 250, level: "Beginner Friendly", spots: 12, joined: 6 },
  { id: "g4", title: "Sunset Mixed Doubles", venue: "Sunburst Courts Cebu", time: "Tomorrow, 5:30 PM", price: 280, level: "Intermediate", spots: 8, joined: 3 },
];

const CLUBS = [
  { id: "cl1", name: "Manila Pickleball Club", members: "1.2K", tags: ["Social", "All Levels", "Metro Manila"] },
  { id: "cl2", name: "Cebu Pickleball Community", members: "842", tags: ["Friendly", "All Levels", "Cebu"] },
  { id: "cl3", name: "Davao Dinkers", members: "518", tags: ["Competitive", "Intermediate+", "Davao"] },
  { id: "cl4", name: "Filipina Pickleballers", members: "1.1K", tags: ["Women", "All Levels", "Nationwide"] },
];

const TOURNAMENTS = [
  { id: "t1", name: "Philippine Pickleball Open 2026", date: "Apr 25 \u2013 27, 2026", venue: "Makati Sports Club", tags: ["Open", "All Levels"] },
  { id: "t2", name: "Cebu Summer Dink Fest", date: "May 17 \u2013 18, 2026", venue: "Cebu City", tags: ["Fun", "All Levels"] },
  { id: "t3", name: "Davao Pickleball Cup", date: "Jun 7 \u2013 8, 2026", venue: "Davao City", tags: ["Competitive", "Intermediate+"] },
];

function Logo({ light }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: C.lime }}
      >
        <CircleDot size={18} color={C.green900} strokeWidth={2.5} />
      </div>
      <div>
        <div className="font-extrabold text-lg leading-none" style={{ color: light ? "#fff" : C.green900 }}>
          Dinkadaclub<span style={{ color: C.lime }}>.ph</span>
        </div>
        <div className="text-[10px] tracking-wide leading-none mt-0.5" style={{ color: light ? "rgba(255,255,255,0.65)" : C.sub }}>
          play &middot; book &middot; belong
        </div>
      </div>
    </div>
  );
}

function Pill({ children, tone = "green" }) {
  const map = {
    green: { bg: "#E7F3E9", fg: C.green700 },
    sun: { bg: "#FFF4D6", fg: "#8A6100" },
    lime: { bg: "#EEF9DE", fg: C.limeDark },
  };
  const s = map[tone] || map.green;
  return (
    <span
      className="text-xs font-medium px-2.5 py-1 rounded-full"
      style={{ background: s.bg, color: s.fg }}
    >
      {children}
    </span>
  );
}

function NavBar({ view, setView, onSignUp }) {
  const [open, setOpen] = useState(false);
  const tabs = [
    ["home", "Home"],
    ["play", "Play"],
    ["queue", "Queue"],
    ["courts", "Courts"],
    ["clubs", "Clubs"],
    ["tournaments", "Tournaments"],
  ];
  return (
    <div className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: C.line }}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        <button onClick={() => setView("home")} className="shrink-0">
          <Logo />
        </button>
        <div className="hidden md:flex items-center gap-1">
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => setView(key)}
              className="px-3.5 py-2 rounded-full text-sm font-semibold transition-colors"
              style={{
                color: view === key ? C.green900 : C.sub,
                background: view === key ? "#EEF6EC" : "transparent",
              }}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3">
          <button className="text-sm font-semibold" style={{ color: C.green900 }}>
            Log in
          </button>
          <button
            onClick={onSignUp}
            className="text-sm font-semibold px-4 py-2 rounded-full text-white"
            style={{ background: C.green900 }}
          >
            Sign up
          </button>
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          <Menu size={22} color={C.green900} />
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t px-4 py-3 flex flex-col gap-1" style={{ borderColor: C.line }}>
          {tabs.map(([key, label]) => (
            <button
              key={key}
              onClick={() => { setView(key); setOpen(false); }}
              className="text-left px-3 py-2.5 rounded-lg text-sm font-semibold"
              style={{ color: view === key ? C.green900 : C.sub, background: view === key ? "#EEF6EC" : "transparent" }}
            >
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function CourtScene() {
  return (
    <svg viewBox="0 0 520 380" className="w-full h-full" role="img" aria-label="Illustration of two players on a pickleball court">
      <rect x="40" y="40" width="440" height="300" rx="14" fill="#2C8C5E" />
      <rect x="58" y="58" width="404" height="264" rx="8" fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
      <line x1="260" y1="58" x2="260" y2="322" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
      <rect x="58" y="130" width="404" height="120" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
      <circle cx="120" cy="230" r="26" fill="#FFC738" />
      <rect x="97" y="256" width="46" height="70" rx="16" fill="#0E3B2E" />
      <circle cx="380" cy="150" r="26" fill="#FFDD8F" />
      <rect x="357" y="176" width="46" height="70" rx="16" fill="#F7F5EE" />
      <circle cx="400" cy="230" r="12" fill="#DBEE3C" stroke="#0E3B2E" strokeWidth="2" />
      <g transform="translate(430,70)">
        <circle r="24" fill="#FFC738" />
        <path d="M-10 -3 Q0 -14 10 -3" stroke="#0E3B2E" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <circle cx="-7" cy="-4" r="2.2" fill="#0E3B2E" />
        <circle cx="7" cy="-4" r="2.2" fill="#0E3B2E" />
      </g>
    </svg>
  );
}

function Hero({ setView }) {
  return (
    <div style={{ background: C.green900 }} className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-14 md:py-20 relative z-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="flex items-center gap-2 mb-5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: C.lime }}>
              <CircleDot size={20} color={C.green900} strokeWidth={2.5} />
            </div>
            <span className="font-extrabold text-2xl text-white">Dinkadaclub<span style={{ color: C.lime }}>.ph</span></span>
          </div>
          <h1 className="font-extrabold leading-[1.08] text-4xl md:text-5xl" style={{ color: "#fff" }}>
            Find your court.<br />
            Find your game.<br />
            <span style={{ color: C.lime }}>Find your people.</span>
          </h1>
          <p className="mt-5 max-w-md text-base" style={{ color: "rgba(255,255,255,0.75)" }}>
            Courts. Games. Clubs. Community. All in one place.<br />
            A bigger, friendlier pickleball Philippines.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              onClick={() => setView("play")}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold"
              style={{ background: C.lime, color: C.green900 }}
            >
              <Search size={18} /> Find a game
            </button>
            <button
              onClick={() => setView("courts")}
              className="flex items-center gap-2 px-5 py-3 rounded-full font-semibold text-white"
              style={{ background: "#2660D8" }}
            >
              <CalendarDays size={18} /> Book a court
            </button>
          </div>
        </div>
        <div className="relative">
          <CourtScene />
          <div className="absolute -top-2 right-2 text-right hidden md:block" style={{ color: "rgba(255,255,255,0.85)" }}>
            <p className="text-xs italic leading-tight">Same sport.<br />A brighter Philippines.</p>
          </div>
        </div>
      </div>
      <div className="absolute -right-16 -bottom-20 w-72 h-72 rounded-full opacity-10" style={{ background: C.sun }} />
    </div>
  );
}

function SectionHeader({ icon, title, sub, onSeeAll }) {
  return (
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EEF6EC" }}>
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-lg" style={{ color: C.ink }}>{title}</h2>
          {sub && <p className="text-sm" style={{ color: C.sub }}>{sub}</p>}
        </div>
      </div>
      {onSeeAll && (
        <button onClick={onSeeAll} className="text-sm font-semibold flex items-center gap-1 shrink-0" style={{ color: C.green700 }}>
          See all <ChevronRight size={15} />
        </button>
      )}
    </div>
  );
}

function GameCard({ game, onJoin }) {
  const left = game.spots - game.joined;
  const full = left <= 0;
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: C.line, background: C.card }}>
      <div>
        <h3 className="font-semibold" style={{ color: C.ink }}>{game.title}</h3>
        <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: C.sub }}>
          <MapPin size={14} /> {game.venue}
        </div>
        <div className="flex items-center gap-1.5 text-sm mt-0.5" style={{ color: C.sub }}>
          <Clock size={14} /> {game.time}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Pill>{game.level}</Pill>
        <span className="text-xs font-medium" style={{ color: full ? "#B54141" : C.sub }}>
          {full ? "Full" : `${left}/${game.spots} spots`}
        </span>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-bold" style={{ color: C.green900 }}>{peso(game.price)}</span>
        <button
          disabled={full}
          onClick={() => onJoin(game)}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white disabled:opacity-40"
          style={{ background: C.green700 }}
        >
          {full ? "Full" : "Join"}
        </button>
      </div>
    </div>
  );
}

function CourtCard({ court, onBook }) {
  return (
    <div className="rounded-xl border p-4 flex flex-col gap-3" style={{ borderColor: C.line, background: C.card }}>
      <div
        className="h-28 rounded-lg flex items-center justify-center"
        style={{ background: "linear-gradient(135deg,#175C43,#2C8C5E)" }}
      >
        <div className="text-white text-xs font-semibold tracking-wide opacity-90">{court.surface}</div>
      </div>
      <div>
        <h3 className="font-semibold" style={{ color: C.ink }}>{court.name}</h3>
        <div className="flex items-center gap-1.5 text-sm mt-1" style={{ color: C.sub }}>
          <MapPin size={14} /> {court.area}
        </div>
        <div className="flex items-center gap-1.5 text-sm mt-0.5" style={{ color: C.sub }}>
          <Star size={14} fill={C.sun} color={C.sun} /> {court.rating} ({court.reviews} reviews)
        </div>
      </div>
      <div className="flex items-center justify-between pt-1">
        <span className="font-bold" style={{ color: C.green900 }}>{peso(court.price)}<span className="font-normal text-sm" style={{ color: C.sub }}>/hr</span></span>
        <button
          onClick={() => onBook(court)}
          className="px-4 py-2 rounded-full text-sm font-semibold text-white"
          style={{ background: C.green700 }}
        >
          Book
        </button>
      </div>
    </div>
  );
}

function Modal({ onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center" style={{ background: "rgba(14,59,46,0.45)" }}>
      <div className="bg-white w-full md:max-w-md md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex justify-end px-4 pt-4">
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F1F0E9" }} aria-label="Close">
            <X size={16} color={C.ink} />
          </button>
        </div>
        <div className="px-6 pb-6 pt-1">{children}</div>
      </div>
    </div>
  );
}

function Stepper({ value, setValue, min = 1, max = 4 }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => setValue(Math.max(min, value - 1))}
        className="w-9 h-9 rounded-full flex items-center justify-center border disabled:opacity-30"
        style={{ borderColor: C.line }}
        disabled={value <= min}
      >
        <Minus size={16} color={C.ink} />
      </button>
      <span className="font-bold text-lg w-6 text-center" style={{ color: C.ink }}>{value}</span>
      <button
        onClick={() => setValue(Math.min(max, value + 1))}
        className="w-9 h-9 rounded-full flex items-center justify-center border disabled:opacity-30"
        style={{ borderColor: C.line }}
        disabled={value >= max}
      >
        <Plus size={16} color={C.ink} />
      </button>
    </div>
  );
}

function FeeBreakdown({ subtotal }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "#F7F5EE" }}>
      <div className="flex justify-between font-bold" style={{ color: C.ink }}>
        <span>Total</span>
        <span>{peso(subtotal)}</span>
      </div>
    </div>
  );
}

function BookCourtModal({ court, onClose }) {
  const [date, setDate] = useState(NEXT_DAYS[0].key);
  const [time, setTime] = useState(TIME_SLOTS[0]);
  const [hours, setHours] = useState(2);
  const [done, setDone] = useState(false);
  const subtotal = court.price * hours;
  const ref = useMemo(() => "DKC-" + Math.random().toString(36).slice(2, 8).toUpperCase(), [done]);

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#EEF9DE" }}>
            <Check size={26} color={C.limeDark} />
          </div>
          <h3 className="font-bold text-xl" style={{ color: C.ink }}>Court booked</h3>
          <p className="text-sm mt-1" style={{ color: C.sub }}>{court.name} &middot; {NEXT_DAYS.find(d => d.key === date)?.label}, {time} &middot; {hours}h</p>
          <p className="text-xs mt-3 font-mono" style={{ color: C.sub }}>Booking ref {ref}</p>
          <button onClick={onClose} className="mt-6 w-full py-3 rounded-full font-semibold text-white" style={{ background: C.green900 }}>
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="font-bold text-xl mb-1" style={{ color: C.ink }}>{court.name}</h3>
      <div className="flex items-center gap-1.5 text-sm mb-5" style={{ color: C.sub }}>
        <MapPin size={14} /> {court.area}
      </div>

      <p className="text-sm font-semibold mb-2" style={{ color: C.ink }}>Pick a date</p>
      <div className="flex gap-2 overflow-x-auto pb-1 mb-5">
        {NEXT_DAYS.map((d) => (
          <button
            key={d.key}
            onClick={() => setDate(d.key)}
            className="px-3 py-2 rounded-lg text-xs font-semibold shrink-0 border"
            style={{
              borderColor: date === d.key ? C.green700 : C.line,
              background: date === d.key ? "#EEF6EC" : "#fff",
              color: date === d.key ? C.green700 : C.sub,
            }}
          >
            {d.label}
          </button>
        ))}
      </div>

      <p className="text-sm font-semibold mb-2" style={{ color: C.ink }}>Pick a time</p>
      <div className="grid grid-cols-3 gap-2 mb-5">
        {TIME_SLOTS.map((t) => (
          <button
            key={t}
            onClick={() => setTime(t)}
            className="py-2 rounded-lg text-xs font-semibold border"
            style={{
              borderColor: time === t ? C.green700 : C.line,
              background: time === t ? "#EEF6EC" : "#fff",
              color: time === t ? C.green700 : C.sub,
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-semibold" style={{ color: C.ink }}>Hours ({peso(court.price)}/hr)</p>
        <Stepper value={hours} setValue={setHours} />
      </div>

      <FeeBreakdown subtotal={subtotal} />

      <button
        onClick={() => setDone(true)}
        className="mt-5 w-full py-3 rounded-full font-semibold text-white"
        style={{ background: C.green900 }}
      >
        Confirm booking &middot; {peso(subtotal)}
      </button>
    </Modal>
  );
}

function JoinGameModal({ game, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Modal onClose={onClose}>
        <div className="flex flex-col items-center text-center py-4">
          <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4" style={{ background: "#EEF9DE" }}>
            <Check size={26} color={C.limeDark} />
          </div>
          <h3 className="font-bold text-xl" style={{ color: C.ink }}>You're in!</h3>
          <p className="text-sm mt-1" style={{ color: C.sub }}>{game.title} &middot; {game.venue} &middot; {game.time}</p>
          <button onClick={onClose} className="mt-6 w-full py-3 rounded-full font-semibold text-white" style={{ background: C.green900 }}>
            Done
          </button>
        </div>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      <h3 className="font-bold text-xl mb-1" style={{ color: C.ink }}>{game.title}</h3>
      <div className="flex items-center gap-1.5 text-sm" style={{ color: C.sub }}>
        <MapPin size={14} /> {game.venue}
      </div>
      <div className="flex items-center gap-1.5 text-sm mb-5" style={{ color: C.sub }}>
        <Clock size={14} /> {game.time}
      </div>

      <p className="text-sm font-semibold mb-2" style={{ color: C.ink }}>Your name</p>
      <input
        value={name}
        onChange={(e) => { setName(e.target.value); if (error) setError(""); }}
        placeholder="Juan Dela Cruz"
        className="w-full border rounded-lg px-3 py-2.5 text-sm mb-1 outline-none"
        style={{ borderColor: error ? "#D9534F" : C.line }}
      />
      {error && <p className="text-xs mb-3" style={{ color: "#D9534F" }}>{error}</p>}
      {!error && <div className="mb-4" />}

      <FeeBreakdown subtotal={game.price} />

      <button
        onClick={() => {
          if (!name.trim()) { setError("Enter your name to join."); return; }
          onConfirm(game.id);
          setDone(true);
        }}
        className="mt-5 w-full py-3 rounded-full font-semibold text-white"
        style={{ background: C.green900 }}
      >
        Confirm spot &middot; {peso(game.price)}
      </button>
    </Modal>
  );
}

function MiniColHeader({ icon, title, sub, onSeeAll }) {
  return (
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#EEF6EC" }}>
          {icon}
        </div>
        <div>
          <h2 className="font-bold text-[15px] leading-tight" style={{ color: C.ink }}>{title}</h2>
          <p className="text-xs leading-tight" style={{ color: C.sub }}>{sub}</p>
        </div>
      </div>
      <button onClick={onSeeAll} className="text-xs font-semibold flex items-center gap-0.5 shrink-0 mt-1" style={{ color: C.green700 }}>
        See all <ChevronRight size={12} />
      </button>
    </div>
  );
}

function CompactGameRow({ game, onJoin }) {
  const left = game.spots - game.joined;
  const full = left <= 0;
  return (
    <div className="flex gap-3 rounded-lg border p-2.5" style={{ borderColor: C.line, background: C.card }}>
      <div className="w-14 h-14 rounded-md shrink-0" style={{ background: "linear-gradient(135deg,#175C43,#8FD14F)" }} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: C.ink }}>{game.title}</p>
        <p className="text-xs truncate flex items-center gap-1 mt-0.5" style={{ color: C.sub }}><MapPin size={11} />{game.venue}</p>
        <p className="text-xs flex items-center gap-1" style={{ color: C.sub }}><Clock size={11} />{game.time}</p>
        <div className="flex items-center justify-between mt-1.5">
          <span className="text-xs font-bold" style={{ color: C.green900 }}>{peso(game.price)}</span>
          <button
            disabled={full}
            onClick={() => onJoin(game)}
            className="px-3 py-1 rounded-full text-xs font-semibold text-white disabled:opacity-40"
            style={{ background: C.green700 }}
          >
            {full ? "Full" : "Join"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CompactCourtRow({ court, onBook }) {
  return (
    <div className="flex gap-3 rounded-lg border p-2.5" style={{ borderColor: C.line, background: C.card }}>
      <div className="w-14 h-14 rounded-md shrink-0" style={{ background: "linear-gradient(135deg,#2C8C5E,#FFC738)" }} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: C.ink }}>{court.name}</p>
        <p className="text-xs truncate" style={{ color: C.sub }}>{court.area}</p>
        <p className="text-xs flex items-center gap-1" style={{ color: C.sub }}><Star size={11} fill={C.sun} color={C.sun} />{court.rating} ({court.reviews})</p>
        <div className="flex items-center justify-end mt-1.5">
          <button
            onClick={() => onBook(court)}
            className="px-3 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: C.green700 }}
          >
            Book
          </button>
        </div>
      </div>
    </div>
  );
}

function MiniMapPreview({ courts, onBook, setView }) {
  const pins = [
    { top: "18%", left: "20%" }, { top: "35%", left: "62%" },
    { top: "58%", left: "30%" }, { top: "72%", left: "55%" },
  ];
  return (
    <div className="rounded-lg overflow-hidden border relative mb-2" style={{ borderColor: C.line, height: 108, background: "#E9EEDD" }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 108">
        <path d="M0 30 Q60 10 90 40 T200 25 V108 H0 Z" fill="#DCE6C7" />
        <path d="M0 70 Q80 90 140 65 T200 80 V108 H0 Z" fill="#D2DFC0" />
      </svg>
      {pins.map((p, i) => (
        <div key={i} className="absolute w-2.5 h-2.5 rounded-full border-2 border-white" style={{ top: p.top, left: p.left, background: i === 0 ? C.sun : C.green700 }} />
      ))}
      <button
        onClick={() => setView("courts")}
        className="absolute bottom-1.5 right-1.5 text-[10px] font-semibold px-2 py-1 rounded-full text-white"
        style={{ background: C.green900 }}
      >
        View map
      </button>
    </div>
  );
}

function CompactClubRow({ club }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border p-2.5" style={{ borderColor: C.line, background: C.card }}>
      <div className="w-9 h-9 rounded-full shrink-0" style={{ background: "linear-gradient(135deg,#175C43,#2C8C5E)" }} />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm truncate" style={{ color: C.ink }}>{club.name}</p>
        <p className="text-xs" style={{ color: C.sub }}>{club.members} members</p>
      </div>
      <button className="px-3 py-1 rounded-full text-xs font-semibold shrink-0" style={{ background: "#EEF6EC", color: C.green700 }}>
        Join
      </button>
    </div>
  );
}

function CompactTournamentRow({ t }) {
  return (
    <div className="flex gap-3 rounded-lg border p-2.5" style={{ borderColor: C.line, background: C.card }}>
      <div className="w-14 h-14 rounded-md shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0E3B2E,#FFC738)" }}>
        <Trophy size={18} color="#fff" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm leading-tight" style={{ color: C.ink }}>{t.name}</p>
        <p className="text-xs mt-0.5" style={{ color: C.sub }}>{t.date}</p>
        <p className="text-xs" style={{ color: C.sub }}>{t.venue}</p>
      </div>
    </div>
  );
}

function HostAndFeeSection({ setView }) {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="rounded-2xl p-6 flex items-center gap-6 flex-wrap" style={{ background: "#EAF3E4" }}>
        <div className="flex-1 min-w-[220px]">
          <h3 className="font-extrabold text-xl" style={{ color: C.ink }}>Host a court or create a club</h3>
          <p className="text-sm mt-1" style={{ color: C.sub }}>Are you a venue owner, coach, or community leader? List your courts, manage bookings, organize events, and grow your community &mdash; all on Dinkadaclub.ph.</p>
          <div className="flex gap-5 mt-4">
            <div className="flex flex-col items-center gap-1">
              <CalendarCheck size={20} color={C.green700} />
              <span className="text-[11px] text-center" style={{ color: C.sub }}>Manage<br />bookings</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <PartyPopper size={20} color={C.green700} />
              <span className="text-[11px] text-center" style={{ color: C.sub }}>Create<br />events</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <TrendingUp size={20} color={C.green700} />
              <span className="text-[11px] text-center" style={{ color: C.sub }}>Grow your<br />community</span>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={() => setView("courts")} className="px-4 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: C.green700 }}>
              Get started as a host
            </button>
            <button className="px-4 py-2.5 rounded-full text-sm font-semibold" style={{ color: C.green900 }}>
              Learn more
            </button>
          </div>
        </div>
      </div>
      <div className="rounded-2xl p-6 flex items-center justify-between gap-4" style={{ background: "#EAF1FB" }}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Zap size={16} color="#2660D8" />
            <p className="text-sm font-semibold" style={{ color: "#2660D8" }}>New: live open play queue</p>
          </div>
          <p className="font-extrabold text-xl" style={{ color: C.ink }}>Skip the paddle stack</p>
          <p className="text-sm mt-2 max-w-[260px]" style={{ color: C.sub }}>Check in, get auto-assigned to a court, and rotate fairly &mdash; no more guessing who's next.</p>
          <button onClick={() => setView("queue")} className="mt-4 px-4 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: "#2660D8" }}>
            Open the queue
          </button>
        </div>
        <div className="hidden sm:flex w-20 h-20 rounded-full items-center justify-center shrink-0" style={{ background: "#CFE0FA" }}>
          <RefreshCcw size={30} color="#2660D8" />
        </div>
      </div>
    </div>
  );
}

function HomeView({ setView, games, courts, onJoin, onBook }) {
  return (
    <div>
      <Hero setView={setView} />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div>
            <MiniColHeader icon={<Users size={14} color={C.green700} />} title="Open plays near you" sub="Join a game" onSeeAll={() => setView("play")} />
            <div className="space-y-2">
              {games.slice(0, 3).map((g) => <CompactGameRow key={g.id} game={g} onJoin={onJoin} />)}
            </div>
          </div>
          <div>
            <MiniColHeader icon={<MapPin size={14} color={C.green700} />} title="Courts near you" sub="Book a court" onSeeAll={() => setView("courts")} />
            <MiniMapPreview courts={courts} onBook={onBook} setView={setView} />
            <div className="space-y-2">
              {courts.slice(0, 2).map((c) => <CompactCourtRow key={c.id} court={c} onBook={onBook} />)}
            </div>
          </div>
          <div>
            <MiniColHeader icon={<Users size={14} color={C.green700} />} title="Clubs and community" sub="Find your tribe" onSeeAll={() => setView("clubs")} />
            <div className="space-y-2">
              {CLUBS.slice(0, 4).map((c) => <CompactClubRow key={c.id} club={c} />)}
            </div>
          </div>
          <div>
            <MiniColHeader icon={<Trophy size={14} color={C.green700} />} title="Tournaments and events" sub="Compete, represent" onSeeAll={() => setView("tournaments")} />
            <div className="space-y-2">
              {TOURNAMENTS.map((t) => <CompactTournamentRow key={t.id} t={t} />)}
            </div>
          </div>
        </div>
        <div className="mt-10">
          <HostAndFeeSection setView={setView} />
        </div>
      </div>
    </div>
  );
}

function PlayView({ games, onJoin }) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-extrabold text-3xl mb-1" style={{ color: C.ink }}>Open plays</h1>
      <p className="mb-6" style={{ color: C.sub }}>Join a game and meet new players around you.</p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {games.map((g) => <GameCard key={g.id} game={g} onJoin={onJoin} />)}
      </div>
    </div>
  );
}

function CourtsView({ courts, onBook }) {
  const [query, setQuery] = useState("");
  const filtered = courts.filter((c) =>
    (c.name + " " + c.area).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-extrabold text-3xl mb-1" style={{ color: C.ink }}>Book a court</h1>
      <p className="mb-6" style={{ color: C.sub }}>Search by court name or city.</p>
      <div className="relative max-w-md mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" color={C.sub} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try 'Makati' or 'Cebu'"
          className="w-full border rounded-full pl-9 pr-4 py-2.5 text-sm outline-none"
          style={{ borderColor: C.line }}
        />
      </div>
      {filtered.length === 0 ? (
        <p style={{ color: C.sub }}>No courts match "{query}".</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => <CourtCard key={c.id} court={c} onBook={onBook} />)}
        </div>
      )}
    </div>
  );
}

function ClubsView() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-extrabold text-3xl mb-1" style={{ color: C.ink }}>Clubs and community</h1>
      <p className="mb-6" style={{ color: C.sub }}>Find your tribe. Play together. Grow together.</p>
      <div className="grid sm:grid-cols-2 gap-4">
        {CLUBS.map((c) => (
          <div key={c.id} className="rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: C.line }}>
            <div>
              <h3 className="font-semibold" style={{ color: C.ink }}>{c.name}</h3>
              <p className="text-sm mt-0.5" style={{ color: C.sub }}>{c.members} members</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                {c.tags.map((t) => <Pill key={t}>{t}</Pill>)}
              </div>
            </div>
            <button className="px-4 py-2 rounded-full text-sm font-semibold shrink-0" style={{ background: "#EEF6EC", color: C.green700 }}>
              Join club
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function TournamentsView() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-extrabold text-3xl mb-1" style={{ color: C.ink }}>Tournaments and events</h1>
      <p className="mb-6" style={{ color: C.sub }}>Compete, connect, represent.</p>
      <div className="grid sm:grid-cols-3 gap-4">
        {TOURNAMENTS.map((t) => (
          <div key={t.id} className="rounded-xl border p-4" style={{ borderColor: C.line }}>
            <h3 className="font-semibold" style={{ color: C.ink }}>{t.name}</h3>
            <p className="text-sm mt-1" style={{ color: C.sub }}>{t.date}</p>
            <p className="text-sm" style={{ color: C.sub }}>{t.venue}</p>
            <div className="flex gap-2 mt-3 flex-wrap">
              {t.tags.map((tag) => <Pill key={tag} tone="sun">{tag}</Pill>)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const QUEUE_COURTS = [1, 2, 3, 4];

function QueueView() {
  const [nameInput, setNameInput] = useState("");
  const [waiting, setWaiting] = useState(["Marco", "Bea", "Jun", "Liza", "Paolo", "Anne"]);
  const [courts, setCourts] = useState({ 1: ["Ella", "Rico", "Nikki", "Sam"], 2: [], 3: [], 4: [] });

  const checkIn = () => {
    const name = nameInput.trim();
    if (!name) return;
    setWaiting((prev) => [...prev, name]);
    setNameInput("");
  };

  const assignCourt = (courtId) => {
    setWaiting((prev) => {
      if (prev.length < 4) return prev;
      const next4 = prev.slice(0, 4);
      const rest = prev.slice(4);
      setCourts((c) => ({ ...c, [courtId]: next4 }));
      return rest;
    });
  };

  const finishGame = (courtId) => {
    setCourts((prev) => {
      const players = prev[courtId];
      if (players.length) {
        setWaiting((w) => [...w, ...players]);
      }
      return { ...prev, [courtId]: [] };
    });
  };

  const upNext = waiting.slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center gap-2 mb-1">
        <RefreshCcw size={18} color="#2660D8" />
        <h1 className="font-extrabold text-3xl" style={{ color: C.ink }}>Live queue</h1>
      </div>
      <p className="mb-6" style={{ color: C.sub }}>Check in, get seated on the next open court, rotate when the game ends. No paddle stack needed.</p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="rounded-xl border p-4 mb-4" style={{ borderColor: C.line, background: C.card }}>
            <p className="text-sm font-semibold mb-2" style={{ color: C.ink }}>Check in</p>
            <div className="flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkIn()}
                placeholder="Player name"
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none"
                style={{ borderColor: C.line }}
              />
              <button onClick={checkIn} className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: C.green700 }} aria-label="Add player">
                <UserPlus size={18} color="#fff" />
              </button>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ borderColor: C.line, background: C.card }}>
            <p className="text-sm font-semibold mb-1" style={{ color: C.ink }}>Up next</p>
            <p className="text-xs mb-3" style={{ color: C.sub }}>{waiting.length} in queue</p>
            {upNext.length === 0 ? (
              <p className="text-sm" style={{ color: C.sub }}>Nobody waiting right now.</p>
            ) : (
              <ol className="space-y-2">
                {upNext.map((p, i) => (
                  <li key={p + i} className="flex items-center gap-2 text-sm" style={{ color: C.ink }}>
                    <span className="w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ background: "#EEF6EC", color: C.green700 }}>{i + 1}</span>
                    {p}
                  </li>
                ))}
              </ol>
            )}
            {waiting.length > 4 && (
              <p className="text-xs mt-3" style={{ color: C.sub }}>+{waiting.length - 4} more waiting</p>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
          {QUEUE_COURTS.map((id) => {
            const players = courts[id];
            const occupied = players.length > 0;
            return (
              <div key={id} className="rounded-xl border p-4" style={{ borderColor: C.line, background: occupied ? "#F1F8EE" : C.card }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm" style={{ color: C.ink }}>Court {id}</p>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: occupied ? "#DDEFCE" : "#F1F0E9", color: occupied ? C.limeDark : C.sub }}
                  >
                    {occupied ? "In play" : "Open"}
                  </span>
                </div>
                {occupied ? (
                  <>
                    <div className="grid grid-cols-2 gap-1.5 mb-4">
                      {players.map((p) => (
                        <div key={p} className="text-xs font-medium px-2 py-1.5 rounded-lg text-center truncate" style={{ background: "#fff", color: C.ink }}>
                          {p}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => finishGame(id)}
                      className="w-full py-2 rounded-full text-xs font-semibold text-white"
                      style={{ background: C.green700 }}
                    >
                      Finish game &middot; rotate
                    </button>
                  </>
                ) : (
                  <button
                    disabled={waiting.length < 4}
                    onClick={() => assignCourt(id)}
                    className="w-full py-2 rounded-full text-xs font-semibold text-white disabled:opacity-40"
                    style={{ background: "#2660D8" }}
                  >
                    {waiting.length < 4 ? `Need ${4 - waiting.length} more to fill` : "Assign next 4"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Footer() {
  const icons = [Facebook, Instagram, Youtube, Music2];
  return (
    <div style={{ background: C.green900 }} className="mt-10">
      <div className="max-w-6xl mx-auto px-6 py-6 flex flex-wrap items-center justify-between gap-4">
        <Logo light />
        <p className="text-sm text-center" style={{ color: "rgba(255,255,255,0.6)" }}>
          More people. More courts. A stronger pickleball Philippines.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            {icons.map((Icon, i) => (
              <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.12)" }}>
                <Icon size={15} color="#fff" />
              </div>
            ))}
          </div>
          <p className="text-xs hidden lg:block" style={{ color: "rgba(255,255,255,0.5)" }}>
            #DinkadaclubPH &nbsp; #PlayBelong &nbsp; #PickleballPH
          </p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState("home");
  const [games, setGames] = useState(INITIAL_GAMES);
  const [bookingCourt, setBookingCourt] = useState(null);
  const [joiningGame, setJoiningGame] = useState(null);

  const handleJoinConfirm = (gameId) => {
    setGames((prev) => prev.map((g) => g.id === gameId ? { ...g, joined: Math.min(g.spots, g.joined + 1) } : g));
  };

  return (
    <div style={{ background: C.cream, minHeight: "100%", fontFamily: "ui-sans-serif, system-ui, -apple-system, sans-serif" }}>
      <NavBar view={view} setView={setView} onSignUp={() => setView("home")} />
      {view === "home" && <HomeView setView={setView} games={games} courts={COURTS} onJoin={setJoiningGame} onBook={setBookingCourt} />}
      {view === "play" && <PlayView games={games} onJoin={setJoiningGame} />}
      {view === "queue" && <QueueView />}
      {view === "courts" && <CourtsView courts={COURTS} onBook={setBookingCourt} />}
      {view === "clubs" && <ClubsView />}
      {view === "tournaments" && <TournamentsView />}
      <Footer />

      {bookingCourt && <BookCourtModal court={bookingCourt} onClose={() => setBookingCourt(null)} />}
      {joiningGame && (
        <JoinGameModal
          game={joiningGame}
          onClose={() => setJoiningGame(null)}
          onConfirm={handleJoinConfirm}
        />
      )}
    </div>
  );
}
