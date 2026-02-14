import { type RouteConfig, route, index } from "@react-router/dev/routes";

export default [
  route(":lang", "layouts/MainLayout.tsx", [
    index("routes/home/index.tsx"),
    route("about", "routes/about/index.tsx"),
    route("services", "routes/services/index.tsx"),
    route("contact", "routes/contact/index.tsx"),
    route("blog/:category?/:page?", "routes/blog/index.tsx"),
    route("article/:slug", "routes/article/index.tsx"),
    route("careers/:page?", "routes/careers/index.tsx"),
    route("legal/:slug", "routes/legal/index.tsx"),
  ]),
  route("*", "routes/not-found/index.tsx"),
] satisfies RouteConfig;
