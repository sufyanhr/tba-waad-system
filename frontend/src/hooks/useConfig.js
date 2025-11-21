import { useContext } from 'react';
import { ConfigContext } from 'contexts/ConfigContext';

// ==============================|| CONFIG - HOOKS ||============================== //

const useConfig = () => {
  const context = useContext(ConfigContext);

  if (!context) throw new Error('useConfig must be used within ConfigProvider');

  return {
    ...context,
    state: {
      fontFamily: context.fontFamily,
      borderRadius: context.borderRadius,
      mode: context.mode,
      presetColor: context.presetColor,
      navType: context.navType,
      outlinedFilled: context.outlinedFilled,
      miniDrawer: context.miniDrawer,
      container: context.container,
      themeDirection: context.themeDirection,
      menuOrientation: context.menuOrientation
    }
  };
};

export default useConfig;
