import { deleteAccessTokenCookie } from "@/app/api/cookieService";
import { useLoading } from "@/contexts/LoadingContext";
import { Home, Logout } from "@mui/icons-material";

type Props = {
  isCollapsed: boolean;
};

export default function Sidebar({ isCollapsed }: Props) {
  const { setLoading } = useLoading();

  async function navigate(path: string) {
    setLoading(true);
    if (path === "home") {
      window.location.href = "/home";
    } else {
      const data = await deleteAccessTokenCookie();
      if (data.success) {
        setLoading(false);
        window.location.href = "/";
      }
    }
  }

  return (
    <div className={`h-full p-4 flex flex-col items-center`}>
      <ul className="w-full">
      <li
        >
          {!isCollapsed && <span className="whitespace-nowrap flex justify-center">Dashboard</span>}
        </li>
        <li
          className={`cursor-pointer py-4 flex items-center gap-4 mt-4 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          onClick={() => navigate("home")}
        >
          <Home />
          {!isCollapsed && <span className="whitespace-nowrap">Home</span>}
        </li>
        <li
          className={`cursor-pointer py-4 flex items-center gap-4 ${
            isCollapsed ? "justify-center" : "justify-start"
          }`}
          onClick={() => navigate("login")}
        >
          <Logout />
          {!isCollapsed && <span className="whitespace-nowrap">Sair</span>}
        </li>
      </ul>
    </div>
  );
}
