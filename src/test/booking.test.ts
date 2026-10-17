import { describe, it, expect } from "vitest";
import { validateEnquiry } from "@/components/glow/BookingForm";
const ok = { name: "Asha Rao", phone: "9876543210", email: "", speciality: "Skin" };
describe("enquiry validation", () => {
  it("accepts valid enquiry without email", () => expect(validateEnquiry(ok)).toEqual({}));
  it("requires full name", () => expect(validateEnquiry({ ...ok, name: "" }).name).toBeTruthy());
  it("rejects short phone", () =>
    expect(validateEnquiry({ ...ok, phone: "12345" }).phone).toBeTruthy());
  it("rejects bad email", () => expect(validateEnquiry({ ...ok, email: "x@" }).email).toBeTruthy());
  it("requires a speciality from Skin/Hair/Laser/Other", () =>
    expect(validateEnquiry({ ...ok, speciality: "Dental" }).speciality).toBeTruthy());
});
