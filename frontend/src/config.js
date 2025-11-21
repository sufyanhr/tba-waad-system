// ==============================|| CONFIG ||============================== //

export const SimpleLayoutType = {
  SIMPLE: 'simple',
  LANDING: 'landing'
};

export const MenuOrientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  MINI_VERTICAL: 'mini-vertical'
};

export const AuthProvider = {
  JWT: 'jwt',
  FIREBASE: 'firebase',
  AUTH0: 'auth0',
  AWS: 'aws',
  SUPABASE: 'supabase'
};

export const Gender = {
  MALE: 'Male',
  FEMALE: 'Female',
  OTHER: 'Other'
};

export const APP_AUTH = AuthProvider.JWT; // Default to JWT auth

export const DASHBOARD_PATH = '/dashboard/default';
export const HORIZONTAL_MAX_ITEM = 6;

export default {
  SimpleLayoutType,
  MenuOrientation,
  AuthProvider,
  Gender,
  APP_AUTH,
  DASHBOARD_PATH,
  HORIZONTAL_MAX_ITEM
};
