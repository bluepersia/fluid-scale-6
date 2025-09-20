import { Master } from "../eau-de-parfum/master/master";

type AssertionResponse<TArgs, TResult> = {
  args?: TArgs;
  master?: Master;
  testArg?: any;
  result?: TResult;
  name: string;
};

type DefaultAssertions<TArgs, TResult> = {
  [key: string]: (res: AssertionResponse<TArgs, TResult>) => void;
};

export type { DefaultAssertions };
