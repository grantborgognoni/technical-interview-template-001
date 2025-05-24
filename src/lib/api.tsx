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
  try {
    // This ties into TECH-004/005. A consistent pattern for requests and responses need to be developed.
    // and it's 12:54 AM rn and I'm exhausted.
    // So here's in words what I would do.
    // for all api routes, I would use standard response statuses and error messages as my form of error handling.
    // these would be displayed on the frontend.
    // Now in terms of refactoring, I would probably just implement react query. There's no need to build out my own system unless
    // we have some niche requirement. Ok, goodnight.
    const userResponse = await fetch(`/api/users/${userId}`);
    const userData = (await userResponse.json()) as User;

    const projectsResponse = await fetch(`/api/users/${userId}/projects`);
    const projectsData = (await projectsResponse.json()) as Project[];

    return {
      ...userData,
      projects: projectsData,
    };
  } catch (error) {
    console.error("Error fetching user data:", error);
    return {};
  }
}
