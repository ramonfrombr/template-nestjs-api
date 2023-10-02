import { Logger } from '@nestjs/common';

export abstract class BaseService<I, O> {
  protected readonly logger = new Logger(this.name);

  constructor(private readonly name: string) {}

  async execute(input: I): Promise<O> {
    const output = await this.perform(input);
    this.logger.debug(
      `func=execute input=${JSON.stringify(input)} output=${JSON.stringify(
        output,
      )}`,
    );
    return output;
  }

  protected abstract perform(input: I): Promise<O>;
}
