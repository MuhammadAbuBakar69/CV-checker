import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";

import type { Route } from "./+types/root";
import "./app.css";
import {usePuterStore} from "~/lib/puter";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { init } = usePuterStore();

  useEffect(() => {
    init();

    // Suppress Puter-related console errors for better UX
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMsg = args[0]?.toString() || '';
      
      // Filter out known Puter errors that are handled gracefully
      if (
        errorMsg.includes('message channel closed') ||
        errorMsg.includes('404 (Not Found)') ||
        errorMsg.includes('api.puter.com') ||
        errorMsg.includes('Failed to load resource')
      ) {
        // Silently ignore these errors - they're handled by our error states
        return;
      }
      
      // Log all other errors normally
      originalConsoleError.apply(console, args);
    };

    return () => {
      // Restore original console.error on cleanup
      console.error = originalConsoleError;
    };
  }, [init]);

  useEffect(() => {
    // Inject Chatbase embed snippet client-side so it runs on all pages.
    // This uses the user's provided snippet but runs only in the browser.
    if (typeof document === 'undefined') return;

    const snippet = `(function(){if(!window.chatbase||window.chatbase("getState")!=="initialized"){window.chatbase=(...arguments)=>{if(!window.chatbase.q){window.chatbase.q=[]}window.chatbase.q.push(arguments)};window.chatbase=new Proxy(window.chatbase,{get(target,prop){if(prop==="q"){return target.q}return(...args)=>target(prop,...args)}})}const onLoad=function(){const script=document.createElement("script");script.src="https://www.chatbase.co/embed.min.js";script.id="_6s85eyDIU1oYtvHEFAuA";script.domain="www.chatbase.co";document.body.appendChild(script)};if(document.readyState==="complete"){onLoad()}else{window.addEventListener("load",onLoad)}})();`;

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.id = 'chatbase-inline-snippet';
    s.text = snippet;
    document.body.appendChild(s);

    return () => {
      try {
        const el = document.getElementById('chatbase-inline-snippet');
        if (el && el.parentNode) el.parentNode.removeChild(el);
        const remote = document.getElementById('_6s85eyDIU1oYtvHEFAuA');
        if (remote && remote.parentNode) remote.parentNode.removeChild(remote);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
  <script src="https://js.puter.com/v2/"></script>
  {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
