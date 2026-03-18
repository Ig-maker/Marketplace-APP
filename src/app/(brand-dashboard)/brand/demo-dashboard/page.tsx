import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Dashboard — Shelvian",
};

export default async function BrandDemoDashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      {/* Alert Banner */}
      <div className="brand-alert" id="alert-bar">
        <svg width="13" height="13" className="flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M8 1.5L1 14.5h14L8 1.5z" />
          <line x1="8" y1="6.5" x2="8" y2="9.5" />
          <line x1="8" y1="11.5" x2="8.01" y2="11.5" strokeWidth="2" />
        </svg>
        <div>
          <strong>Action needed:</strong> Parker N. at Target LA has not filed her shift report — 2h overdue.{" "}
          <span className="underline cursor-pointer font-semibold">Send reminder →</span>
        </div>
        <div className="w-px h-3.5 bg-amber/25 flex-shrink-0" />
        <svg width="12" height="12" className="flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
          <polygon points="9,1.5 2.5,9.5 7.5,9.5 7,14.5 13.5,6.5 8.5,6.5" />
        </svg>
        <span className="whitespace-nowrap">
          Sprouts Chicago: <strong>low velocity</strong> — 12/100 after 2 hrs
        </span>
      </div>

      <div className="brand-content">
        {/* Welcome */}
        <div className="brand-welcome">
          <div>
            <div className="flex items-baseline gap-3 flex-wrap">
              <h2 className="font-serif text-[23px] font-normal">
                Welcome back, <em className="italic underline decoration-[var(--lime)] underline-offset-2">{user?.name ?? "Jake"}.</em>
              </h2>
              <div className="brand-live-pill">
                <span className="brand-live-dot" />
                14 shifts live
              </div>
            </div>
            <div className="text-[11.5px] text-[var(--text3)] mt-0.5">
              Tuesday Mar 17 · Campaign Day 7 of 31 · OLIPOP Spring Sampling
            </div>
          </div>
          <div className="brand-welcome-end">
            <button type="button" className="brand-tb-btn ghost text-[11px]">
              <FileIcon /> Campaign Brief
            </button>
            <button type="button" className="brand-tb-btn ghost text-[11px]">
              <BarIcon /> Weekly Report
            </button>
          </div>
        </div>

        {/* KPI Strip */}
        <div className="brand-kpi-strip">
          <KpiCard
            label="Total Samples"
            value="12,480"
            sub={<><span className="text-[var(--green)] font-semibold">↑ +15%</span><span className="text-[var(--text3)]"> vs last week</span></>}
            spark
          />
          <KpiCard
            label="Conversion Rate"
            value="34.2%"
            sub={<><span className="text-[var(--green)] font-semibold">↑ +2.1pp</span><span className="text-[var(--text3)]"> avg sample→sale</span></>}
            spark
          />
          <KpiCard
            label="Campaign ROI"
            value="4.2×"
            sub="$35k attributed revenue"
            bar={67}
          />
          <KpiCard
            label="Active Shifts"
            value="14"
            sub={<><span className="text-[var(--text3)]">across</span><span className="font-mono font-semibold text-[var(--dark)]">8</span><span className="text-[var(--text3)]">cities</span></>}
            spark
          />
          <KpiCard
            label="Total Spend"
            value="$8,340"
            sub="of $12,540 budget"
            bar={66}
          />
          <KpiCard
            label="Avg Rating"
            value="4.8★"
            sub="47 ambassadors"
            spark
          />
        </div>

        {/* Row 1: Shift Feed + Right Column */}
        <div className="brand-g2">
          {/* Shift Feed */}
          <div className="brand-panel">
            <div className="brand-panel-head">
              <span className="brand-badge b-green">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--green)] inline-block" />
                Live
              </span>
              <div className="font-serif text-[14.5px] text-[var(--dark)]">Shift Feed</div>
              <span className="font-mono text-[9px] text-[var(--text3)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">
                14 active
              </span>
              <div className="flex-1 min-w-1" />
              <a href="#" className="brand-ph-link">
                <PinIcon /> View Map <ChevIcon />
              </a>
            </div>
            <div className="brand-panel-body">
              <ShiftRow
                status="gr"
                store="Whole Foods Market — Domain Northside, Austin TX"
                ambassador="Jenna K."
                ambassadorMeta="5.0★ · 12 prior shifts"
                time="10:00–4:00 PM"
                location="Austin, TX"
                skus="Cherry Vanilla, Vintage Cola"
                tags={["In Progress", "4 photos", "Top Velocity"]}
                samples="82 / 120"
                progress={68}
                progressClass="li"
                note="68% · ETA 1:30 PM"
              />
              <ShiftRow
                status="am"
                store="Target — Silver Lake, Los Angeles CA"
                ambassador="Parker N."
                ambassadorMeta="Report 2h overdue"
                ambassadorMetaClass="text-[var(--amber)]"
                time="10:00 AM–12:00 PM"
                location="Los Angeles, CA"
                skus="Strawberry Vanilla"
                tags={["Pending Report", "2 photos"]}
                samples="115 / 120"
                progress={96}
                progressClass="gr"
                note="Report needed"
                noteClass="text-[var(--amber)]"
              />
              <ShiftRow
                status="am"
                store="Sprouts Farmers Market — Chicago Loop, IL"
                ambassador="Reese M."
                ambassadorMeta="4.6★ · first shift here"
                time="11:00 AM–3:00 PM"
                location="Chicago, IL"
                skus="Grape, Vintage Cola"
                tags={["In Progress", "1 photo"]}
                samples="12 / 100"
                progress={12}
                progressClass="am"
                note="Low velocity"
                noteClass="text-[var(--amber)]"
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {/* Top Ambassadors */}
            <div className="brand-panel">
              <div className="brand-panel-head">
                <StarIcon />
                <div className="font-serif text-[14.5px] text-[var(--dark)]">Top Ambassadors</div>
                <div className="flex-1 min-w-1" />
                <a href="#" className="brand-ph-link">All <ChevIcon /></a>
              </div>
              <div className="brand-panel-body">
                <AmbassadorRow name="Jenna K." sub="5.0★ · 12 shifts" value="$1,240" bar={92} />
                <AmbassadorRow name="Parker N." sub="4.9★ · 8 shifts" value="$980" bar={78} />
                <AmbassadorRow name="Reese M." sub="4.6★ · 3 shifts" value="$420" bar={45} />
              </div>
            </div>

            {/* Live Transcripts */}
            <div className="brand-panel">
              <div className="brand-panel-head">
                <MicIcon />
                <div className="font-serif text-[14.5px] text-[var(--dark)]">Live Transcripts</div>
                <span className="font-mono text-[8.5px] font-medium uppercase tracking-wider bg-[var(--red-bg)] text-[var(--red)] border border-red/20 rounded-full px-2 py-0.5 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--red)] animate-pulse" />
                  Live
                </span>
                <div className="flex-1 min-w-1" />
                <span className="font-mono text-[9px] text-[var(--text3)] bg-[var(--surface)] px-2 py-0.5 rounded-full border border-[var(--border)]">AI Pin</span>
                <a href="#" className="brand-ph-link ml-1.5">All <ChevIcon /></a>
              </div>
              <div className="px-4 py-2 border-b border-[var(--border)] flex items-center gap-2.5">
                <div className="flex-1 flex gap-0.5 h-1.5 rounded overflow-hidden">
                  <div className="flex-[7.2] bg-[var(--green)]" />
                  <div className="flex-[1.8] bg-[#D8D8D0]" />
                  <div className="flex-1 bg-[var(--red)]" />
                </div>
                <div className="flex gap-2.5 font-mono text-[8.5px]">
                  <span className="text-[var(--green)]">72% Positive</span>
                  <span className="text-[var(--text3)]">18% Neutral</span>
                  <span className="text-[var(--red)]">10% Negative</span>
                </div>
              </div>
              <div className="brand-panel-body">
                <TranscriptRow
                  store="Whole Foods Austin · Jenna K."
                  time="2m ago"
                  amb='"Try our Cherry Vanilla — it&apos;s prebiotic, only 35 calories, and way better than regular soda."'
                  cust='"Oh wow I&apos;ve never tried this. I&apos;ll grab a 4-pack — where&apos;s the QR for the discount?"'
                  sku="Cherry Vanilla · Converted"
                />
                <TranscriptRow
                  store="Target LA · Parker N."
                  time="14m ago"
                  amb='"This one&apos;s Strawberry Vanilla — gut-healthy, low sugar, tastes like a real soda."'
                  cust='"My daughter will love this. Does it come in a variety pack?"'
                  sku="Strawberry Vanilla"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  sub,
  spark,
  bar,
}: {
  label: string;
  value: string;
  sub: React.ReactNode;
  spark?: boolean;
  bar?: number;
}) {
  return (
    <div className="brand-kpi">
      <div className="brand-kpi-head">
        <BoxIcon />
        <div className="brand-kpi-lbl">{label}</div>
      </div>
      <div className="font-mono text-2xl font-medium text-[var(--dark)] leading-none tracking-tight">{value}</div>
      <div className="text-[10px] mt-1 flex items-center gap-1 flex-wrap">{sub}</div>
      {spark && (
        <div className="absolute bottom-2 right-2.5 flex items-end gap-0.5 h-[18px]">
          {[38, 52, 62, 48, 76, 88, 100].map((h, i) => (
            <div key={i} className={`w-[3px] rounded-sm ${i > 0 ? "bg-[var(--lime-dark)]" : "bg-[var(--elevated)]"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      )}
      {bar !== undefined && (
        <div className="h-[3px] bg-black/5 rounded mt-2 overflow-hidden">
          <div className="h-full rounded bg-black/20" style={{ width: `${bar}%` }} />
        </div>
      )}
    </div>
  );
}

function ShiftRow({
  status,
  store,
  ambassador,
  ambassadorMeta,
  ambassadorMetaClass,
  time,
  location,
  skus,
  tags,
  samples,
  progress,
  progressClass,
  note,
  noteClass,
}: {
  status: "gr" | "am" | "re" | "li";
  store: string;
  ambassador: string;
  ambassadorMeta: string;
  ambassadorMetaClass?: string;
  time: string;
  location: string;
  skus: string;
  tags: string[];
  samples: string;
  progress: number;
  progressClass: "li" | "gr" | "am";
  note: string;
  noteClass?: string;
}) {
  const statusBg = { gr: "bg-[var(--green-bg)] border-green/20", am: "bg-[var(--amber-bg)] border-amber/20", re: "bg-[var(--red-bg)] border-red/20", li: "bg-lime/15 border-lime-dark/30" }[status];
  const progressBg = { li: "bg-[var(--lime-dark)]", gr: "bg-[var(--green)]", am: "bg-[var(--amber)]" }[progressClass];
  return (
    <div className="brand-sr">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border ${statusBg}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-[var(--dark)] truncate">{store}</div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          <span className="w-4 h-4 rounded-full bg-[var(--elevated)] border border-[var(--border)] flex-shrink-0" />
          <span className="text-[11px] text-[var(--text2)]">{ambassador}</span>
          <span className={`text-[10px] ${ambassadorMetaClass ?? "text-[var(--text3)]"}`}>{ambassadorMeta}</span>
        </div>
        <div className="flex gap-2.5 mt-1 flex-wrap">
          <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{time}</span>
          <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{location}</span>
          <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{skus}</span>
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {tags.map((t) => (
            <span key={t} className="brand-badge b-muted text-[8.5px]">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 w-[104px] text-right">
        <div className="font-mono text-[13px] text-[var(--dark)] font-medium">{samples}</div>
        <div className="w-full h-1 bg-[var(--elevated)] rounded mt-1 overflow-hidden">
          <div className={`h-full rounded ${progressBg}`} style={{ width: `${progress}%` }} />
        </div>
        <div className={`text-[10px] text-[var(--text3)] mt-0.5 ${noteClass ?? ""}`}>{note}</div>
      </div>
    </div>
  );
}

function AmbassadorRow({ name, sub, value, bar }: { name: string; sub: string; value: string; bar: number }) {
  return (
    <div className="brand-amb-row">
      <div className="w-9 h-9 rounded-lg bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center font-serif text-[15px] text-white font-normal flex-shrink-0">
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[13px] text-[var(--dark)]">{name}</div>
        <div className="text-[10px] text-[var(--text3)] mt-0.5 flex items-center gap-1">{sub}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-[19px] font-medium text-[var(--dark)] leading-none">{value}</div>
        <div className="text-[9px] text-[var(--text3)] mt-0.5">Earnings</div>
        <div className="w-14 h-0.5 bg-[var(--elevated)] rounded mt-1 overflow-hidden ml-auto">
          <div className="h-full bg-[var(--lime-dark)] rounded" style={{ width: `${bar}%` }} />
        </div>
      </div>
    </div>
  );
}

function TranscriptRow({ store, time, amb, cust, sku }: { store: string; time: string; amb: string; cust: string; sku: string }) {
  return (
    <div className="brand-fb-row">
      <div className="flex items-center gap-1.5 mb-1">
        <span className="font-mono text-[8px] font-medium uppercase tracking-wider bg-[var(--green-bg)] text-[var(--green)] border border-green/20 rounded-full px-1.5 py-0.5 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" />
          Live
        </span>
        <div className="text-[11.5px] font-semibold text-[var(--dark)]">{store}</div>
        <div className="font-mono text-[9px] text-[var(--text3)] ml-auto">{time}</div>
      </div>
      <div className="flex flex-col gap-1 mt-1">
        <div className="flex gap-1.5 items-start">
          <span className="font-mono text-[8.5px] text-[var(--text3)] bg-[var(--elevated)] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">AMB</span>
          <div className="text-[11.5px] text-[var(--text2)] leading-snug">{amb}</div>
        </div>
        <div className="flex gap-1.5 items-start">
          <span className="font-mono text-[8.5px] text-[var(--green)] bg-[var(--green-bg)] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 border border-green/20">CUST</span>
          <div className="text-[11.5px] text-[var(--text2)] leading-snug">{cust}</div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-1">
        <span className="font-mono text-[9px] text-[var(--text3)]">{sku}</span>
      </div>
    </div>
  );
}

function BoxIcon() {
  return (
    <svg width="12" height="12" className="text-[var(--text3)] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="14.5,5 8,1.5 1.5,5 1.5,11 8,14.5 14.5,11 14.5,5" />
      <polyline points="1.5,5 8,8.5 14.5,5" />
      <line x1="8" y1="8.5" x2="8" y2="14.5" />
    </svg>
  );
}
function FileIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M9 1.5H3.5A1.5 1.5 0 002 3v10a1.5 1.5 0 001.5 1.5h9A1.5 1.5 0 0014 13V6.5L9 1.5z" />
      <polyline points="9,1.5 9,6.5 14,6.5" />
    </svg>
  );
}
function BarIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="4" y1="14" x2="4" y2="8" />
      <line x1="8" y1="14" x2="8" y2="4" />
      <line x1="12" y1="14" x2="12" y2="10" />
      <line x1="1.5" y1="14" x2="14.5" y2="14" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.48-2.02-4.5-4.5-4.5z" />
      <circle cx="8" cy="6" r="1.5" />
    </svg>
  );
}
function ChevIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <polyline points="6,3 11,8 6,13" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <polygon points="8,1.5 9.9,6.1 15,6.5 11.25,9.8 12.47,14.5 8,11.77 3.53,14.5 4.75,9.8 1,6.5 6.1,6.1" />
    </svg>
  );
}
function MicIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <rect x="5.5" y="1.5" width="5" height="7" rx="2.5" />
      <path d="M2.5 8a5.5 5.5 0 0011 0" />
      <line x1="8" y1="13.5" x2="8" y2="15.5" />
      <line x1="5.5" y1="15.5" x2="10.5" y2="15.5" />
    </svg>
  );
}
