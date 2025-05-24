import type { NextApiRequest, NextApiResponse } from "next";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  lastLogin: string;
};

const users: User[] = Array.from({ length: 100 }, (_, i) => ({
  id: `user-${i + 1}`,
  name: `User ${i + 1}`,
  email: `user${i + 1}@example.com`,
  role: i % 5 === 0 ? "admin" : "user",
  status: i % 7 === 0 ? "inactive" : "active",
  lastLogin: new Date(
    Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30,
  ).toISOString(),
}));

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    page = "1",
    limit = "10",
    search = "",
    sort = "lastLogin-desc",
  } = req.query;

  const pageNum = parseInt(page as string);
  const limitNum = parseInt(limit as string);
  const searchStr = (search as string).toLowerCase();
  const sortStr = sort as string;

  // Filter by search (name or email, case-insensitive, substring)
  let filtered = users;
  if (searchStr) {
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(searchStr) ||
        u.email.toLowerCase().includes(searchStr),
    );
  }

  // Sort by lastLogin (default: descending)
  if (sortStr.startsWith("lastLogin")) {
    filtered = filtered.slice().sort((a, b) => {
      const aTime = new Date(a.lastLogin).getTime();
      const bTime = new Date(b.lastLogin).getTime();
      if (sortStr === "lastLogin-asc") {
        return aTime - bTime;
      } else {
        return bTime - aTime;
      }
    });
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limitNum);
  const startIdx = (pageNum - 1) * limitNum;
  const endIdx = startIdx + limitNum;
  const paginatedUsers = filtered.slice(startIdx, endIdx);

  setTimeout(
    () => {
      return res.status(200).json({
        users: paginatedUsers,
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
      });
    },
    Math.random() * 500 + 100,
  );
}
