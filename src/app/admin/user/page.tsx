import { UserTable } from "./user-table";
import { getAllUsers } from "@/actions/user";

export default async function User() {
  const users = await getAllUsers();

  return <UserTable users={users} />;
}
