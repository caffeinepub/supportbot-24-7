import { createRootRoute, createRoute } from "@tanstack/react-router";
import Layout from "./components/Layout";
import AdminPage from "./pages/AdminPage";
import ChatPage from "./pages/ChatPage";
import FaqPage from "./pages/FaqPage";
import HomePage from "./pages/HomePage";
import TicketPage from "./pages/TicketPage";

const rootRoute = createRootRoute({
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: HomePage,
});

const chatRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/chat",
  component: ChatPage,
});

const faqRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/faq",
  component: FaqPage,
});

const ticketRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/ticket",
  component: TicketPage,
});

const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

export const routeTree = rootRoute.addChildren([
  indexRoute,
  chatRoute,
  faqRoute,
  ticketRoute,
  adminRoute,
]);
