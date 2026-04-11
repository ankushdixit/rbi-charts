import { describe, it, expect } from "vitest";
import {
  lakhToBillions,
  formatBillions,
  formatCroresToTrillions,
  formatMonth,
} from "./format";

describe("lakhToBillions", () => {
  it("converts lakh to billions (1 lakh = 100K, 10000 lakh = 1B)", () => {
    expect(lakhToBillions(10000)).toBe(1);
  });

  it("handles typical UPI volume (204000 lakh = 20.4B)", () => {
    expect(lakhToBillions(204000)).toBeCloseTo(20.4);
  });

  it("handles zero", () => {
    expect(lakhToBillions(0)).toBe(0);
  });

  it("handles small values", () => {
    expect(lakhToBillions(100)).toBeCloseTo(0.01);
  });
});

describe("formatBillions", () => {
  it("formats values >= 1 as billions", () => {
    expect(formatBillions(20.4)).toBe("20.4B");
  });

  it("formats values >= 0.01 as millions", () => {
    expect(formatBillions(0.5)).toBe("500M");
  });

  it("formats tiny values as thousands", () => {
    expect(formatBillions(0.001)).toBe("1000K");
  });

  it("handles exactly 1B", () => {
    expect(formatBillions(1)).toBe("1.0B");
  });

  it("rounds correctly", () => {
    expect(formatBillions(1.05)).toBe("1.1B");
    expect(formatBillions(1.04)).toBe("1.0B");
  });
});

describe("formatCroresToTrillions", () => {
  it("formats large values as trillions", () => {
    expect(formatCroresToTrillions(200000)).toBe("₹2.0T");
  });

  it("formats medium values as billions", () => {
    expect(formatCroresToTrillions(5000)).toBe("₹50B");
  });

  it("formats small values as crore", () => {
    expect(formatCroresToTrillions(50)).toBe("₹50 Cr");
  });

  it("handles 1 lakh crore = 1T", () => {
    expect(formatCroresToTrillions(100000)).toBe("₹1.0T");
  });
});

describe("formatMonth", () => {
  it("formats YYYY-MM to Mon YYYY", () => {
    expect(formatMonth("2025-01")).toBe("Jan 2025");
    expect(formatMonth("2024-12")).toBe("Dec 2024");
  });

  it("handles all months", () => {
    const expected = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];
    for (let i = 0; i < 12; i++) {
      const month = String(i + 1).padStart(2, "0");
      expect(formatMonth(`2025-${month}`)).toBe(`${expected[i]} 2025`);
    }
  });
});
