import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import App from "./App.jsx";

// Main website pages
import Home from "./pages/Home.jsx";
import Events from "./pages/Events.jsx";
import Members from "./pages/Members.jsx";
import Contact from "./pages/Contact.jsx";
import EventDetails from "./pages/EventDetails.jsx";
import Resources from "./pages/Resources.jsx";
import WebsprintResults from "./pages/WebsprintResults.jsx";
import DSA from "./pages/DSA.jsx";
import Development from "./pages/Development.jsx";
import Academics from "./pages/Academics.jsx";

// SIH pages
import SIHHome from "./pages/sih/SIHHome.jsx";
import Participants from "./pages/sih/Participants.jsx";
import Teams from "./pages/sih/Teams.jsx";
import CreateTeam from "./pages/sih/CreateTeam.jsx";
import TeamDetails from "./pages/sih/TeamDetails.jsx";
import Signup from "./pages/sih/Signup.jsx";
import Login from "./pages/sih/Login.jsx";
import ProtectedSihRoute from "./components/ProtectedSihRoute.jsx";
import MyInvitations from "./pages/sih/MyInvitations.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      // ==========================================
      // MAIN WEBSITE
      // ==========================================

      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/events",
        element: <Events />,
      },

      {
        path: "/members",
        element: <Members />,
      },

      {
        path: "/contact",
        element: <Contact />,
      },

      {
        path: "/events/:slug",
        element: <EventDetails />,
      },

      {
        path: "/results/websprint-2025",
        element: <WebsprintResults />,
      },

      // ==========================================
      // SIH
      // ==========================================

      {
        path: "/sih",
        element: <SIHHome />,
      },

      {
        path: "/sih/participants",
        element: <Participants />,
      },

      {
        path: "/sih/teams",
        element: <Teams />,
      },

      {
  path: "/sih/teams/create",
  element: (
    <ProtectedSihRoute>
      <CreateTeam />
    </ProtectedSihRoute>
  ),
},

      {
        path: "/sih/teams/:teamId",
        element: <TeamDetails />,
      },

      // ==========================================
      // SIH AUTHENTICATION
      // ==========================================

      {
        path: "/sih/signup",
        element: <Signup />,
      },

      {
        path: "/sih/login",
        element: <Login />,
      },

      // ==========================================
      // OLD SIH REGISTER REDIRECT
      // ==========================================

      {
        path: "/sih/register",
        element: (
          <Navigate
            to="/sih/signup"
            replace
          />
        ),
      },
      {
  path:"/sih/invitations",
  element:<MyInvitations/>
}


      // ==========================================
      // OTHER PAGES
      // ==========================================

      // {
      //   path: "/resources",
      //   element: <Resources />,
      // },

      // {
      //   path: "/dsa",
      //   element: <DSA />,
      // },

      // {
      //   path: "/development",
      //   element: <Development />,
      // },

      // {
      //   path: "/academics",
      //   element: <Academics />,
      // },
    ],
  },
]);

createRoot(
  document.getElementById("root")
).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);