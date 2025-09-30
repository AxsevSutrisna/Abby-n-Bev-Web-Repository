import {
  createElement,
  useEffect,
  useState
} from "react";
import type { ReactNode, FC } from "react";
import Layout from "antd/es/layout";
import Menu from "antd/es/menu";
import type { MenuProps } from "antd/es/menu";
import Dropdown from "antd/es/dropdown";
import Modal from "antd/es/modal";
import Button from "antd/es/button";
import Avatar from "antd/es/avatar";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  LockOutlined,
} from "@ant-design/icons";
import "./MainLayout.css";
import helper from "../utils/helper";
import history from "../utils/history";
import http from "../api/http";
import FormChangePassword from "../components/Forms/Auth/FormChangePassword";
import FormProfile from "../components/Forms/Auth/FormProfile";
import MenuAdmin from "./Menu/Admin";

// ==== Types ====
interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  height?: string | number;
  overflow?: "auto" | "hidden" | "scroll" | "visible";
}

// ==== Hook untuk cek mobile ====
const getIsMobile = () => window.innerWidth <= 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(getIsMobile());

  useEffect(() => {
    const onResize = () => setIsMobile(getIsMobile());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return isMobile;
}

// ==== MainLayout ====
const MainLayout: FC<MainLayoutProps> = (props) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [visibleProfile, setVisibleProfile] = useState(false);

  const { Header, Sider, Content } = Layout;
  const { children, title, height, overflow } = props;

  // collapse otomatis ketika mobile
  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    if (e.key === "/logout") {
      localStorage.removeItem("session");
      window.location.reload();
    } else {
      history.push(e.key);
    }
  };

  return (
    <Layout>
      <Sider
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth={isMobile ? 0 : 80}
        breakpoint="lg"
        style={{ overflowY: "auto", height: window.innerHeight }}
      >
        <div className="logo" style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
          <img src={collapsed ? "favicon.png" : "/logo.png"} alt="Logo" />
          {!collapsed && (
            <div style={{ fontWeight: "bold", textAlign: "left" }}>
              POV <br />
              <span style={{ fontSize: 10, fontWeight: "normal", color: "#8c8c8c" }}>E-Commerce</span>
            </div>
          )}
        </div>
        <Menu
          theme="light"
          mode="inline"
          defaultOpenKeys={[
            window.location.pathname.indexOf("-product") > -1 ||
            window.location.pathname.indexOf("product-") > -1
              ? "#product"
              : "",
          ]}
          defaultSelectedKeys={[window.location.pathname]}
          onClick={handleMenuClick}
          items={MenuAdmin(helper.isAuthenticated()?.data?.role)}
        />
      </Sider>
      <Layout
        className="site-layout"
        style={{
          height: height ?? "100%",
          overflowY: overflow ?? "auto",
        }}
      >
        <Header
          className="site-layout-background flex align-center shadow"
          style={{
            padding: 0,
            marginBottom: 20,
            position: "sticky",
            top: 0,
            zIndex: 2,
          }}
        >
          {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
            className: "trigger",
            onClick: () => setCollapsed(!collapsed),
          })}
          <span
            style={{
              marginLeft: !isMobile ? 0 : "unset",
              fontSize: !isMobile ? 17 : 15,
              marginRight: 5,
            }}
          >
            {helper.truncString(title ?? "", 30, "...")}
          </span>
          {(collapsed && isMobile) || !isMobile ? (
            <div className="flex align-center" style={{ marginLeft: "auto", marginRight: 20 }}>
              <div className="flex flex-column" style={{ marginRight: 10, gap: 5 }}>
                <span
                  style={{
                    fontSize: 12,
                    color: "#6e6b7b",
                    fontWeight: "bold",
                    textAlign: "right",
                  }}
                >
                  {helper.isAuthenticated()?.data?.name || "John Doe"}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    textAlign: "right",
                    color: "var(--ant-primary-color)",
                    display: "initial",
                    fontWeight: "bold",
                  }}
                >
                  {helper.isAuthenticated()?.data?.role_name || "ADMINISTRATOR"}
                </span>
              </div>
              <Dropdown
                overlay={
                  <Menu
                    onClick={(e) => {
                      if (e.key === "/logout") {
                        Modal.confirm({
                          title: "Logout",
                          icon: <ExclamationCircleOutlined />,
                          content: "Are you sure want logout?",
                          okText: "Yes",
                          cancelText: "No",
                          okButtonProps: {
                            type: "primary",
                            style: {
                              background: "var(--ant-primary-color)",
                              color: "#fff",
                              border: "1px solid var(--ant-primary-color)",
                            },
                          },
                          cancelButtonProps: {
                            type: "default",
                            style: {
                              color: "var(--ant-primary-color)",
                              border: "1px solid var(--ant-primary-color)",
                            },
                          },
                          onOk: () => {
                            http.post("/v1/auth/logout").then((res) => {
                              if (res) {
                                localStorage.removeItem("session");
                                window.location.reload();
                              }
                            });
                          },
                        });
                      } else if (e.key === "/change-password") {
                        setVisiblePassword(true);
                      } else {
                        window.location.href = e.key;
                      }
                    }}
                    items={[
                      {
                        key: "/change-password",
                        icon: <LockOutlined />,
                        label: "Change Password",
                        style: { fontSize: 12 },
                      },
                      {
                        key: "/logout",
                        icon: <LogoutOutlined />,
                        label: "Logout",
                        style: { fontSize: 12, borderTop: "1px solid #f0f0f0" },
                      },
                    ]}
                  />
                }
                trigger={["click"]}
              >
                <a
                  href="/#"
                  className="ant-dropdown-link flex align-center"
                  onClick={(e) => e.preventDefault()}
                >
                  <Avatar icon={<UserOutlined />} />
                </a>
              </Dropdown>
            </div>
          ) : null}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            minHeight: 280,
            background: "unset",
            position: "relative",
          }}
        >
          {children}
          <div style={{ paddingBottom: 50 }} />
          <div
            style={{
              textAlign: "center",
              color: "#212121",
              bottom: 10,
              right: 20,
              fontSize: 12,
              paddingBottom: 20,
            }}
          >
            Copyright &copy;{new Date().getFullYear()} POV E-Commerce | All
            Right Reserved
          </div>
        </Content>

        {/* Modal Password */}
        <Modal
          centered
          open={visiblePassword}
          title="Edit Password"
          onCancel={async () => setVisiblePassword(false)}
          footer={[
            <Button key="back" onClick={async () => setVisiblePassword(false)}>
              Cancel
            </Button>,
          ]}
        >
          <FormChangePassword
            handleClose={async () => setVisiblePassword(false)}
            email={helper.isAuthenticated()?.data?.email}
            authenticated={true}
          />
        </Modal>

        {/* Modal Profile */}
        <Modal
          centered
          open={visibleProfile}
          title="Edit Profile"
          onCancel={async () => setVisibleProfile(false)}
          footer={[
            <Button key="back" onClick={async () => setVisibleProfile(false)}>
              Cancel
            </Button>,
          ]}
        >
          <FormProfile handleClose={async () => setVisibleProfile(false)} />
        </Modal>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
