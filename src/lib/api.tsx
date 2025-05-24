import type { Activity } from "~/pages/api/activities";
import type { Event } from "~/pages/api/events";
import type { Metrics } from "~/pages/api/metrics";
import type { Project } from "~/pages/api/projects";
import type { User } from "~/pages/api/users";

export async function fetchDashboardData() {
  try {
    const [users, projects, activities, metrics, events] = await Promise.all([
      fetch("/api/users").then((res) => res.json() as Promise<User[]>),
      fetch("/api/projects").then(
        (res) => res.json() as Promise<{ data: Project[] }>,
      ),
      fetch("/api/activities").then(
        (res) => res.json() as Promise<{ activities: Activity[] }>,
      ),
      fetch("/api/metrics").then((res) => res.json() as Promise<Metrics>),
      fetch("/api/events").then(
        (res) => res.json() as Promise<{ upcoming: Event[] }>,
      ),
    ]);

    const mergedData = {
      users: users,
      projects: projects,
      recentActivity: activities.activities.slice(0, 5),
      metrics: {
        activeUsers: metrics.users.active,
        completedProjects: metrics.projects.completed,
        pendingTasks: projects.data.reduce(
          (acc: number, project: Project) => acc + project.pendingTasks,
          0,
        ),
        upcomingEvents: events.upcoming.filter(
          (event: Event) => new Date(event.date) > new Date(),
        ).length,
      },
    };

    return mergedData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {};
  }
}

export async function fetchUserData(userId: string) {
  const userResponse = await fetch(`/api/users/${userId}`);
  const userData = (await userResponse.json()) as User;

  const projectsResponse = await fetch(`/api/users/${userId}/projects`);
  const projectsData = (await projectsResponse.json()) as Project[];

  return {
    ...userData,
    projects: projectsData,
  };
}
