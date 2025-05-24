import { useEffect, useState, useRef } from "react";
import Layout from "~/layouts/Layout";
import type { User } from "~/pages/api/users";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [fade, setFade] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("lastLogin-desc");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setCurrentPage(1);
    }, 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchInput]);

  useEffect(() => {
    setFade(false);
    setIsFetching(true);
    setError(null);
    const timeout = setTimeout(() => {
      const fetchUsers = async () => {
        try {
          const params = new URLSearchParams({
            page: String(currentPage),
            limit: String(limit),
            sort,
          });
          if (searchInput) params.append("search", searchInput);
          const response = await fetch(`/api/users?${params.toString()}`);
          if (!response.ok) throw new Error("Failed to fetch users");
          const data = await response.json();
          setUsers(data.users);
          setTotalPages(data.totalPages);
          setTotal(data.total);
        } catch (err: any) {
          setError(err.message || "Unknown error");
          setUsers([]);
          setTotalPages(0);
          setTotal(0);
        } finally {
          setFade(true);
          setIsFetching(false);
        }
      };
      void fetchUsers();
    }, 200);
    return () => clearTimeout(timeout);
  }, [currentPage, limit, searchInput, sort]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSort(e.target.value);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">Users</h1>
        <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <span className="text-gray-600">Total Users: {total}</span>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search users..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="rounded border px-2 py-1 text-sm"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded bg-gray-200 px-2 py-1 text-sm text-gray-700 hover:bg-gray-300"
                aria-label="Clear search"
              >
                Clear
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="sort" className="mr-2 text-sm">
              Sort by:
            </label>
            <select
              id="sort"
              value={sort}
              onChange={handleSortChange}
              className="rounded border px-2 py-1 text-sm"
            >
              <option value="lastLogin-desc">Last Login (Newest)</option>
              <option value="lastLogin-asc">Last Login (Oldest)</option>
            </select>
            <label htmlFor="limit" className="mr-2 ml-4 text-sm">
              Per page:
            </label>
            <select
              id="limit"
              value={limit}
              onChange={handleLimitChange}
              className="rounded border px-2 py-1 text-sm"
            >
              {[5, 10, 20, 50].map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div
          className={`overflow-x-auto rounded border bg-white shadow transition-opacity duration-300 ${fade ? "opacity-100" : "opacity-0"}`}
        >
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Email
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Role
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium tracking-wider text-gray-500 uppercase">
                  Last Login
                </th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i}>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      {i === 0 ? "Loading users..." : null}
                    </td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-red-500"
                  >
                    {error}
                  </td>
                </tr>
              ) : users.length === 0 ? (
                Array.from({ length: limit }).map((_, i) => (
                  <tr key={i}>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-gray-400"
                    >
                      {i === 0 ? "No users found." : null}
                    </td>
                  </tr>
                ))
              ) : (
                [
                  ...users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 font-medium text-gray-900">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 text-gray-700">{user.email}</td>
                      <td className="px-4 py-2 text-gray-700">{user.role}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`rounded-full px-2 py-1 text-xs font-semibold ${user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-200 text-gray-600"}`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-500">
                        {new Date(user.lastLogin).toLocaleString()}
                      </td>
                    </tr>
                  )),
                  ...Array.from({ length: limit - users.length }).map(
                    (_, i) => (
                      <tr key={`empty-${i}`}>
                        <td colSpan={5} className="px-4 py-8" />
                      </tr>
                    ),
                  ),
                ]
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isFetching}
            className="rounded border bg-white px-3 py-1 disabled:opacity-50"
          >
            Prev
          </button>
          <span className="mx-2 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isFetching}
            className="rounded border bg-white px-3 py-1 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </Layout>
  );
}
