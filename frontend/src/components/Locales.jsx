import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';

// ==============================|| LOCALIZATION ||============================== //

const Locales = ({ children }) => {
  // Simple English only for now - will be expanded with i18n later
  const locale = 'en';
  const messages = {};

  return (
    <IntlProvider locale={locale} defaultLocale="en" messages={messages}>
      {children}
    </IntlProvider>
  );
};

Locales.propTypes = {
  children: PropTypes.node
};

export default Locales;
