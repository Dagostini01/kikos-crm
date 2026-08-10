export type ChatCompletionsClient = {
  completeJson(input: {
    system: string;
    user: string;
    model: string;
  }): Promise<string>;
};
