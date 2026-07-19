import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  createHashHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Link,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";
import { exportJson, importJson, seedIfEmpty } from "./data/repo";
import { AccountsPage } from "./pages/AccountsPage";
import { JournalPage } from "./pages/JournalPage";
import { LearnPage } from "./pages/LearnPage";
import { NewEntryPage } from "./pages/NewEntryPage";
import "./styles.css";

function downloadExport() {
  void exportJson().then((json) => {
    const blob = new Blob([json], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `kakeibo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
}

function pickImport() {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "application/json";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      await importJson(await file.text());
    } catch (e) {
      alert(e instanceof Error ? e.message : String(e));
    }
  };
  input.click();
}

function Layout() {
  const linkClass = "px-3 py-1.5 rounded-md text-sm hover:bg-stone-800";
  const activeProps = { className: `${linkClass} bg-stone-800 text-white` };
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <header className="mb-8 flex flex-wrap items-center gap-2">
        <h1 className="mr-auto text-lg font-bold tracking-tight">
          家計簿 <span className="text-stone-400 font-normal">kakeibo</span>
        </h1>
        <nav className="flex gap-1">
          <Link to="/" className={linkClass} activeProps={activeProps}>
            Accounts
          </Link>
          <Link to="/journal" className={linkClass} activeProps={activeProps}>
            Journal
          </Link>
          <Link to="/new" className={linkClass} activeProps={activeProps}>
            New entry
          </Link>
          <Link to="/learn" className={linkClass} activeProps={activeProps}>
            Learn
          </Link>
        </nav>
        <div className="flex gap-1 text-xs text-stone-500">
          <button
            type="button"
            onClick={downloadExport}
            className="px-2 py-1 hover:text-stone-200"
          >
            export
          </button>
          <button
            type="button"
            onClick={pickImport}
            className="px-2 py-1 hover:text-stone-200"
          >
            import
          </button>
        </div>
      </header>
      <Outlet />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });
const routes = [
  createRoute({ getParentRoute: () => rootRoute, path: "/", component: AccountsPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/journal", component: JournalPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/new", component: NewEntryPage }),
  createRoute({ getParentRoute: () => rootRoute, path: "/learn", component: LearnPage }),
];

const router = createRouter({
  routeTree: rootRoute.addChildren(routes),
  history: createHashHistory(),
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

await seedIfEmpty();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
