import { getUsers } from "@/actions/users";
import { wrapPromise } from "@/lib/fetchResource";

export function fetchUsersResource() {
  return wrapPromise(getUsers());
}
