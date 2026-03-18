import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Demo Dashboard — Shelvian",
};

export default async function DemoDashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      {/* Demo banner */}
      <div className="mb-6 bg-[rgba(203,236,69,0.2)] border border-[var(--lime)] rounded-[var(--r)] px-4 py-3 flex items-center gap-2">
        <span className="font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--dark)]">
          Demo
        </span>
        <span className="text-[13px] text-[var(--text2)]">
          This is a preview with sample data. Your real dashboard will show your campaigns and shifts.
        </span>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-2">
          Welcome back, {user?.name}.
        </h1>
        <p className="text-[var(--text3)] text-[15px]">
          Here&apos;s what&apos;s happening with your campaigns today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard label="Active Campaigns" value="3" />
        <StatCard label="Shifts This Week" value="12" />
        <StatCard label="Fill Rate" value="97%" accent />
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
        <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityRow
            title="Oatly Spring Push — shift confirmed"
            time="2 hours ago"
          />
          <ActivityRow
            title="New ambassador application received"
            time="5 hours ago"
          />
          <ActivityRow
            title="Event report submitted — Chomps demo"
            time="1 day ago"
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-5">
      <div className="text-[12px] font-medium text-[var(--text3)] uppercase tracking-wider mb-2">{label}</div>
      <div className={`font-serif text-3xl ${accent ? "text-[var(--lime-dark)]" : "text-[var(--dark)]"}`}>{value}</div>
    </div>
  );
}

function ActivityRow({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-none">
      <span className="text-[14px] text-[var(--text)]">{title}</span>
      <span className="text-[12px] text-[var(--text3)] flex-shrink-0 ml-4">{time}</span>
    </div>
  );
}
