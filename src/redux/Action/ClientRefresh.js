import * as Type from '../Services/Type';

export const ClientRefreshAction = loader => ({
  type: Type.CLIENTREFRESH,
  loader,
});
