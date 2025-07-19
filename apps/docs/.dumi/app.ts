import { validateLogin } from './utils/login';

export function render(oldRender: any) {
  validateLogin(oldRender);
}
