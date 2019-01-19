import {
  OPEN_SUBMENU,
  PREVIEW_SUBMENU
} from '../actions/sidepanel';

export default function ({submenu = null, submenu_preview = null, filters = new Map()} = {}, action) {

  switch(action.type) {

    case OPEN_SUBMENU:

      return {
        submenu: action.payload,
        submenu_preview: submenu_preview,
        filters: filters
      };

    case PREVIEW_SUBMENU:

      return {
        submenu: submenu,
        submenu_preview: action.payload,
        filters: filters
      };

    default:
      return {
        submenu,
        submenu_preview,
        filters
      };
  }
}

