import { Master } from "../../index.types";

type AssertionResponse<TArgs, TResult, TState> = {
  args?: TArgs;
  master?: Master;
  testArg?: any;
  result?: TResult;
  name: string;
  state?: TState;
};

type DefaultAssertions<TArgs, TResult, TState> = {
  [key: string]: (res: AssertionResponse<TArgs, TResult, TState>) => void;
};

export type { DefaultAssertions };
