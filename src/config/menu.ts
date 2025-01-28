import {
  BoxesIcon,
  LibraryBigIcon,
  PackageIcon,
  RocketIcon,
} from "lucide-react";

export type MenuConfig = typeof menuConfig;

export const menuConfig = {
  navAdmin: [
    {
      title: "Campaigns",
      url: "#",
      icon: RocketIcon,
      isActive: false,
      items: [
        {
          title: "List of campaigns",
          url: "/admin/campaigns",
        },
        {
          title: "Add new campaign",
          url: "/admin/campaigns/new",
        },
      ],
    },
    {
      title: "Collections",
      url: "#",
      icon: LibraryBigIcon,
      isActive: false,
      items: [
        {
          title: "List of collections",
          url: "/admin/collections",
        },
        {
          title: "Add new collection",
          url: "/admin/collections/new",
        },
      ],
    },
    {
      title: "Categories",
      url: "#",
      icon: BoxesIcon,
      isActive: false,
      items: [
        {
          title: "List of categories",
          url: "/admin/categories",
        },
        {
          title: "Add new categories",
          url: "/admin/categories/new",
        },
      ],
    },
    {
      title: "Products",
      url: "#",
      icon: PackageIcon,
      isActive: false,
      items: [
        {
          title: "List of products",
          url: "/admin/products",
        },
        {
          title: "Add new product",
          url: "/admin/products/new",
        },
      ],
    },
  ],
};
