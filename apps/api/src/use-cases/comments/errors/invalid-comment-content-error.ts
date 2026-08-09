export class InvalidCommentContentError extends Error {
  constructor() {
    super('Comment content must not be empty.');
    this.name = 'InvalidCommentContentError';
  }
}
