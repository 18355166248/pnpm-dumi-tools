import { show } from "./show";
import { attachPropertiesToComponent } from "../../utils/attach-properties-to-component";
import Popup from "./popup";

export type { PopupProps } from "./popup";
export type { PopupShowProps, PopupShowHandler } from "./show";

export default attachPropertiesToComponent(Popup, {
  show,
});
