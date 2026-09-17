import config from './environment';

export const jwtConfig = {
  secret: config.jwtSecret,
  expiry: config.jwtExpiry,
  refreshExpiry: '30d',
};
