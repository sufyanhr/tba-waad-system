import { createContext, useMemo } from 'react';
import PropTypes from 'prop-types';

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const initialState = {
  fontFamily: `'Public Sans', sans-serif`,
  borderRadius: 8,
  mode: 'light',
  presetColor: 'default',
  navType: 'light',
  outlinedFilled: true,
  miniDrawer: false,
  container: false,
  themeDirection: 'ltr',
  menuOrientation: 'vertical',
  onChangeMenuOrientation: () => {},
  onChangeMode: () => {},
  onChangePresetColor: () => {},
  onChangeMiniDrawer: () => {},
  onChangeContainer: () => {},
  onChangeFontFamily: () => {},
  onChangeBorderRadius: () => {},
  onChangeOutlinedField: () => {}
};

export const ConfigContext = createContext(initialState);

export function ConfigProvider({ children }) {
  const config = useMemo(
    () => ({
      ...initialState
    }),
    []
  );

  return <ConfigContext.Provider value={config}>{children}</ConfigContext.Provider>;
}

ConfigProvider.propTypes = {
  children: PropTypes.node
};

export default ConfigProvider;
