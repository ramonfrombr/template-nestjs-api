import { BaseException } from './exception.model';

export abstract class Objects {
  static requireNonNull(obj?: any, msg?: string) {
    if (!obj) throw new BaseException(msg ?? 'Campo é obrigatório');
  }

  static requireNull(obj?: any, msg?: string) {
    if (!!obj) throw new BaseException(msg ?? 'Campo não é obrigatório');
  }
}

export abstract class Arrays {
  static requireNonEmpty(arr?: Array<any>, msg?: string) {
    if (!arr || !arr.length)
      throw new BaseException(msg ?? 'Items são obrigatório');
  }
}
