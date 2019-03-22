import { GitConfig } from 'dotup-ts-github-api';
import { Nested, TypeSaveProperty } from 'dotup-ts-types';
import { BaseGenerator, GeneratorOptions } from 'dotup-typescript-yeoman-generators';

type PartialQuestions = Partial<TypeSaveProperty<Nested<string, string>>>;

export class GitGenerator extends BaseGenerator<string> {

  constructor(args: string | string[], options: GeneratorOptions<string>) {
    super(args, options);
    super.registerMethod(this);
  }

  async initializing(): Promise<void> {

    const gitconfig = GitConfig.getConfig(this.destinationPath());

    if (gitconfig !== undefined) {

      // Existing git config
      this.logRed('Git already configured for current folder! Git generator skipped.');
      // throw new Error('Git already configured for current folder!');
      this.skipGenerator = true;

      return;
    }

  }

  async configuring(): Promise<void> {
    if (this.skipGenerator) { return; }

    // init only when no repo exists
    const gitconfig = GitConfig.getConfig(this.destinationPath());

    if (gitconfig === undefined) {
      const result = this.spawnCommandSync('git', ['init']);
    }
  }

  async install(): Promise<void> {
    if (this.skipGenerator) { return; }

  }

  async end(): Promise<void> {
    if (this.skipGenerator) { return; }

    let result = this.spawnCommandSync('git', ['add', '.']);
    result = this.spawnCommandSync('git',
      [
        'commit',
        '-a',
        '-m INITIAL COMMIT by dotup-typescript yeoman generator'
      ]
    );

  }

}
