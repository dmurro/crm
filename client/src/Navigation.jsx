import { Link } from "react-router-dom";
import { Menu } from "antd";

function Navigation() {
  return (
    <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
      <Menu.Item key="1">
        <Link to="/">Home</Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link to="/clients">Clients</Link>
      </Menu.Item>
    </Menu>
  );
}

export default Navigation;
