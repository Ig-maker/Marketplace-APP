import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Shelvian",
};

export default async function SettingsPage() {
  const user = await getCurrentUser();

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-2">Settings</h1>
        <p className="text-[var(--text3)] text-[15px]">Manage your account preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">Profile</h2>
          <div className="space-y-4">
            <SettingsField label="Name" value={user?.name || ""} />
            <SettingsField label="Email" value={user?.email || ""} />
            <SettingsField label="Role" value={user?.role || ""} disabled />
          </div>
        </section>

        {/* Notifications Section */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">Notifications</h2>
          <div className="space-y-3">
            <ToggleRow label="Email notifications" description="Receive shift updates and reminders" defaultChecked />
            <ToggleRow label="SMS notifications" description="Get text alerts for new shifts" defaultChecked />
            <ToggleRow label="Marketing emails" description="Tips, news, and product updates" />
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-[var(--surface)] border border-[var(--red)]/20 rounded-[var(--r-lg)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--red)] mb-2">Danger Zone</h2>
          <p className="text-[13px] text-[var(--text3)] mb-4">Permanently delete your account and all associated data.</p>
          <button className="text-[13px] font-semibold text-[var(--red)] bg-transparent border border-[var(--red)]/30 rounded-[var(--r)] px-4 py-2 cursor-pointer hover:bg-[var(--red)] hover:text-white transition-colors">
            Delete Account
          </button>
        </section>
      </div>
    </div>
  );
}

function SettingsField({ label, value, disabled }: { label: string; value: string; disabled?: boolean }) {
  return (
    <div>
      <label className="block text-[11px] font-semibold uppercase tracking-[0.07em] text-[var(--text3)] mb-[7px]">
        {label}
      </label>
      <input
        type="text"
        defaultValue={value}
        disabled={disabled}
        className="w-full max-w-md bg-[var(--off)] border-[1.5px] border-[var(--border)] rounded-[var(--r)] py-3 px-3.5 font-sans text-[15px] text-[var(--text)] outline-none focus:border-[var(--dark)] focus:shadow-[0_0_0_3px_rgba(17,17,17,0.07)] transition-all disabled:opacity-50 disabled:cursor-not-allowed capitalize"
      />
    </div>
  );
}

function ToggleRow({ label, description, defaultChecked }: { label: string; description: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-none cursor-pointer">
      <div>
        <div className="text-[14px] font-medium text-[var(--text)]">{label}</div>
        <div className="text-[12px] text-[var(--text3)]">{description}</div>
      </div>
      <input
        type="checkbox"
        defaultChecked={defaultChecked}
        className="w-4 h-4 accent-[var(--lime-dark)] cursor-pointer"
      />
    </label>
  );
}
