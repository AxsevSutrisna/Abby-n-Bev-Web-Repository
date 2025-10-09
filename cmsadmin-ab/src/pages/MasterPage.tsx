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
import FormAboutUs from "../components/Forms/AboutUs/FormAboutUs";
import FormContactUs from "../components/Forms/ContactUs/FormContactUs";
import TableSetting from "../components/Tables/Settings/TableSetting";
import TableBrand from "../components/Tables/Brand/TableBrand";
import TableCategoryType from "../components/Tables/CategoryTypes/TableCategoryTypes";
import TableConcern from "../components/Tables/Concern/TableConcern";
import TableConcernOption from "../components/Tables/Concern/TableConcernOption";
import TableProfileCategory from "../components/Tables/ProfileCategory/TableProfileCategory";
import TableProfileCategoryOption from "../components/Tables/ProfileCategory/TableProfileCategoryOption";
import TableFlashSale from "../components/Tables/FlashSale/TableFlashSale";

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
  { key: "/about-us", component: <FormAboutUs />, title: "About Us"},
  { key: "/contact-us", component: <FormContactUs />, title: "Contact Us"},
  { key: "/settings", component: <TableSetting />, title: "Settings"},
  { key: "/brand-product", component: <TableBrand />, title: "Brands"},
  { key: "/category-types", component: <TableCategoryType />, title: "Category Types"},
  { key: "/concern", component: <TableConcern />, title: "Concern"},
  { key: "/concern-option", component: <TableConcernOption />, title: "Concern Option"},
  { key: "/profile-category-filter", component: <TableProfileCategory />, title: "Profile Category"},
  { key: "/profile-category-option", component: <TableProfileCategoryOption />, title: "Profile Category Option"},
  { key: "/flash-sale", component: <TableFlashSale />, title: "Flash Sale"}
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
