import { Link, useLocation } from "react-router-dom";
import { Menu } from "antd";

function Navigation() {
  const location = useLocation();

  const loginRoute = location.pathname === "/" || location.pathname === "/login";

  if (loginRoute) return null;
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1">
        <Link to="/clients">Clients</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navigation;
