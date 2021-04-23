import {IMessage} from './IMessage';
import {ILikedMessage} from './ILikedMessage';

/** Predloha pre prijem dat spravy s reakciami
 */
export interface IMessageWithLike {
  message: IMessage;
  setLikes: ILikedMessage[];
}
