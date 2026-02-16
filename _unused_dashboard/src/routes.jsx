import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables, Notifications } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import AddBook from "./pages/dashboard/addbook";
import ViewBook from "./pages/dashboard/viewbook";
import EditBook from "./pages/dashboard/editbook";
import ViewUsers from "./pages/dashboard/viewusers";
import UserSignIn from "./pages/auth/user-sign-in";
import UserSignUp from "./pages/auth/user-sign-up";
import UserRecommendations from "./pages/dashboard/UserRecommendations";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <PlusCircleIcon {...icon} />,
        name: "add book",
        path: "/addbook",
        element: <AddBook />,
      },
      {
        icon: <BookOpenIcon {...icon} />,
        name: "view book",
        path: "/viewbook",
        element: <ViewBook />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "view users",
        path: "/users",
        element: <ViewUsers />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "user recommendations",
        path: "/userrecommendations",
        element: <UserRecommendations />,
      },
      /*{
        icon: <InformationCircleIcon {...icon} />,
        name: "notifications",
        path: "/notifications",
        element: <Notifications />,
      },*/
    ],
  },
  {
    //title: "auth pages",
    title: "",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
        sidebar: false,   
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
        sidebar: false,  
      },
      {
        icon: <ServerStackIcon {...icon} />,
        name: "user sign in",
        path: "/user-sign-in",
        element: <UserSignIn />,
        sidebar: false,   
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "user sign up",
        path: "/user-sign-up",
        element: <UserSignUp />,
        sidebar: false,  
      },
    ],
  },
];

export default routes;
