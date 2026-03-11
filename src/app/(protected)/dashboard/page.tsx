import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard — Shelvian",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-2">
          Welcome back, {user?.name}.
        </h1>
        <p className="text-[var(--text3)] text-[15px]">
          Here&apos;s what&apos;s happening with your {user?.role === "brand" ? "campaigns" : "shifts"} today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {user?.role === "brand" ? (
          <>
            <StatCard label="Active Campaigns" value="3" />
            <StatCard label="Shifts This Week" value="12" />
            <StatCard label="Fill Rate" value="97%" accent />
          </>
        ) : (
          <>
            <StatCard label="Upcoming Shifts" value="2" />
            <StatCard label="This Month" value="$1,820" accent />
            <StatCard label="Rating" value="4.9 ★" />
          </>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
        <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <ActivityRow
            title={user?.role === "brand" ? "Oatly Spring Push — shift confirmed" : "Shift confirmed: Oatly — Whole Foods"}
            time="2 hours ago"
          />
          <ActivityRow
            title={user?.role === "brand" ? "New ambassador application received" : "Payment received: $260.00"}
            time="5 hours ago"
          />
          <ActivityRow
            title={user?.role === "brand" ? "Event report submitted — Chomps demo" : "New shift available: Siete Foods — Target"}
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
