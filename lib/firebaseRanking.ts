import type { User } from '@react-native-firebase/auth';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  FieldValue,
  type QuerySnapshot,
  type DocumentData,
} from '@react-native-firebase/firestore';

export interface RankRow {
  uid: string;
  displayName: string;
  photoURL: string | null;
  xp: number;
  xpWeek: number;
  streak: number;
  level: number;
}

function isoWeekId(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}

export function currentWeekId(): string {
  return isoWeekId(new Date());
}

const db = getFirestore();
const usersRef = collection(db, 'users');

/** Cria/garante o doc do usuário no Firestore com os dados atuais de XP. */
export async function ensureRankDoc(
  user: User,
  xpTotal: number,
  streak: number,
): Promise<void> {
  setDoc(
    doc(db, 'users', user.uid),
    {
      displayName: user.displayName ?? 'Anônimo',
      photoURL: user.photoURL ?? null,
      allTimeXP: xpTotal,
      xpWeek: xpTotal,
      weekId: currentWeekId(),
      currentStreak: streak,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  ).catch(() => {});
}

/**
 * Após ganhar XP: aplica delta nos XP semanal/geral. Se a semana virou,
 * o xpWeek é redefinido (começa do delta desta semana).
 */
export async function syncXpDelta(
  user: User,
  delta: number,
  streak: number,
): Promise<void> {
  if (delta <= 0 && streak <= 0) return;
  const ref = doc(db, 'users', user.uid);
  const snap = await getDoc(ref);
  const data = snap.data();
  const weekId = currentWeekId();
  const sameWeek = snap.exists() && data?.weekId === weekId;
  const positive = Math.max(delta, 0);

  await setDoc(
    ref,
    {
      displayName: user.displayName ?? 'Anônimo',
      photoURL: user.photoURL ?? null,
      weekId,
      currentStreak: streak,
      lastEntryAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
      allTimeXP: FieldValue.increment(positive),
      xpWeek: sameWeek ? FieldValue.increment(positive) : positive,
    },
    { merge: true },
  );
}

async function snapshotToRows(snap: QuerySnapshot<DocumentData, DocumentData>): Promise<RankRow[]> {
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    const allTimeXP = typeof data.allTimeXP === 'number' ? data.allTimeXP : 0;
    return {
      uid: docSnap.id,
      displayName: data.displayName ?? 'Anônimo',
      photoURL: data.photoURL ?? null,
      xp: allTimeXP,
      xpWeek: typeof data.xpWeek === 'number' ? data.xpWeek : 0,
      streak: typeof data.currentStreak === 'number' ? data.currentStreak : 0,
      level: Math.floor(allTimeXP / 100) + 1,
    };
  });
}

export async function fetchWeeklyRanking(): Promise<RankRow[]> {
  const snap = await getDocs(
    query(
      usersRef,
      where('weekId', '==', currentWeekId()),
      orderBy('xpWeek', 'desc'),
      limit(50),
    ),
  );
  const rows = await snapshotToRows(snap);
  for (const row of rows) {
    row.xp = row.xpWeek; // no ranking semanal, XP exibido = xpWeek
  }
  return rows;
}

export async function fetchAllTimeRanking(): Promise<RankRow[]> {
  const snap = await getDocs(
    query(usersRef, orderBy('allTimeXP', 'desc'), limit(50)),
  );
  return snapshotToRows(snap);
}
