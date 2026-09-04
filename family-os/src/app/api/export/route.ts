import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { getCurrentMember } from "@/lib/currentMember";
import { todayIST } from "@/lib/calendarEvents";

export async function GET() {
  const me = await getCurrentMember();
  if (!me) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const h = me.householdId;
  const [
    householdRows,
    members,
    appointments,
    documents,
    medicines,
    financialItems,
    trips,
    expenses,
    contacts,
    tasks,
    importantDates,
    staff,
    shopping,
  ] = await Promise.all([
    sql`SELECT household_name FROM household_auth WHERE id = ${h}`,
    sql`SELECT id, name, role, emoji FROM family_members WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, title, date::text, time, location, notes, family_member_id FROM appointments WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY date`,
    sql`SELECT id, title, category, file_name, expiry_date::text, family_member_id FROM documents WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, name, dosage, schedule, refill_date::text, active, family_member_id, notes FROM medicines WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, type, title, provider, amount, due_date::text, recurring, is_paid, notes FROM financial_items WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, name, destination, start_date::text, end_date::text, notes FROM travel_trips WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT te.id, te.trip_id, te.category, te.amount, te.date::text, te.notes FROM travel_expenses te JOIN travel_trips t ON t.id = te.trip_id WHERE t.household_id = ${h} ORDER BY te.id`,
    sql`SELECT id, name, relation, phone, notes FROM emergency_contacts WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, title, assigned_to, due_date::text, recurring, is_done FROM household_tasks WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, title, date::text, recurring_yearly, notes FROM important_dates WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, name, role, phone, monthly_salary, salary_due_day, notes FROM household_staff WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
    sql`SELECT id, name, quantity, is_checked FROM shopping_items WHERE deleted_at IS NULL AND household_id = ${h} ORDER BY id`,
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    household: (householdRows[0]?.household_name as string) ?? "Family OS household",
    familyMembers: members,
    appointments,
    documents,
    medicines,
    billsAndPayments: financialItems,
    travelTrips: trips,
    travelExpenses: expenses,
    emergencyContacts: contacts,
    tasks,
    importantDates,
    householdStaff: staff,
    shoppingList: shopping,
    note: "Document files themselves aren't included — this covers the record metadata (titles, dates, notes). Sign in and re-download files from the Documents page if you need the originals.",
  };

  const filename = `family-os-export-${todayIST()}.json`;
  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}
