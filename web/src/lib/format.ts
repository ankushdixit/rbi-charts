/**
 * Format a number in lakh to a readable string.
 * e.g. 203941.84 lakh → "20.4B" (billion transactions)
 */
export function lakhToBillions(lakh: number): number {
  // 1 lakh = 100,000 transactions
  // So lakh * 100,000 / 1,000,000,000 = lakh / 10,000
  return lakh / 10000;
}

export function formatBillions(value: number): string {
  if (value >= 1) return `${value.toFixed(1)}B`;
  if (value >= 0.01) return `${(value * 1000).toFixed(0)}M`;
  return `${(value * 1000000).toFixed(0)}K`;
}

export function formatCroresToTrillions(crore: number): string {
  // 1 crore = 10 million. To get trillions: crore * 1e7 / 1e12 = crore / 1e5
  const trillions = crore / 100000;
  if (trillions >= 1) return `₹${trillions.toFixed(1)}T`;
  const billions = crore / 100;
  if (billions >= 1) return `₹${billions.toFixed(0)}B`;
  return `₹${crore.toFixed(0)} Cr`;
}

export function formatMonth(dateStr: string): string {
  const [year, month] = dateStr.split("-");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[parseInt(month) - 1]} ${year}`;
}
