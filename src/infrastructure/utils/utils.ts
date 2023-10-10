import { BaseException } from '../model/exception.model';

export abstract class ObjectUtils {
  static isNull(authorizationKey: any): boolean {
    return !authorizationKey;
  }
  static requireNonNull(obj?: any, msg?: string) {
    if (!obj) throw new BaseException(msg ?? 'Campo é obrigatório');
  }

  static requireNull(obj?: any, msg?: string) {
    if (!!obj) throw new BaseException(msg ?? 'Campo não é obrigatório');
  }
}

export abstract class ArrayUtils {
  static requireNonEmpty(arr?: Array<any>, msg?: string) {
    if (!arr || !arr.length)
      throw new BaseException(msg ?? 'Items são obrigatório');
  }
}

export abstract class StringUtils {
  static toBase64(value: string): string {
    return btoa(value);
  }
}

export abstract class DateUtils {
  static now() {
    return DateUtils.toDate(new Date());
  }

  static parse(date: Date) {
    return DateUtils.toDate(date);
  }

  private static parseFromString(dateString: string) {
    return DateUtils.toDate(new Date(dateString));
  }

  private static toDate(date: Date) {
    return new Date(
      Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
        date.getHours(),
        date.getMinutes(),
        date.getSeconds(),
        date.getMilliseconds(),
      ),
    );
  }
}

export abstract class LoggerUtils {
  static stringify(value?: any) {
    return JSON.stringify(value ?? {});
  }
}
