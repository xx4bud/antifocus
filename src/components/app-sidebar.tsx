"use client"

import * as React from "react"
import { BadgePercent, SquareTerminal } from "lucide-react"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar"
import { User } from "next-auth"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FaRegUser } from "react-icons/fa6"
import { NavAdmin } from "@/components/nav-admin"

interface AppSidebarProps
  extends React.ComponentProps<typeof Sidebar> {
  user?: User
}

export function AppSidebar({
  user,
  ...props
}: AppSidebarProps) {
  const { setOpen, setOpenMobile } = useSidebar()

  const onClick = () => {
    setOpen(false)
    setOpenMobile(false)
  }

  const data = {
    navAdmin: [
      {
        title: "Campaigns",
        url: "#",
        icon: BadgePercent,
        isActive: true,
        items: [
          {
            title: "List Campaigns",
            url: "/admin/campaigns",
          },
          {
            title: "Add Campaign",
            url: "/admin/campaigns/add",
          },
        ],
      },
      {
        title: "Products",
        url: "#",
        icon: SquareTerminal,
        isActive: true,
        items: [
          {
            title: "List Products",
            url: "/admin/products",
          },
          {
            title: "Add Product",
            url: "/admin/products/add",
          },
        ],
      },
    ],
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        {!user ? (
          <Button asChild onClick={onClick}>
            <Link href="/signin">
              <FaRegUser />
              SignIn
            </Link>
          </Button>
        ) : (
          <NavUser user={user} />
        )}
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        {user?.role === "ADMIN" && (
          <NavAdmin items={data.navAdmin} />
        )}
      </SidebarContent>
      <SidebarFooter>
        {/* <NavUser user={data.user} /> */}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
