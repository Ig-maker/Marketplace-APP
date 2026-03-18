import { getCurrentUser } from "@/lib/session";
import { BrandAlertBanner } from "@/components/brand-alert-banner";
import { RetailerLogo } from "@/components/retailer-logo";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Brand Dashboard — Shelvian",
};

const AMBASSADOR_AVATARS: Record<string, string> = {
  "Jenna K.": "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&h=150&fit=crop",
  "Parker N.": "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?w=150&h=150&fit=crop",
  "Reese M.": "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=150&h=150&fit=crop",
  "Morgan W.": "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?w=150&h=150&fit=crop",
  "Blake T.": "https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&h=150&fit=crop",
};

const CITY_IMAGES: Record<string, string> = {
  "Los Angeles": "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=400&h=200&fit=crop",
  Chicago: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=400&h=200&fit=crop",
  Austin: "https://images.unsplash.com/photo-1565043667947-e69e3f0eb9ec?w=400&h=200&fit=crop",
  Nashville: "https://images.unsplash.com/photo-1508807528931-b7cb6d2d9c51?w=400&h=200&fit=crop",
};

// Retailer name (from store string) -> logo URL (ifetchly API, no auth required)
const RETAILER_LOGO_DOMAINS: Record<string, string> = {
  "Whole Foods Market": "wholefoodsmarket.com",
  "Whole Foods": "wholefoodsmarket.com",
  Target: "target.com",
  "Sprouts Farmers Market": "sprouts.com",
  Sprouts: "sprouts.com",
  Kroger: "kroger.com",
  HEB: "heb.com",
  Safeway: "safeway.com",
};

function getRetailerLogoUrl(store: string): string | null {
  for (const [retailer, domain] of Object.entries(RETAILER_LOGO_DOMAINS)) {
    if (store.startsWith(retailer)) {
      return `https://logo.ifetchly.com/api/logo?domain=${domain}`;
    }
  }
  return null;
}

const PRODUCT_ICONS: Record<
  string,
  { gradient: string; icon: React.ReactNode }
> = {
  "Cherry Vanilla": {
    gradient: "linear-gradient(135deg,#ff6b6b,#ffd93d)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 8c-2.2 0-4 1.8-4 4s1.8 4 4 4 4-1.8 4-4" />
      </svg>
    ),
  },
  "Vintage Cola": {
    gradient: "linear-gradient(135deg,#c0392b,#8e44ad)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" strokeWidth="2.5" />
        <line x1="3" y1="12" x2="3.01" y2="12" strokeWidth="2.5" />
        <line x1="3" y1="18" x2="3.01" y2="18" strokeWidth="2.5" />
      </svg>
    ),
  },
  "Strawberry Vanilla": {
    gradient: "linear-gradient(135deg,#e91e8c,#ff6b6b)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  },
  "Classic Grape": {
    gradient: "linear-gradient(135deg,#6c3483,#1a5276)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round">
        <circle cx="8" cy="8" r="6" />
        <path d="M18.09 10.37A6 6 0 1110.34 18" />
        <path d="M7 6h1v4" />
      </svg>
    ),
  },
};

