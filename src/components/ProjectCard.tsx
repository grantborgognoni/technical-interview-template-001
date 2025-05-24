import React from "react";

export type Project = {
  id: string;
  name: string;
  status: string;
  completion: number;
};

interface ProjectCardProps {
  project?: Project;
  loading?: boolean;
}

export default function ProjectCard({
  project,
  loading = false,
}: ProjectCardProps) {
  if (loading) {
    return (
      <div className="h-28 animate-pulse rounded border bg-gray-100 p-3">
        <div className="mb-2 flex justify-between">
          <div className="h-4 w-1/3 rounded bg-gray-300" />
          <div className="h-4 w-16 rounded-full bg-blue-200" />
        </div>
        <div className="mt-2 h-2 rounded-full bg-gray-200">
          <div className="h-2 w-1/2 rounded-full bg-blue-200" />
        </div>
        <div className="mt-3 ml-auto h-3 w-12 self-end rounded bg-gray-200" />
      </div>
    );
  }
  if (!project) return null;
  return (
    <div className="rounded border p-3">
      <div className="flex justify-between">
        <h3 className="font-medium">{project.name}</h3>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-sm text-blue-800">
          {project.status}
        </span>
      </div>
      <div className="mt-2 h-2 rounded-full bg-gray-200">
        <div
          className="h-2 rounded-full bg-blue-500"
          style={{ width: `${project.completion}%` }}
        ></div>
      </div>
      <p className="mt-1 text-right text-sm">{project.completion}%</p>
    </div>
  );
}
