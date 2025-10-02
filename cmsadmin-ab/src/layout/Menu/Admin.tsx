import {
  PieChartOutlined,
  TagOutlined,
  TagsOutlined,
  VideoCameraAddOutlined,
  VideoCameraOutlined,
  GiftOutlined,
  RadiusSettingOutlined,
  ProductOutlined,
  NumberOutlined,
  // BlockOutlined,
  PicLeftOutlined,
  PicCenterOutlined,
  FileUnknownOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  UndoOutlined,
  SafetyOutlined,
  UsergroupAddOutlined,
  UserAddOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import helper from "../../utils/helper";
import type { RoleEnumType } from "../../utils/helper";

const MenuAdmin = (level: RoleEnumType): MenuProps["items"] => {
  return (
    [
      {
        key: "/dashboard",
        icon: <PieChartOutlined />,
        label: "Dashboard",
      },
      helper.hasAnyPermission(level, [helper.RoleEnum.ADMINISTRATOR]) && {
        key: "/admin",
        icon: <UsergroupAddOutlined />,
        label: "Admin",
      },
      helper.hasAnyPermission(level, [helper.RoleEnum.ADMINISTRATOR]) && {
        key: "/customers",
        icon: <UserAddOutlined />,
        label: "Customer",
      },
      helper.hasAnyPermission(level, [
      helper.RoleEnum.GUDANG,
      helper.RoleEnum.MEDIA,
    ]) && {
      key: "#product",
      label: "Product",
      icon: <ProductOutlined />,
      children: [
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/master-product",
          icon: <ProductOutlined />,
          label: "Product",
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/inventory-product",
          icon: <TagsOutlined />,
          label: "Inventory",
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/category-types",
          icon: <TagOutlined />,
          label: "Category Types",
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/brand-product",
          icon: <TagOutlined />,
          label: "Brand",
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/persona-product",
          icon: <TagOutlined />,
          label: "Persona",
        },
        helper.hasAnyPermission(level, [
          helper.RoleEnum.GUDANG,
          helper.RoleEnum.MEDIA,
        ]) && {
          key: "/tag-product",
          label: "Tag",
          icon: <NumberOutlined />,
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/size-product",
          icon: <RadiusSettingOutlined />,
          label: "Size Chart",
        },
        helper.hasAnyPermission(level, [helper.RoleEnum.GUDANG]) && {
          key: "/war-products",
          icon: <ThunderboltOutlined />,
          label: "War Product",
        },
      ],
    },
    ].filter(Boolean) as MenuProps["items"]
  );
};

export default MenuAdmin;