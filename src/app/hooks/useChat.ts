import { useCallback, useMemo } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { type Message } from "@langchain/langgraph-sdk";
import { getDeployment } from "@/lib/environment/deployments";
import { v4 as uuidv4 } from "uuid";
import type { TodoItem } from "../types/types";
import { createClient } from "@/lib/client";
import { useAuthContext } from "@/providers/Auth";

type StateType = {
  messages: Message[];
  plan: TodoItem[];
  note: Record<string, string>;
};

export function useChat(
  threadId: string | null,
  setThreadId: (
    value: string | ((old: string | null) => string | null) | null
  ) => void,
  onTodosUpdate: (todos: TodoItem[]) => void,
  onNoteUpdate: (note: Record<string, string>) => void
) {
  const deployment = useMemo(() => getDeployment(), []);
  const { session } = useAuthContext();
  const accessToken = session?.accessToken;

  const agentId = useMemo(() => {
    if (!deployment?.agentId) {
      throw new Error(`No agent ID configured in environment`);
    }
    return deployment.agentId;
  }, [deployment]);

  const handleUpdateEvent = useCallback(
    (data: { [node: string]: Partial<StateType> }) => {
      // 处理 tools 节点的数据
      if (data.tools) {
        console.log("tools 节点数据:", data.tools);

        // 处理 todo 数据
        if (data.tools?.plan && Array.isArray(data.tools.plan)) {
          console.log(`发现 plan 数据，数量: ${data.tools.plan.length}`);
          onTodosUpdate(data.tools.plan);
        }
      }
      if (data.subagent) {
        if (data.subagent.note && typeof data.subagent.note === "object") {
          console.log(
            `发现 note 数据，键数量: ${Object.keys(data.subagent.note).length}`
          );
          onNoteUpdate(data.subagent.note);
        }
      }
    },
    [onTodosUpdate, onNoteUpdate]
  );

  const stream = useStream<StateType>({
    assistantId: agentId,
    client: createClient(accessToken || ""),
    reconnectOnMount: true,
    threadId: threadId ?? null,
    onUpdateEvent: handleUpdateEvent,
    onThreadId: setThreadId,
    defaultHeaders: {
      "x-auth-scheme": "langsmith",
    },
  });

  const sendMessage = useCallback(
    (message: string) => {
      const humanMessage: Message = {
        id: uuidv4(),
        type: "human",
        content: message,
      };
      stream.submit(
        { messages: [humanMessage] },
        {
          optimisticValues(prev) {
            const prevMessages = prev.messages ?? [];
            const newMessages = [...prevMessages, humanMessage];
            return { ...prev, messages: newMessages };
          },
          config: {
            recursion_limit: 100,
          },
          streamSubgraphs: true,
        }
      );
    },
    [stream]
  );

  const stopStream = useCallback(() => {
    stream.stop();
  }, [stream]);

  return {
    messages: stream.messages,
    isLoading: stream.isLoading,
    sendMessage,
    stopStream,
  };
}
