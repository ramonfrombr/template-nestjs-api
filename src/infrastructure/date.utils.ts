export default abstract class DateUtils {
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
