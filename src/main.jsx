import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Events from './pages/Events.jsx'
import Members from './pages/Members.jsx'
import Contact from './pages/Contact.jsx'
import EventDetails from "./pages/EventDetails";
import Resources from './pages/Resources.jsx'
import WebsprintResults from './pages/WebsprintResults.jsx'
import DSA from './pages/DSA.jsx'
import Development from './pages/Development.jsx'
import Academics from './pages/Academics.jsx'

const router = createBrowserRouter([
  {
    path: "",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />
      },
      {
        path: "/events",
        element: <Events />
      },
      {
        path: "/members",
        element: <Members />
      },
      {
        path: "/contact",
        element: <Contact />

      },
      {
        path: "/events/:slug",
        element: <EventDetails />
      },
      {
        path: "/results/websprint-2025",
        element: <WebsprintResults />
      },
      {
        path: "/resources",
        element: <Resources />,
      },
      {
            path: "/dsa",
            element: <DSA />
          },
          {
            path: "/development",
            element: <Development />
          },
          {
            path: "/academics",
            element: <Academics />
          }
    ]
  },
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
