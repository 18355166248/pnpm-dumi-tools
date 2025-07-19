import { show } from "./show";
import { clear } from "./clear";
import { confirm } from "./confirm";
import { alert } from "./alert";
import { attachPropertiesToComponent } from "../../utils/attach-properties-to-component";
import Modal from "./modal";

export type { ModalProps } from "./modal";
export type { ModalShowProps, ModalShowHandler } from "./show";
export type { ModalConfirmProps } from "./confirm";
export type { ModalAlertProps } from "./alert";

export default attachPropertiesToComponent(Modal, {
  show,
  clear,
  confirm,
  alert,
});
