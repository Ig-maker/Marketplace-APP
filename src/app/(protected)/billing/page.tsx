import { getCurrentUser } from "@/lib/session";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Billing — Shelvian",
};

export default async function BillingPage() {
  const user = await getCurrentUser();
  const isBrand = user?.role === "brand";

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-[var(--dark)] mb-2">Billing</h1>
        <p className="text-[var(--text3)] text-[15px]">
          {isBrand ? "Manage your subscription and payment methods." : "View your earnings and payout history."}
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Plan / Earnings */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-1">
                {isBrand ? "Growth Plan" : "Earnings This Month"}
              </h2>
              <p className="text-[13px] text-[var(--text3)]">
                {isBrand ? "Billed monthly · Renews Apr 1, 2026" : "March 2026"}
              </p>
            </div>
            <div className="text-right">
              <div className="font-serif text-3xl text-[var(--dark)]">
                {isBrand ? "$299" : "$1,820"}
              </div>
              <div className="text-[12px] text-[var(--text3)]">
                {isBrand ? "/month" : "7 shifts completed"}
              </div>
            </div>
          </div>
          {isBrand && (
            <div className="mt-4 flex gap-3">
              <button className="text-[13px] font-semibold text-[var(--text)] bg-transparent border border-[var(--border)] rounded-[var(--r)] px-4 py-2 cursor-pointer hover:border-[var(--border2)] transition-colors">
                Change Plan
              </button>
              <button className="text-[13px] font-semibold text-[var(--text3)] bg-transparent border-none cursor-pointer hover:text-[var(--text)] transition-colors">
                Cancel Subscription
              </button>
            </div>
          )}
        </section>

        {/* Payment Method / Payout Method */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">
            {isBrand ? "Payment Method" : "Payout Method"}
          </h2>
          <div className="flex items-center justify-between p-4 bg-[var(--off)] rounded-[var(--r)] border border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-7 bg-[var(--dark)] rounded flex items-center justify-center text-white text-[10px] font-mono font-bold">
                VISA
              </div>
              <div>
                <div className="text-[14px] font-medium text-[var(--text)]">
                  •••• •••• •••• 4242
                </div>
                <div className="text-[12px] text-[var(--text3)]">Expires 12/27</div>
              </div>
            </div>
            <button className="text-[13px] font-medium text-[var(--text3)] bg-transparent border-none cursor-pointer hover:text-[var(--text)] transition-colors">
              Update
            </button>
          </div>
        </section>

        {/* Transaction History */}
        <section className="bg-[var(--surface)] border border-[var(--border)] rounded-[var(--r-lg)] p-6">
          <h2 className="text-[15px] font-semibold text-[var(--dark)] mb-4">
            {isBrand ? "Invoice History" : "Payout History"}
          </h2>
          <div className="space-y-0">
            <TransactionRow
              date="Mar 1, 2026"
              description={isBrand ? "Growth Plan — Monthly" : "Oatly — Whole Foods demo"}
              amount={isBrand ? "$299.00" : "$260.00"}
              status="paid"
            />
            <TransactionRow
              date="Feb 28, 2026"
              description={isBrand ? "Shift fulfillment — 12 shifts" : "Siete Foods — Target demo"}
              amount={isBrand ? "$3,120.00" : "$240.00"}
              status="paid"
            />
            <TransactionRow
              date="Feb 1, 2026"
              description={isBrand ? "Growth Plan — Monthly" : "Chomps — Sprouts demo"}
              amount={isBrand ? "$299.00" : "$300.00"}
              status="paid"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function TransactionRow({
  date,
  description,
  amount,
  status,
}: {
  date: string;
  description: string;
  amount: string;
  status: "paid" | "pending";
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[var(--border)] last:border-none">
      <div className="flex items-center gap-4">
        <span className="text-[12px] text-[var(--text3)] w-24 flex-shrink-0">{date}</span>
        <span className="text-[14px] text-[var(--text)]">{description}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-[14px] font-mono font-medium text-[var(--dark)]">{amount}</span>
        <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
          status === "paid"
            ? "bg-[rgba(24,166,100,0.1)] text-[var(--green)]"
            : "bg-[var(--elevated)] text-[var(--text3)]"
        }`}>
          {status}
        </span>
      </div>
    </div>
  );
}
