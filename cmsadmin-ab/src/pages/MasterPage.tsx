import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import TableAdmin from "../components/Tables/Admin/TableAdmin";
import MainLayout from "../layout/MainLayout";

type RouteItem = {
  key: string;
  component: React.ReactNode;
  title: string;
};

const ComponentSetting = (): RouteItem[] => [
  { key: "/admin", component: <TableAdmin />, title: "Admin" },
];

export default function MasterPage(): React.ReactElement | null {
  const { pathname } = useLocation();
  const matched = ComponentSetting().find((v) => v.key === pathname);

  if (!matched) {
    // fallback aman kalau path tidak terdaftar
    return <Navigate to="/dashboard" replace />;
  }

  // key={pathname} supaya state di dalam layout reset saat pindah halaman
  return (
    <MainLayout title={matched.title} key={pathname}>
      {matched.component}
    </MainLayout>
  );
}
