import { Message } from "./messages";

type BaseRenderProps<T, K> = {
  args: T;
  results?: K;
  message: Message;
}

export type RenderProps<T, K> = BaseRenderProps<T, K> & (
  | {
      status: ToolStatus.Calling;
    }
  | {
      status: ToolStatus.Executing;
      respond: (results: K) => Promise<void>;
    }
  | {
      status: ToolStatus.Completed;
    }
)

export enum ToolStatus {
  Calling = 'Calling',
  Executing = 'Executing',
  Completed = 'Completed'
}

export enum ToolResponseMode {
  Client = 'Client',
  Remote = 'Remote'
};

export type UseAgentActionProps<T, K> = {
  name: string;
  responseMode?: ToolResponseMode;
  render: (props: RenderProps<T, K>) => React.ReactNode;
}