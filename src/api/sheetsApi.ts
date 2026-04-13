import type { Challenge } from "../types/challenge";

// Paste your deployed Google Apps Script web app URL here after deployment.
// Instructions: Extensions > Apps Script > Deploy > New deployment > Web app
// Execute as: Me, Who has access: Anyone
export const SCRIPT_URL: string =
  "https://script.google.com/macros/s/AKfycbzXIglNPjIzG4HtK_CoXM-A4urZjomYpq4w0VUQBMNUDksmNhohzlHnEnJf8y14nUdw/exec";

function parseCompletedDays(raw: string): number[] {
  if (!raw || raw.trim() === "") return [];
  return raw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

export async function getChallenges(): Promise<Challenge[]> {
  const url = `${SCRIPT_URL}?action=getChallenges`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Failed to fetch challenges");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Unknown error");
  return (
    data.challenges as Array<{
      id: string;
      title: string;
      duration: string;
      createdAt: string;
      completedDays: string;
    }>
  ).map((row) => ({
    id: row.id,
    title: row.title,
    duration: parseInt(row.duration, 10),
    createdAt: row.createdAt,
    completedDays: parseCompletedDays(row.completedDays),
  }));
}

export async function createChallenge(
  title: string,
  duration: number,
): Promise<Challenge> {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    // Using text/plain avoids a CORS preflight request
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "createChallenge", title, duration }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("Failed to create challenge");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Unknown error");
  return {
    id: data.challenge.id,
    title: data.challenge.title,
    duration: parseInt(data.challenge.duration, 10),
    createdAt: data.challenge.createdAt,
    completedDays: [],
  };
}

export async function toggleDay(id: string, day: number): Promise<number[]> {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "toggleDay", id, day }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("Failed to toggle day");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Unknown error");
  return parseCompletedDays(data.completedDays);
}

export async function deleteChallenge(id: string): Promise<void> {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ action: "deleteChallenge", id }),
    redirect: "follow",
  });
  if (!res.ok) throw new Error("Failed to delete challenge");
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Unknown error");
}
