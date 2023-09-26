import { Logger } from '@nestjs/common';

export abstract class BaseService<I, O> {
  protected readonly logger = new Logger(this.name);

  constructor(private readonly name: string) {}

  async execute(input: I, output?: O): Promise<void> {
    this.logger.debug(`func=execute input=${JSON.stringify(input)}`);
    await this.perform(input, output);
    this.logger.debug(`func=execute output=${JSON.stringify(output ?? {})}`);
  }

  protected abstract perform(input: I, output?: O): Promise<void>;
}
