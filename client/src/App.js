import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home/Home";
import Authenticate from "./pages/Authenticate/Authenticate";
import ActivatePage from "./pages/Activate/Activate";
import RoomsPage from "./pages/Rooms/Rooms";
import Room from "./pages/SingleRoom/SingleRoom";
import { GuestRoutes, ProtectedRoutes, SemiProtectedRoutes } from "./routes";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <GuestRoutes>
        <Home />
      </GuestRoutes>
    ),
  },
  {
    path: "/authenticate",
    element: (
      <GuestRoutes>
        <Authenticate />
      </GuestRoutes>
    ),
  },
  {
    path: "/activate",
    element: (
      <SemiProtectedRoutes>
        <ActivatePage />
      </SemiProtectedRoutes>
    ),
  },
  {
    path: "/rooms",
    element: (
      <ProtectedRoutes>
        <RoomsPage />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/room/:id",
    element: (
      <ProtectedRoutes>
        <Room />
      </ProtectedRoutes>
    ),
  },
]);

function App() {
  const {isAuth,user} = useSelector(state=>state.auth)
  useEffect(() => {
   localStorage.setItem("isAuth",JSON.stringify(isAuth))
   localStorage.setItem("user",JSON.stringify(user))
  }, [isAuth,user])
  
  return <RouterProvider router={router} />;
}

export default App;
