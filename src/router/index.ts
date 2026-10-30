import { createRouter, createWebHistory, type RouterHistory } from "vue-router";
import { useSessionStore } from "../stores/session";
import EventsPage from "../pages/EventsPage.vue";

declare module "vue-router" {
  interface RouteMeta {
    organiserOnly?: boolean;
  }
}

export const routes = [
  { path: "/", name: "events", component: EventsPage },
  // TODO A1: add these routes. Lazy-load each page: component: () => import("../pages/....vue")
  //   /events/new    name "event-new"     NewEventPage      meta: { organiserOnly: true }
  { path: "/events/new", name: "event-new", component: () => import("../pages/NewEventPage.vue"), meta: { organiserOnly: true } },
  //   /events/:id    name "event-detail"  EventDetailPage   props: true, and only digits: ":id(\\d+)"
  { path: "/events/:id(\\d+)", name: "event-detail", component: () => import("../pages/EventDetailPage.vue"), props: true },
  //   /my-bookings   name "my-bookings"   MyBookingsPage
  { path: "/events/:id(\\d+)", name: "event-detail", component: () => import("../pages/EventDetailPage.vue"), props: true },
  //   anything else  name "not-found"     NotFoundPage      path: "/:pathMatch(.*)*"
  { path: "/:pathMatch(.*)*", name: "not-found", component: () => import("../pages/NotFoundPage.vue") },
  // Question: why must "/events/new" come before "/events/:id" if :id had no (\\d+)?
  //Vue Router matches routes from top to bottom and stops at the first match. Without (\d+), /events/:id would match /events/new (treating "new" as the id), so the router would never reach the /events/new route below it.
];

export function makeRouter(history: RouterHistory = createWebHistory()) {
  const router = createRouter({ history, routes });

  // TODO A2: a global guard (router.beforeEach).
  // If the route has meta.organiserOnly and the session is not an organiser,
  // redirect to { name: "events", query: { denied: "1" } }.
   router.beforeEach((to) => {
    const session = useSessionStore();
    if (to.meta.organiserOnly && session.role !== "organiser") {
      return { name: "events", query: { denied: "1" } };
    }
  });
  //void useSessionStore; // remove this line when you use the store

  return router;
}
