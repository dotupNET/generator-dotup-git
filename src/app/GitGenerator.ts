import { GitConfig } from 'dotup-ts-github-api';
import { Nested, TypeSaveProperty } from 'dotup-ts-types';
import { BaseGenerator, ConfirmQuestion, InquirerQuestionType, Question, GeneratorOptions, SharedOptions } from 'dotup-typescript-yeoman-generators';
// import { GithubGenerator, GithubQuestions } from 'generator-dotup-github';
import { GitQuestions } from './GitQuestions';

type PartialQuestions = Partial<TypeSaveProperty<Nested<GitQuestions, string>>>;

// Or export default!!
export class GitGenerator extends BaseGenerator<GitQuestions> {

  constructor(args: string | string[], options: GeneratorOptions<GitQuestions>, sharedOptions?: SharedOptions<GitQuestions>) {
    super(args, options, sharedOptions);
    super.registerMethod(this);

    const opt = <PartialQuestions>this.options;
    if (opt.rootPath === undefined) {
      throw new Error('rootPath option required.');
    }
    this.writeOptionsToAnswers(GitQuestions);

    this.trySubscribeSharedOption(GitQuestions.projectName);
  }

  async initializing(): Promise<void> {

    const gitconfig = GitConfig.getConfig(this.answers.rootPath);

    if (gitconfig !== undefined) {

      // Existing git config
      this.logRed('Git already configured for current folder! Git generator skipped.');
      // throw new Error('Git already configured for current folder!');
      this.skipGenerator = true;

      return;
    }

    const opt = <PartialQuestions>this.options;

    // Repo name
    this.addQuestion(
      new Question(GitQuestions.projectName, {
        type: InquirerQuestionType.input,
        default: opt.projectName,
        message: 'Enter repository name',
        description: 'Name of the repository',
        When: () => !this.skipGenerator && opt.projectName === undefined
      })
    );

    // Use github?
    this.addQuestion(
      new ConfirmQuestion(GitQuestions.useGithub, 'Configure github?')
    );

  }

  async prompting(): Promise<void> {
    if (this.skipGenerator === false) {
      await super.prompting();
    }

    if (this.answers.useGithub) {
      // Load git generator
      this.compose('generator-dotup-github/generators/app');
    }
  }

  async configuring(): Promise<void> {
    if (this.skipGenerator) { return; }

    // init only when no repo exists
    const gitconfig = GitConfig.getConfig(this.answers.rootPath);

    if (gitconfig === undefined) {
      const result = this.spawnCommandSync('git', ['init']);
    }
  }

  // tslint:disable-next-line: no-reserved-keywords
  // async default(): Promise<void> { }

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
