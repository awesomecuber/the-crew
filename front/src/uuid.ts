import { v4 as uuidv4 } from "uuid";

let uuid = sessionStorage.getItem("uuid");
if (uuid == null) {
  uuid = uuidv4();
  sessionStorage.setItem("uuid", uuid);
}

export default uuid as string;
