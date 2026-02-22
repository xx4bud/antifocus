import { NavLink } from "~/components/ui/nav-link";

export function Copyright() {
  return (
    <span className="flex items-center justify-center text-sm">
      &copy;&nbsp;{new Date().getFullYear()}&nbsp; Antifocus&nbsp;by&nbsp;
      <NavLink
        className="hover:underline"
        href={"https://github.com/xx4bud"}
        target="_blank"
      >
        <span>xx4bud.</span>
      </NavLink>
      &nbsp;All&nbsp;rights&nbsp;reserved.
    </span>
  );
}
