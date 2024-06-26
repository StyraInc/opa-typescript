import { Denied } from "../src/authz";

declare module "react" {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    authz?: Denied;
  }
}
