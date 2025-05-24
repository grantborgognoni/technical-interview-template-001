import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Layout from "~/layouts/Layout";
import type { Project as ApiProject } from "~/pages/api/projects";
import ProjectCard from "~/components/ProjectCard";

export default function Projects() {
  const router = useRouter();
  const { page: pageQuery, limit: limitQuery } = router.query;
  const [projects, setProjects] = useState<ApiProject[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(Number(pageQuery) || 1);
  const [limit, setLimit] = useState(Number(limitQuery) || 10);
  const [total, setTotal] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [fade, setFade] = useState(true);

  // Sync state with query params on mount and when query changes
  useEffect(() => {
    if (pageQuery && Number(pageQuery) !== currentPage) {
      setCurrentPage(Number(pageQuery));
    }
    if (limitQuery && Number(limitQuery) !== limit) {
      setLimit(Number(limitQuery));
    }
  }, [pageQuery, limitQuery]);

  useEffect(() => {
    setFade(false);
    setIsFetching(true);
    const timeout = setTimeout(() => {
      const fetchProjects = async () => {
        const response = await fetch(
          `/api/projects?page=${currentPage}&limit=${limit}`,
        );
        const data = await response.json();
        setProjects(data.data);
        setTotalPages(data.totalPages);
        setTotal(data.total);
        setFade(true);
        setIsFetching(false);
      };
      void fetchProjects();
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, page: currentPage, limit },
        },
        undefined,
        { shallow: true },
      );
    }, 200);
    return () => clearTimeout(timeout);
  }, [currentPage, limit]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <Layout>
      <div className="p-6">
        <h1 className="mb-2 text-2xl font-bold">Projects</h1>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-gray-600">Total Projects: {total}</span>
          <div>
            <label htmlFor="limit" className="mr-2 text-sm">
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
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {isFetching
            ? Array.from({ length: limit }).map((_, i) => (
                <ProjectCard key={i} loading />
              ))
            : projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={{
                    id: project.id,
                    name: project.name,
                    status: project.status,
                    completion: project.completion,
                  }}
                />
              ))}
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
