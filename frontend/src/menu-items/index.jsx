// project imports
import { projectSettings } from 'config';
import tbaManagement from './tba-management';
import tools from './tools';
import administration from './administration';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [
    ...(projectSettings.showTBAManagement ? [tbaManagement] : []),
    ...(projectSettings.showTools ? [tools] : []),
    ...(projectSettings.showAdministration ? [administration] : [])
  ]
};

export default menuItems;
