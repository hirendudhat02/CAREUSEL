import * as Type from '../Services/Type';

export const ReceivedFilterAction = data => ({
  type: Type.RECEIVEDFILTER,
  data,
});
