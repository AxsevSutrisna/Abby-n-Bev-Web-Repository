import React from "react";
import { useLocation, Navigate } from "react-router-dom";
import TableAdmin from "../components/Tables/Admin/TableAdmin";
import MainLayout from "../layout/MainLayout";
import TableCustomer from "../components/Tables/Customer/TableCustomer";
import TableTag from "../components/Tables/Tag/TableTag";
import TablePersona from "../components/Tables/Persona/TablePersona";
import TableBanner from "../components/Tables/Banner/TableBanner"
import TableActivityLog from "../components/Tables/ActivityLog/TableActivityLog";
import TableFaq from "../components/Tables/Faq/TableFaq";
import TableVoucher from "../components/Tables/Voucher/TableVoucher"
import FormPrivacyPolicy from "../components/Forms/PrivacyPolicy/FormPrivacyPolicy";
import FormTermNConditions from "../components/Forms/TermAndConditions/FormTermAndConditions"
import FormReturnPolicy from "../components/Forms/ReturnPolicy/ReturnPolicy";

type RouteItem = {
  key: string;
  component: React.ReactNode;
  title: string;
};

const ComponentSetting = (): RouteItem[] => [
  { key: "/admin", component: <TableAdmin />, title: "Admin" },
  { key: "/customers", component: <TableCustomer />, title: "Customer" },
  { key: "/tag-product", component: <TableTag />, title: "Tag"},
  { key: "/persona-product", component: <TablePersona />, title: "Persona"},
  { key: "/banners", component: <TableBanner />, title: "Banner"},
  { key: "/activity-logs", component: <TableActivityLog />, title: "Activity Log"},
  { key: "/faqs", component: <TableFaq />, title: "FAQ"},
  { key: "/voucher", component: <TableVoucher />, title: "Voucher"},
  { key: "/privacy-policy", component: <FormPrivacyPolicy />, title: "Privacy Policy"},
  { key: "/tnc", component: <FormTermNConditions />, title: "Term and Conditions"},
  { key: "/return-policy", component: <FormReturnPolicy />, title: "Return Policy"},
];

export default function MasterPage(): React.ReactElement | null {
  const { pathname } = useLocation();
  const matched = ComponentSetting().find((v) => v.key === pathname);

  if (!matched) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <MainLayout title={matched.title} key={pathname}>
      {matched.component}
    </MainLayout>
  );
}
