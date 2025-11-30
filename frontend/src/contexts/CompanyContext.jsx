import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';

// action types
const SET_COMPANY = 'SET_COMPANY';
const CLEAR_COMPANY = 'CLEAR_COMPANY';
const INITIALIZE = 'INITIALIZE';

// initial state
const initialState = {
  selectedCompanyId: null,
  selectedCompanyName: null,
  isInitialized: false
};

// ==============================|| COMPANY REDUCER ||============================== //

const companyReducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      return {
        ...state,
        selectedCompanyId: action.payload.companyId,
        selectedCompanyName: action.payload.companyName,
        isInitialized: true
      };
    case SET_COMPANY:
      return {
        ...state,
        selectedCompanyId: action.payload.companyId,
        selectedCompanyName: action.payload.companyName
      };
    case CLEAR_COMPANY:
      return {
        ...state,
        selectedCompanyId: null,
        selectedCompanyName: null
      };
    default:
      return state;
  }
};

// ==============================|| COMPANY CONTEXT ||============================== //

const CompanyContext = createContext(null);

export const CompanyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(companyReducer, initialState);

  useEffect(() => {
    // Initialize from localStorage
    const storedCompanyId = localStorage.getItem('selectedCompanyId');
    const storedCompanyName = localStorage.getItem('selectedCompanyName');

    dispatch({
      type: INITIALIZE,
      payload: {
        companyId: storedCompanyId ? parseInt(storedCompanyId, 10) : null,
        companyName: storedCompanyName
      }
    });
  }, []);

  const setCompany = (companyId, companyName) => {
    if (companyId) {
      localStorage.setItem('selectedCompanyId', companyId.toString());
      localStorage.setItem('selectedCompanyName', companyName || '');
    } else {
      localStorage.removeItem('selectedCompanyId');
      localStorage.removeItem('selectedCompanyName');
    }

    dispatch({
      type: SET_COMPANY,
      payload: { companyId, companyName }
    });

    // Trigger global refresh event
    window.dispatchEvent(new CustomEvent('companyChanged', { detail: { companyId, companyName } }));
  };

  const clearCompany = () => {
    localStorage.removeItem('selectedCompanyId');
    localStorage.removeItem('selectedCompanyName');

    dispatch({ type: CLEAR_COMPANY });

    // Trigger global refresh event
    window.dispatchEvent(new CustomEvent('companyChanged', { detail: { companyId: null, companyName: null } }));
  };

  return (
    <CompanyContext.Provider
      value={{
        ...state,
        setCompany,
        clearCompany
      }}
    >
      {children}
    </CompanyContext.Provider>
  );
};

CompanyProvider.propTypes = {
  children: PropTypes.node
};

export default CompanyContext;