export default async function BrandDemoDashboardPage() {
  const user = await getCurrentUser();

  return (
    <>
      <BrandAlertBanner />

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
                skus="Vintage Cola"
                tags={["Slow Start", "1 photo"]}
                samples="12 / 100"
                progress={12}
                progressClass="am"
                note="Below pace"
                noteClass="text-[var(--amber)]"
              />
              <ShiftRow
                status="li"
                store="Kroger — Green Hills, Nashville TN"
                ambassador="Morgan W."
                ambassadorMeta="4.7★ · 4 prior shifts"
                time="1:00–6:00 PM"
                location="Nashville, TN"
                skus="Cherry Vanilla"
                tags={["Confirmed · Starts 1pm"]}
                samples="0 / 80"
                progress={0}
                progressClass="li"
                note="Starts in 18 min"
              />
              <ShiftRow
                status="gr"
                store="HEB — Midtown Houston, TX"
                ambassador="Blake T."
                ambassadorMeta="Report filed"
                ambassadorMetaClass="text-[var(--green)]"
                time="9:00 AM–2:00 PM"
                location="Houston, TX"
                skus="Vintage Cola, Classic Grape"
                tags={["Completed", "7 photos"]}
                samples="120 / 120"
                progress={100}
                progressClass="gr"
                note="100% complete"
                noteClass="text-[var(--green)]"
              />
              <ShiftRow
                status="re"
                store="Safeway — Marina District, San Francisco CA"
                ambassador="No ambassador assigned"
                ambassadorMeta=""
                ambassadorMetaClass="text-[var(--text3)]"
                unassigned
                time="2:00–6:00 PM"
                location="San Francisco, CA"
                skus=""
                tags={["Needs Ambassador"]}
                samples="— / 90"
                progress={0}
                progressClass="li"
                note=""
                showFindButton
              />
            </div>
            <div className="border-t border-[var(--border)] py-2.5 px-4 flex justify-between items-center bg-[var(--elevated)] flex-shrink-0 mt-auto">
              <span className="text-[11px] text-[var(--text3)]">Showing 6 of 14 shifts</span>
              <a href="#" className="brand-ph-link">All shifts <ChevIcon /></a>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-5">
            {/* Top Ambassadors */}
            <div className="brand-panel flex flex-col">
              <div className="brand-panel-head">
                <UsersIcon />
                <div className="font-serif text-[14.5px] text-[var(--dark)]">Top Ambassadors</div>
                <div className="flex-1 min-w-1" />
                <a href="/brand/demo-dashboard" className="brand-ph-link">All <ChevIcon /></a>
              </div>
              <div className="px-4 py-0 pb-0.5">
                <AmbassadorRow name="Jenna K." sub="★★★★★ 5.0 · Los Angeles" value="12" valueLabel="Shifts" bar={100} />
                <AmbassadorRow name="Parker N." sub="★★★★★ 4.9 · Chicago" value="8" valueLabel="Shifts" bar={67} />
                <AmbassadorRow name="Blake T." sub="★★★★★ 4.8 · Houston" value="6" valueLabel="Shifts" bar={50} />
                <AmbassadorRow name="Morgan W." sub="★★★★☆ 4.7 · Nashville" value="4" valueLabel="Shifts" bar={33} />
              </div>
              <div className="brand-mms">
                <div className="brand-mm"><div className="brand-mm-val">98%</div><div className="brand-mm-lbl">Show Rate</div></div>
                <div className="brand-mm"><div className="brand-mm-val">47</div><div className="brand-mm-lbl">Active</div></div>
                <div className="brand-mm"><div className="brand-mm-val">4.8★</div><div className="brand-mm-lbl">Avg Rating</div></div>
              </div>
            </div>

            {/* Upcoming Shifts */}
            <div className="brand-panel flex-1 min-h-0">
              <div className="brand-panel-head">
                <CalIcon />
                <div className="font-serif text-[14.5px] text-[var(--dark)]">Upcoming Shifts</div>
                <div className="flex-1 min-w-1" />
                <a href="/brand/demo-dashboard" className="brand-ph-link">Schedule <ChevIcon /></a>
              </div>
              <div className="px-4 pb-1">
                <UpcomingRow day="20" mon="Mar" store="Safeway — SF Marina" meta="San Francisco · 2:00–6:00 PM" badge="Unassigned" badgeClass="b-red" />
                <UpcomingRow day="21" mon="Mar" store="Whole Foods — NYC SoHo" meta="New York · 11:00–4:00 PM" amb="Jenna K." badge="Confirmed" badgeClass="b-lime" />
                <UpcomingRow day="22" mon="Mar" store="Target — Denver Cherry Creek" meta="Denver, CO · 12:00–5:00 PM" amb="Morgan W." badge="Pending" badgeClass="b-blue" />
                <UpcomingRow day="24" mon="Mar" store="Sprouts — Atlanta Midtown" meta="Atlanta, GA · 10:00–3:00 PM" amb="Parker N." badge="Confirmed" badgeClass="b-lime" />
              </div>
            </div>
          </div>
        </div>

        {/* Row 2: Sample Distribution + Activity Feed */}
        <div className="brand-g3">
          <div className="brand-panel">
            <div className="brand-panel-head">
              <BarIcon />
              <div className="font-serif text-[14.5px] text-[var(--dark)]">Sample Distribution</div>
              <div className="flex-1 min-w-1" />
              <select className="border-none bg-transparent text-[11px] text-[var(--text3)] cursor-pointer outline-none font-sans">
                <option>Last 7 days</option>
                <option>30 days</option>
              </select>
            </div>
            <div className="brand-panel-body">
              <div className="flex items-baseline gap-2 mb-0.5">
                <div className="font-mono text-2xl font-medium leading-none">12,480</div>
                <div className="text-[11px] text-[var(--green)] font-semibold inline-flex items-center gap-0.5">↑ +15%</div>
              </div>
              <div className="text-[11px] text-[var(--text3)] mb-2.5">samples distributed this week</div>
              <div className="brand-bar-chart">
                {[38, 52, 44, 68, 58, 76, 70].map((h, i) => (
                  <div key={i} className="brand-bc-grp">
                    <div className={`brand-bc-bar ${i === 6 ? "brand-bc-bar-today" : ""}`} style={{ height: h }} />
                  </div>
                ))}
              </div>
              <div className="brand-chart-x">
                {["M", "T", "W", "Th", "F", "Sa", "Su"].map((d, i) => (
                  <div key={d} className={`brand-chart-xl ${i === 6 ? "font-semibold text-[var(--dark)]" : ""}`}>{d}</div>
                ))}
              </div>
              <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
                <div className="text-[9px] text-[var(--text3)] font-mono uppercase tracking-wider mb-1.5">By Retailer</div>
                <div className="flex flex-col gap-1.5">
                  {[
                    { name: "Whole Foods", pct: 52 },
                    { name: "Target", pct: 28 },
                    { name: "Sprouts", pct: 14 },
                    { name: "HEB / Kroger", pct: 6, dim: true },
                  ].map((r) => (
                    <div key={r.name} className="flex items-center gap-1.5">
                      <div className="text-[11px] text-[var(--text2)] w-[72px]">{r.name}</div>
                      <div className="flex-1 h-1 bg-[var(--elevated)] rounded overflow-hidden">
                        <div className={`h-full rounded ${r.dim ? "bg-[var(--border2)]" : "bg-[var(--lime-dark)]"}`} style={{ width: `${r.pct}%` }} />
                      </div>
                      <div className="font-mono text-[10px] text-[var(--dark)] w-6">{r.pct}%</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-3 pt-2.5 border-t border-[var(--border)]">
                <div className="text-[9px] text-[var(--text3)] font-mono uppercase tracking-wider mb-1">Hourly Velocity (today)</div>
                <div className="brand-heatmap">
                  <div className="brand-hm-row">
                    <div className="brand-hm-lbl">AM</div>
                    {[0, 0, 1, 2, 3, 4, 5, 4, 3, 2, 1, 0].map((l, i) => (
                      <div key={i} className={`brand-hm-cell ${l ? `brand-hm-cell-l${l}` : ""}`} />
                    ))}
                  </div>
                  <div className="brand-hm-row">
                    <div className="brand-hm-lbl">PM</div>
                    {[1, 2, 3, 5, 4, 3, 2, 1, 0, 0, 0, 0].map((l, i) => (
                      <div key={i} className={`brand-hm-cell ${l ? `brand-hm-cell-l${l}` : ""}`} />
                    ))}
                  </div>
                </div>
                <div className="brand-hm-days">
                  {["8", "9", "10", "11", "12", "1", "2", "3", "4", "5", "6", "7"].map((d) => (
                    <div key={d} className="brand-hm-day">{d}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

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
              <a href="/brand/demo-dashboard" className="brand-ph-link ml-1.5">All <ChevIcon /></a>
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
            <div className="brand-panel-body max-h-[320px] overflow-y-auto">
              <TranscriptRow
                store="Whole Foods Austin · Jenna K."
                time="2m ago"
                status="live"
                amb='"Try our Cherry Vanilla — it&apos;s prebiotic, only 35 calories, and way better than regular soda."'
                cust='"Oh wow I&apos;ve never tried this. I&apos;ll grab a 4-pack — where&apos;s the QR for the discount?"'
                sku="Cherry Vanilla · Converted"
                skuHighlight="Converted"
                showShare
              />
              <TranscriptRow
                store="Target LA · Parker N."
                time="14m ago"
                status="live"
                amb='"This one&apos;s Strawberry Vanilla — gut-healthy, low sugar, tastes like a real soda."'
                cust='"My daughter will love this. Does it come in a variety pack?"'
                sku="Strawberry Vanilla · Interested"
                skuHighlight="Interested"
              />
              <TranscriptRow
                store="Sprouts Chicago · Reese M."
                time="31m ago"
                status="ended"
                statusClass="amber"
                amb='"Want to try our Vintage Cola? No artificial sweeteners, just 5g of sugar."'
                cust='"It&apos;s a bit sweet for me but I might try the cola. Not buying today."'
                sku="Vintage Cola · No Convert"
                skuHighlight="No Convert"
                skuHighlightClass="amber"
                showFlag
              />
              <TranscriptRow
                store="HEB Houston · Blake T."
                time="1h ago"
                status="ended"
                amb='"This is Cherry Vanilla — it&apos;s got prebiotics for gut health and tastes amazing."'
                cust='"That&apos;s incredible, I&apos;ll grab three packs. Never going back to regular soda."'
                sku="Cherry Vanilla · Converted ×3"
                skuHighlight="Converted ×3"
              />
            </div>
          </div>

          <div className="brand-panel">
            <div className="brand-panel-head">
              <WaveIcon />
              <div className="font-serif text-[14.5px] text-[var(--dark)]">Activity Feed</div>
              <div className="flex-1 min-w-1" />
              <a href="/brand/demo-dashboard" className="brand-ph-link">All <ChevIcon /></a>
            </div>
            <div className="brand-panel-body max-h-[320px] overflow-y-auto">
              <ActivityRow icon="li" iconType="cam" text={<><strong>Jenna K.</strong> uploaded 4 shift photos from Whole Foods Austin</>} time="2 min ago" />
              <ActivityRow icon="gr" iconType="check" text={<><strong>Blake T.</strong> completed shift and filed full report · HEB Houston</>} time="28 min ago" />
              <ActivityRow icon="am" iconType="zap" text={<><strong>Sprouts Chicago</strong> flagged for low velocity — 12/100 after 2 hrs</>} time="35 min ago" />
              <ActivityRow icon="re" iconType="warn" text={<><strong>Parker N.</strong> shift report overdue (2h) · Target LA</>} time="1h ago" />
              <ActivityRow icon="li" iconType="plus" text={<>New shift posted — <strong>Safeway SF Marina</strong> Mar 20 · Ambassador needed</>} time="1h 8m ago" />
              <ActivityRow icon="gr" iconType="star" text={<><strong>Morgan W.</strong> received a new 5-star AI-captured review</>} time="1h 22m ago" />
              <ActivityRow icon="bl" iconType="dollar" text={<>Payout of <strong>$1,240</strong> processed for 6 ambassadors</>} time="3h ago" />
              <ActivityRow icon="gr" iconType="pin" text={<><strong>Reese M.</strong> checked in at Sprouts Chicago · Location verified</>} time="3h 15m ago" />
              <ActivityRow icon="li" iconType="box" text={<>Sample kit shipped to <strong>Nashville Kroger</strong> · ETA today 12:30 PM</>} time="5h ago" />
              <ActivityRow icon="am" iconType="clock" text={<>Shift reminder sent to <strong>Morgan W.</strong> for 1:00 PM Nashville shift</>} time="6h ago" />
            </div>
          </div>
        </div>

        {/* Row 3: Active Markets */}
        <div className="brand-sec-div">
          <div className="brand-sec-tag">Active Markets</div>
          <div className="brand-sec-line" />
          <span className="brand-sec-ct">8 cities · 47 ambassadors</span>
        </div>
        <div className="brand-g4">
          <CityCard name="Los Angeles" stats="3 shifts · 14 ambassadors · $2,840" live="3 active" badge="Hot Market" badgeClass="b-lime" />
          <CityCard name="Chicago" stats="2 shifts · 9 ambassadors · $1,420" live="1 active" badge="Slow Velocity" badgeClass="b-amber" />
          <CityCard name="Austin" stats="2 shifts · 7 ambassadors · $1,680" live="2 active" badge="Top Conversion" badgeClass="b-lime" />
          <CityCard name="Nashville" stats="1 shift · 4 ambassadors · $640" live="Starting soon" badge="New Market" badgeClass="b-muted" />
        </div>

        {/* Row 4: Product Performance */}
        <div className="brand-sec-div">
          <div className="brand-sec-tag">Product Performance</div>
          <div className="brand-sec-line" />
        </div>
        <div className="brand-perf-grid">
          <div className="brand-panel flex flex-col min-h-0 flex-1">
            <div className="brand-panel-head">
              <TagIcon />
              <div className="font-serif text-[14.5px] text-[var(--dark)]">SKU Performance</div>
              <div className="flex-1 min-w-1" />
              <span className="brand-badge b-muted">Campaign to date</span>
              <a href="/brand/demo-dashboard" className="brand-ph-link ml-2">Export</a>
            </div>
            <div className="overflow-auto flex-1 min-h-0">
              <table className="brand-ptable">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Samples</th>
                    <th>Conv. Rate</th>
                    <th>Velocity</th>
                    <th>Est. Revenue</th>
                    <th>vs Target</th>
                  </tr>
                </thead>
                <tbody>
                  <SkuRow name="Cherry Vanilla" sku="SKU-0041 · 12oz" samples={4230} samplesPct={85} conv="38.2%" convUp="+4.1pp" velocity="184/hr" velocityNote="Fastest" revenue="$8,460" target="+12%" targetClass="green" />
                  <SkuRow name="Vintage Cola" sku="SKU-0038 · 12oz" samples={3810} samplesPct={76} conv="34.7%" convUp="+1.8pp" velocity="165/hr" revenue="$7,234" target="+7%" targetClass="green" />
                  <SkuRow name="Strawberry Vanilla" sku="SKU-0044 · 12oz" samples={2640} samplesPct={53} conv="31.1%" convUp="+0.5pp" velocity="128/hr" revenue="$5,200" target="On Track" targetClass="muted" />
                  <SkuRow name="Classic Grape" sku="SKU-0029 · 12oz" samples={1800} samplesPct={36} conv="27.0%" convDown="-1.2pp" velocity="88/hr" velocityNote="Slowest" velocityClass="amber" revenue="$3,120" target="-8%" targetClass="amber" />
                </tbody>
              </table>
            </div>
            <div className="border-t border-[var(--border)] px-4 py-3 flex justify-between items-center bg-[var(--elevated)] rounded-b-[var(--r-lg)]">
              <div className="text-[11px] text-[var(--text3)]">
                Total: <span className="font-mono text-[var(--dark)] font-medium">12,480</span> samples · <span className="font-mono text-[var(--green)] font-medium">$24,014</span> est. revenue
              </div>
              <span className="brand-badge b-lime">4.2× ROI</span>
            </div>
          </div>
          <div className="brand-panel flex flex-col min-h-0">
            <div className="brand-panel-head">
              <TargetIcon />
              <div className="font-serif text-[14.5px] text-[var(--dark)]">Campaign Budget</div>
              <div className="flex-1 min-w-1" />
              <span className="brand-badge b-lime">4.2×</span>
            </div>
            <div className="brand-panel-body">
              <div className="flex justify-between text-[11px] text-[var(--text3)] mb-0.5"><span>Spent</span><span className="font-mono text-[var(--dark)]">$8,340</span></div>
              <div className="h-2 bg-[var(--elevated)] rounded overflow-hidden"><div className="h-full bg-[var(--lime-dark)] rounded" style={{ width: "66%" }} /></div>
              <div className="flex justify-between text-[9px] text-[var(--text3)] font-mono mb-3"><span>$0</span><span>Budget: $12,540</span></div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-[var(--elevated)] rounded-[var(--r)] p-2.5 text-center">
                  <div className="font-mono text-[15px] font-medium">$8,340</div>
                  <div className="text-[9px] text-[var(--text3)] mt-0.5">Spent</div>
                </div>
                <div className="bg-[var(--lime)] rounded-[var(--r)] p-2.5 text-center">
                  <div className="font-mono text-[15px] font-medium">$4,200</div>
                  <div className="text-[9px] text-black/55 mt-0.5">Remaining</div>
                </div>
              </div>
              <div className="border-t border-[var(--border)] pt-2.5">
                <div className="text-[9px] text-[var(--text3)] font-mono uppercase tracking-wider mb-1.5">Campaign Targets</div>
                <TargetRow label="Sample Goal" sub="40,000 total" pct={31} icon={<BoxIcon />} iconBg="bg-[var(--lime)]" />
                <TargetRow label="Conversion Target" sub="32% avg" pct={100} pctColor="green" icon={<TargetIcon />} iconBg="bg-[var(--green-bg)]" />
                <TargetRow label="City Coverage" sub="12 cities goal" pct={67} pctColor="amber" icon={<PinIcon />} iconBg="bg-[var(--amber-bg)]" />
              </div>
            </div>
          </div>
          <div className="brand-panel flex flex-col min-h-0 col-span-2">
            <div className="brand-panel-head">
              <SparkIcon />
              <div className="font-serif text-[14.5px] text-[var(--dark)]">AI Transcript Insights</div>
              <span className="font-mono text-[8.5px] font-medium bg-lime/15 text-[var(--dark)] border border-lime-dark/35 rounded-full px-2 py-0.5">✦ AI Pin</span>
              <div className="flex-1 min-w-1" />
              <span className="font-mono text-[9px] text-[var(--text3)]">Updated 2m ago</span>
            </div>
            <div className="grid grid-cols-3 border-b border-[var(--border)]">
              <div className="p-3 border-r border-[var(--border)]">
                <div className="text-[9px] text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">Top Objection</div>
                <div className="text-sm font-semibold text-[var(--dark)]">Too sweet</div>
                <div className="text-[10px] text-[var(--text3)] mt-0.5">Heard in 23% of convos</div>
                <div className="text-[10px] text-[var(--amber)] mt-1 font-semibold">→ Push Classic Grape first</div>
              </div>
              <div className="p-3 border-r border-[var(--border)]">
                <div className="text-[9px] text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">Best Hook</div>
                <div className="text-sm font-semibold text-[var(--dark)]">&quot;Prebiotic gut health&quot;</div>
                <div className="text-[10px] text-[var(--text3)] mt-0.5">68% conversion when used</div>
                <div className="text-[10px] text-[var(--green)] mt-1 font-semibold">↑ +22pp vs avg pitch</div>
              </div>
              <div className="p-3">
                <div className="text-[9px] text-[var(--text3)] uppercase tracking-wider font-mono mb-1.5">Avg Convo Length</div>
                <div className="text-sm font-semibold text-[var(--dark)]">1m 42s</div>
                <div className="text-[10px] text-[var(--text3)] mt-0.5">Converted: 2m 18s avg</div>
                <div className="text-[10px] text-[var(--green)] mt-1 font-semibold">Longer = more likely to buy</div>
              </div>
            </div>
            <div className="p-3">
              <div className="text-[9px] text-[var(--text3)] uppercase tracking-wider font-mono mb-2.5">Frequently Mentioned by Customers</div>
              <div className="flex flex-wrap gap-1.5">
                {["sugar content 47×", "gut health 41×", "calories 38×", "variety pack 29×", "no artificial sweeteners 26×", "too sweet 23×", "where to buy 19×", "discount / QR 17×"].map((t) => (
                  <span key={t} className={`text-[11px] rounded-full px-2.5 py-0.5 ${t.includes("variety") ? "bg-lime/12 border border-lime-dark/30 text-[var(--dark)]" : t.includes("too sweet") ? "bg-[var(--red-bg)] border border-red/15 text-[var(--red)]" : "bg-[var(--elevated)] border border-[var(--border)] text-[var(--dark)]"}`}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Row 5: Pending Payouts */}
        <div className="brand-sec-div">
          <div className="brand-sec-tag">Pending Payouts</div>
          <div className="brand-sec-line" />
          <span className="brand-sec-ct">$2,180 due this week</span>
        </div>
        <div className="brand-panel">
          <div className="brand-panel-head">
            <DollarIcon />
            <div className="font-serif text-[14.5px] text-[var(--dark)]">Ambassador Payout Queue</div>
            <div className="flex-1 min-w-1" />
            <button type="button" className="brand-tb-btn ghost text-[11px] py-1.5 px-2.5">Review All</button>
            <button type="button" className="brand-tb-btn lime text-[11px] py-1.5 px-2.5">
              <DollarIconSmall /> Pay All · $2,180
            </button>
          </div>
          <div className="grid grid-cols-2">
            <div className="px-4 py-1 border-r border-[var(--border)]">
              <PayoutRow name="Blake T." sub="HEB Houston · 3 shifts" amt="$360" badge="Ready" badgeClass="b-green" />
              <PayoutRow name="Jenna K." sub="Whole Foods · 2 shifts" amt="$240" badge="Ready" badgeClass="b-green" />
              <PayoutRow name="Morgan W." sub="Kroger Nashville · 1 shift" amt="$120" badge="Pending" badgeClass="b-amber" />
            </div>
            <div className="px-4 py-1">
              <PayoutRow name="Parker N." sub="Target LA · 2 shifts" amt="$280" badge="Report Due" badgeClass="b-red" />
              <PayoutRow name="Reese M." sub="Sprouts Chicago · 1 shift" amt="$180" badge="In Progress" badgeClass="b-amber" />
              <PayoutRow name="4 more ambassadors" sub="$1,000 combined" amt="$1,000" badge="Queued" badgeClass="b-muted" muted />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function PayoutRow({ name, sub, amt, badge, badgeClass, muted }: { name: string; sub: string; amt: string; badge: string; badgeClass: string; muted?: boolean }) {
  const avatarUrl = !muted ? AMBASSADOR_AVATARS[name] : null;
  const avatarBg = muted ? "" : ["from-indigo-500 to-violet-500", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-500"][name.charCodeAt(0) % 3];
  return (
    <div className="brand-pay-row">
      {muted ? (
        <div className="w-[30px] h-[30px] rounded-full bg-[var(--elevated)] border border-dashed border-[var(--border)] flex items-center justify-center flex-shrink-0">
          <UsersIconSmall />
        </div>
      ) : avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={30}
          height={30}
          className="w-[30px] h-[30px] rounded-full object-cover flex-shrink-0 border border-[var(--border)]"
        />
      ) : (
        <div className={`w-[30px] h-[30px] rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center font-serif text-[11px] text-white font-normal flex-shrink-0 border border-[var(--border)]`}>
          {name.charAt(0)}
        </div>
      )}
      <div className="brand-pay-info flex-1 min-w-0">
        <div className={`brand-pay-name ${muted ? "text-[var(--text3)]" : ""}`}>{name}</div>
        <div className="brand-pay-sub">{sub}</div>
      </div>
      <div className={`brand-pay-amt ${muted ? "text-[var(--text3)]" : ""}`}>{amt}</div>
      <span className={`brand-badge ${badgeClass} text-[8px] ml-2 flex-shrink-0`}>{badge}</span>
    </div>
  );
}

function DollarIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <line x1="8" y1="1.5" x2="8" y2="14.5" />
      <path d="M10.5 4H6.75a2.25 2.25 0 000 4.5h2.5a2.25 2.25 0 010 4.5H5" />
    </svg>
  );
}
function DollarIconSmall() {
  return (
    <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
      <line x1="8" y1="1.5" x2="8" y2="14.5" />
      <path d="M10.5 4H6.75a2.25 2.25 0 000 4.5h2.5a2.25 2.25 0 010 4.5H5" />
    </svg>
  );
}

function CityCard({ name, stats, live, badge, badgeClass }: { name: string; stats: string; live: string; badge: string; badgeClass: string }) {
  const imageUrl = CITY_IMAGES[name];
  return (
    <div className="brand-city-card">
      <div
        className="brand-city-img"
        style={
          imageUrl
            ? {
                backgroundImage: `url(${imageUrl})`,
              }
            : { background: "var(--elevated)" }
        }
      >
        {imageUrl && <div className="brand-city-img-overlay" />}
      </div>
      <div className="brand-city-body">
        <div className="brand-city-name">{name}</div>
        <div className="brand-city-stats">{stats}</div>
      </div>
      <div className="brand-city-foot">
        <div className="brand-city-live"><span className="brand-city-dot" />{live}</div>
        <span className={`brand-badge ${badgeClass} text-[8px]`}>{badge}</span>
      </div>
    </div>
  );
}

function SkuRow({
  name,
  sku,
  samples,
  samplesPct,
  conv,
  convUp,
  convDown,
  velocity,
  velocityNote,
  velocityClass,
  revenue,
  target,
  targetClass,
}: {
  name: string;
  sku: string;
  samples: number;
  samplesPct: number;
  conv: string;
  convUp?: string;
  convDown?: string;
  velocity: string;
  velocityNote?: string;
  velocityClass?: string;
  revenue: string;
  target: string;
  targetClass: "green" | "amber" | "muted";
}) {
  const targetBg = targetClass === "green" ? "b-green" : targetClass === "amber" ? "b-amber" : "b-muted";
  const productIcon = PRODUCT_ICONS[name] ?? {
    gradient: "linear-gradient(135deg,#94a3b8,#64748b)",
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
  };
  return (
    <tr>
      <td>
        <div className="flex items-center gap-2">
          <div
            className="w-[26px] h-[26px] rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: productIcon.gradient }}
          >
            {productIcon.icon}
          </div>
          <div>
            <div className="brand-p-name">{name}</div>
            <div className="brand-p-sku">{sku}</div>
          </div>
        </div>
      </td>
      <td><div className="font-mono text-xs text-[var(--dark)]">{samples.toLocaleString()}</div><div className="brand-p-bar"><div className="brand-p-fill" style={{ width: `${samplesPct}%` }} /></div></td>
      <td><div className={`font-mono text-xs ${conv.includes("38") || conv.includes("34") || conv.includes("31") ? "text-[var(--green)]" : "text-[var(--amber)]"}`}>{conv}</div>{convUp && <div className="text-[9px] text-[var(--green)] font-semibold">↑ {convUp}</div>}{convDown && <div className="text-[9px] text-[var(--red)] font-semibold">↓ {convDown}</div>}</td>
      <td><div className={`font-mono text-xs ${velocityClass === "amber" ? "text-[var(--amber)]" : "text-[var(--dark)]"}`}>{velocity}</div>{velocityNote && <div className={`text-[9px] ${velocityNote === "Slowest" ? "text-[var(--amber)]" : "text-[var(--green)]"}`}>{velocityNote}</div>}</td>
      <td><div className="font-mono text-xs text-[var(--dark)]">{revenue}</div></td>
      <td><span className={`brand-badge ${targetBg}`}>{target}</span></td>
    </tr>
  );
}

function TargetRow({ label, sub, pct, pctColor, icon, iconBg }: { label: string; sub: string; pct: number; pctColor?: "green" | "amber"; icon?: React.ReactNode; iconBg?: string }) {
  const fillColor = pctColor === "green" ? "bg-[var(--green)]" : pctColor === "amber" ? "bg-[var(--amber)]" : "bg-[var(--lime-dark)]";
  return (
    <div className="brand-tr-row">
      <div className={`brand-tr-icon ${iconBg ?? "bg-[var(--lime)]"}`}>
        {icon ?? <BoxIcon />}
      </div>
      <div className="brand-tr-info"><div className="brand-tr-lbl">{label}</div><div className="brand-tr-sub">{sub}</div></div>
      <div className="brand-tr-end">
        <div className={`brand-tr-pct ${pctColor === "green" ? "text-[var(--green)]" : pctColor === "amber" ? "text-[var(--amber)]" : ""}`}>{pct}%</div>
        <div className="brand-tr-prog-wrap"><div className="brand-tr-prog"><div className={`brand-tr-prog-f ${fillColor}`} style={{ width: `${pct}%` }} /></div></div>
      </div>
    </div>
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
  unassigned,
  showFindButton,
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
  unassigned?: boolean;
  showFindButton?: boolean;
}) {
  const statusBg = { gr: "bg-[var(--green-bg)] border-green/20", am: "bg-[var(--amber-bg)] border-amber/20", re: "bg-[var(--red-bg)] border-red/20", li: "bg-lime/15 border-lime-dark/30" }[status];
  const progressBg = { li: "bg-[var(--lime-dark)]", gr: "bg-[var(--green)]", am: "bg-[var(--amber)]" }[progressClass];
  const getTagClass = (t: string) => {
    if (t === "Needs Ambassador") return "brand-badge b-red";
    if (t.startsWith("Completed")) return "brand-badge b-green";
    if (t.startsWith("Confirmed")) return "brand-badge b-lime";
    if (t === "In Progress") return "brand-badge b-green";
    if (t === "Pending Report" || t === "Slow Start") return "brand-badge b-amber";
    return "brand-badge b-muted";
  };
  const logoUrl = getRetailerLogoUrl(store);
  const houseIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9,22 9,12 15,12 15,22" />
    </svg>
  );
  return (
    <div className="brand-sr">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border overflow-hidden ${logoUrl ? "bg-white" : statusBg}`}>
        {logoUrl ? (
          <RetailerLogo
            src={logoUrl}
            size={36}
            className="w-9 h-9 object-contain p-1"
            fallback={houseIcon}
          />
        ) : (
          houseIcon
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[12.5px] font-semibold text-[var(--dark)] truncate">{store}</div>
        <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
          {!unassigned && AMBASSADOR_AVATARS[ambassador] ? (
            <Image
              src={AMBASSADOR_AVATARS[ambassador]}
              alt={ambassador}
              width={18}
              height={18}
              className="w-[18px] h-[18px] rounded-full object-cover border border-[var(--border)] flex-shrink-0"
            />
          ) : !unassigned && (
            <span className="w-4 h-4 rounded-full bg-[var(--elevated)] border border-[var(--border)] flex-shrink-0" />
          )}
          {unassigned && (
            <svg width="12" height="12" className="text-[var(--text3)] flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="6" cy="5" r="2.5" />
              <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
              <line x1="12" y1="3" x2="12" y2="8" />
              <line x1="9.5" y1="5.5" x2="14.5" y2="5.5" />
            </svg>
          )}
          <span className={`text-[11px] ${unassigned ? "text-[var(--text3)]" : "text-[var(--text2)]"}`}>{ambassador}</span>
          {ambassadorMeta && <span className={`text-[10px] ${ambassadorMetaClass ?? "text-[var(--text3)]"}`}>{ambassadorMeta}</span>}
        </div>
        <div className="flex gap-2.5 mt-1 flex-wrap">
          <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{time}</span>
          <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{location}</span>
          {skus && <span className="text-[10px] text-[var(--text3)] inline-flex items-center gap-0.5">{skus}</span>}
        </div>
        <div className="flex gap-1 mt-1 flex-wrap">
          {tags.map((t) => (
            <span key={t} className={`text-[8.5px] ${getTagClass(t)}`}>{t}</span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 w-[104px] text-right">
        {showFindButton ? (
          <>
            <div className="font-mono text-[13px] text-[var(--text3)] font-medium">{samples}</div>
            <button type="button" className="mt-2 text-[10px] font-bold bg-[var(--lime)] text-[#111] border-none py-1 px-2.5 rounded-full cursor-pointer inline-flex items-center gap-1 font-sans">
              <svg width="9" height="9" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="6" cy="5" r="2.5" />
                <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
                <line x1="12" y1="3" x2="12" y2="8" />
                <line x1="9.5" y1="5.5" x2="14.5" y2="5.5" />
              </svg>
              Find Amb.
            </button>
          </>
        ) : (
          <>
            <div className={`font-mono text-[13px] font-medium ${unassigned ? "text-[var(--text3)]" : "text-[var(--dark)]"}`}>{samples}</div>
            <div className="w-full h-1 bg-[var(--elevated)] rounded mt-1 overflow-hidden">
              <div className={`h-full rounded ${progressBg}`} style={{ width: `${progress}%` }} />
            </div>
            {note && <div className={`text-[10px] text-[var(--text3)] mt-0.5 ${noteClass ?? ""}`}>{note}</div>}
          </>
        )}
      </div>
    </div>
  );
}

function AmbassadorRow({ name, sub, value, valueLabel, bar }: { name: string; sub: string; value: string; valueLabel?: string; bar: number }) {
  const avatarUrl = AMBASSADOR_AVATARS[name];
  const avatarBg = ["from-indigo-500 to-violet-500", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-500"][
    name.charCodeAt(0) % 3
  ];
  return (
    <div className="brand-amb-row">
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={name}
          width={36}
          height={36}
          className="w-9 h-9 rounded-lg object-cover flex-shrink-0 border border-[var(--border)]"
        />
      ) : (
        <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${avatarBg} flex items-center justify-center font-serif text-[15px] text-white font-normal flex-shrink-0 border border-[var(--border)]`}>
          {name.charAt(0)}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-serif text-[13px] text-[var(--dark)]">{name}</div>
        <div className="text-[10px] text-[var(--text3)] mt-0.5 flex items-center gap-1">{sub}</div>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="font-mono text-[19px] font-medium text-[var(--dark)] leading-none">{value}</div>
        <div className="text-[9px] text-[var(--text3)] mt-0.5">{valueLabel ?? "Earnings"}</div>
        <div className="w-14 h-0.5 bg-[var(--elevated)] rounded mt-1 overflow-hidden ml-auto">
          <div className="h-full bg-[var(--lime-dark)] rounded" style={{ width: `${bar}%` }} />
        </div>
      </div>
    </div>
  );
}

function UpcomingRow({ day, mon, store, meta, amb, badge, badgeClass }: { day: string; mon: string; store: string; meta: string; amb?: string; badge: string; badgeClass: string }) {
  const avatarUrl = amb ? AMBASSADOR_AVATARS[amb] : null;
  const avatarBg = amb && !avatarUrl ? ["from-indigo-500 to-violet-500", "from-amber-500 to-orange-500", "from-emerald-500 to-teal-500"][amb.charCodeAt(0) % 3] : "";
  const retailerLogoUrl = getRetailerLogoUrl(store);
  return (
    <div className="brand-upc-row">
      <div className="brand-upc-date">
        <div className="font-mono text-[14px] font-medium text-[var(--dark)] leading-none">{day}</div>
        <div className="text-[8px] text-[var(--text3)] uppercase tracking-wider mt-0.5">{mon}</div>
      </div>
      {amb ? (
        avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={amb}
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover flex-shrink-0 border border-[var(--border)]"
          />
        ) : (
          <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${avatarBg} flex items-center justify-center font-serif text-[11px] text-white font-normal flex-shrink-0 border border-[var(--border)]`}>
            {amb.charAt(0)}
          </div>
        )
      ) : retailerLogoUrl ? (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border border-[var(--border)] bg-white overflow-hidden p-0.5">
          <RetailerLogo
            src={retailerLogoUrl}
            size={28}
            className="w-full h-full object-contain"
            fallback={
              <div className="w-7 h-7 rounded-full bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
                <UsersIconSmall />
              </div>
            }
          />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-[var(--elevated)] border border-[var(--border)] flex items-center justify-center flex-shrink-0">
          <UsersIconSmall />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-semibold text-[var(--dark)] truncate">{store}</div>
        <div className="text-[10px] text-[var(--text3)] mt-0.5 flex items-center gap-0.5">{meta}</div>
        {amb && <div className="text-[10px] text-[var(--text2)] mt-0.5">{amb}</div>}
      </div>
      <span className={`brand-badge ${badgeClass} text-[8px] flex-shrink-0`}>{badge}</span>
    </div>
  );
}

function TranscriptRow({
  store,
  time,
  amb,
  cust,
  sku,
  status = "live",
  statusClass,
  skuHighlight,
  skuHighlightClass = "green",
  showShare,
  showFlag,
}: {
  store: string;
  time: string;
  amb: string;
  cust: string;
  sku: string;
  status?: "live" | "ended";
  statusClass?: "amber" | "muted";
  skuHighlight?: string;
  skuHighlightClass?: "green" | "amber";
  showShare?: boolean;
  showFlag?: boolean;
}) {
  const statusBg =
    status === "live"
      ? "bg-[var(--green-bg)] text-[var(--green)] border-green/20"
      : statusClass === "amber"
        ? "bg-[var(--amber-bg)] text-[var(--amber)] border-amber/20"
        : "bg-[var(--elevated)] text-[var(--text3)] border-[var(--border)]";
  const custBg =
    skuHighlightClass === "amber"
      ? "bg-[var(--amber-bg)] text-[var(--amber)] border-amber/15"
      : "bg-[var(--green-bg)] text-[var(--green)] border-green/20";
  const highlightColor = skuHighlightClass === "amber" ? "text-[var(--amber)]" : "text-[var(--green)]";
  return (
    <div className="brand-fb-row">
      <div className="flex items-center gap-1.5 mb-1">
        <span className={`font-mono text-[8px] font-medium uppercase tracking-wider rounded-full px-1.5 py-0.5 flex items-center gap-1 border ${statusBg}`}>
          {status === "live" && <span className="w-1 h-1 rounded-full bg-[var(--green)] animate-pulse" />}
          {status === "live" ? "Live" : "Ended"}
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
          <span className={`font-mono text-[8.5px] px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5 border ${custBg}`}>CUST</span>
          <div className="text-[11.5px] text-[var(--text2)] leading-snug">{cust}</div>
        </div>
      </div>
        <div className="flex items-center justify-between gap-1.5 mt-1">
        <span className="font-mono text-[9px] text-[var(--text3)]">
          {skuHighlight ? (
            <>
              {sku.replace(skuHighlight, "")}
              <span className={`font-semibold ${highlightColor}`}>{skuHighlight}</span>
            </>
          ) : (
            sku
          )}
        </span>
        <div className="flex gap-1">
          <button type="button" className="brand-fb-btn text-[8px]">Full</button>
          {showShare && <button type="button" className="brand-fb-btn text-[8px]">Share</button>}
          {showFlag && (
            <button type="button" className="brand-fb-btn brand-fb-btn-flag text-[8px]">Flag</button>
          )}
        </div>
      </div>
    </div>
  );
}

const ACTIVITY_ICONS: Record<
  string,
  { path: React.ReactNode; colorClass: string }
> = {
  cam: {
    path: (
      <>
        <path d="M14.5 12A1.5 1.5 0 0113 13.5H3A1.5 1.5 0 011.5 12V5.5A1.5 1.5 0 013 4h1.5L6 2h4l1.5 2H13A1.5 1.5 0 0114.5 5.5V12z" />
        <circle cx="8" cy="8.5" r="2" />
      </>
    ),
    colorClass: "text-[#111]",
  },
  check: {
    path: (
      <>
        <circle cx="8" cy="8" r="6.5" />
        <polyline points="5,8.5 7,10.5 11,6.5" />
      </>
    ),
    colorClass: "text-[var(--green)]",
  },
  zap: {
    path: <polygon points="9,1.5 2.5,9.5 7.5,9.5 7,14.5 13.5,6.5 8.5,6.5" />,
    colorClass: "text-[var(--amber)]",
  },
  warn: {
    path: (
      <>
        <path d="M8 1.5L1 14.5h14L8 1.5z" />
        <line x1="8" y1="6.5" x2="8" y2="9.5" />
        <line x1="8" y1="11.5" x2="8.01" y2="11.5" strokeWidth={2} />
      </>
    ),
    colorClass: "text-[var(--red)]",
  },
  plus: {
    path: (
      <>
        <line x1="8" y1="2" x2="8" y2="14" />
        <line x1="2" y1="8" x2="14" y2="8" />
      </>
    ),
    colorClass: "text-[#111]",
  },
  star: {
    path: <polygon points="8,1.5 9.9,6.1 15,6.5 11.25,9.8 12.47,14.5 8,11.77 3.53,14.5 4.75,9.8 1,6.5 6.1,6.1" />,
    colorClass: "text-[var(--green)]",
  },
  dollar: {
    path: (
      <>
        <line x1="8" y1="1.5" x2="8" y2="14.5" />
        <path d="M10.5 4H6.75a2.25 2.25 0 000 4.5h2.5a2.25 2.25 0 010 4.5H5" />
      </>
    ),
    colorClass: "text-[var(--blue)]",
  },
  pin: {
    path: (
      <>
        <path d="M8 1.5C5.52 1.5 3.5 3.52 3.5 6c0 3.75 4.5 8.5 4.5 8.5s4.5-4.75 4.5-8.5c0-2.48-2.02-4.5-4.5-4.5z" />
        <circle cx="8" cy="6" r="1.5" />
      </>
    ),
    colorClass: "text-[var(--green)]",
  },
  box: {
    path: (
      <>
        <polyline points="14.5,5 8,1.5 1.5,5 1.5,11 8,14.5 14.5,11 14.5,5" />
        <polyline points="1.5,5 8,8.5 14.5,5" />
        <line x1="8" y1="8.5" x2="8" y2="14.5" />
      </>
    ),
    colorClass: "text-[#111]",
  },
  clock: {
    path: (
      <>
        <circle cx="8" cy="8" r="6.5" />
        <polyline points="8,4.5 8,8 10.5,10" />
      </>
    ),
    colorClass: "text-[var(--amber)]",
  },
};

function ActivityRow({
  icon,
  iconType,
  text,
  time,
}: {
  icon: "li" | "gr" | "am" | "re" | "bl";
  iconType: "cam" | "check" | "zap" | "warn" | "plus" | "star" | "dollar" | "pin" | "box" | "clock";
  text: React.ReactNode;
  time: string;
}) {
  const iconBg = {
    li: "bg-lime/15 border-lime-dark/30",
    gr: "bg-[var(--green-bg)] border-green/20",
    am: "bg-[var(--amber-bg)] border-amber/20",
    re: "bg-[var(--red-bg)] border-red/20",
    bl: "bg-[var(--blue-bg)] border-blue/20",
  }[icon];
  const activityIcon = ACTIVITY_ICONS[iconType] ?? ACTIVITY_ICONS.plus;
  return (
    <div className="brand-act-row">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 border ${iconBg}`}>
        <svg
          width="11"
          height="11"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={activityIcon.colorClass}
        >
          {activityIcon.path}
        </svg>
      </div>
      <div>
        <div className="text-[11.5px] text-[var(--text2)] leading-snug">{text}</div>
        <div className="text-[10px] text-[var(--text3)] mt-0.5">{time}</div>
      </div>
    </div>
  );
}

function WaveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <path d="M2 8h2l2-4 2 8 2-4 2 4h2" />
    </svg>
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
function UsersIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
      <path d="M11 2.5a2.5 2.5 0 010 5M15 13c0-2.21-1.79-4-4-4" />
    </svg>
  );
}
function UsersIconSmall() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <circle cx="6" cy="5" r="2.5" />
      <path d="M1 13c0-2.76 2.24-5 5-5s5 2.24 5 5" />
    </svg>
  );
}
function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <rect x="1.5" y="2.5" width="13" height="12" rx="1.5" />
      <line x1="1.5" y1="6.5" x2="14.5" y2="6.5" />
      <line x1="5" y1="1" x2="5" y2="4" />
      <line x1="11" y1="1" x2="11" y2="4" />
    </svg>
  );
}
function TagIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <path d="M8 1.5L14.5 8v5.5a1 1 0 01-1 1H2.5a1 1 0 01-1-1V2.5a1 1 0 011-1H8z" />
      <circle cx="6" cy="6" r="1.5" />
    </svg>
  );
}
function TargetIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <circle cx="8" cy="8" r="6" />
      <circle cx="8" cy="8" r="3" />
      <circle cx="8" cy="8" r="1" />
    </svg>
  );
}
function SparkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="1.5">
      <path d="M9 1.5L2.5 9.5 7.5 9.5 7 14.5 13.5 6.5 8.5 6.5 9 1.5z" />
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
