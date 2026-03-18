export type PlanName = "free" | "pro" | "agency";

export const PLAN_CONFIG: Record<
  PlanName,
  { name: string; monthlyLimit: number; maxUsers: number }
> = {
  free: {
    name: "Free",
    monthlyLimit: 5,
    maxUsers: 1,
  },
  pro: {
    name: "Pro",
    monthlyLimit: 300,
    maxUsers: 1,
  },
  agency: {
    name: "Agency",
    monthlyLimit: 10000,
    maxUsers: 9999,
  },
};

export function normalizePlan(plan?: string): PlanName {
  if (plan === "pro") return "pro";
  if (plan === "agency") return "agency";
  return "free";
}