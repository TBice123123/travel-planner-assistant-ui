export interface ToolCall {
  id: string;
  name: string;
  args: any;
  result?: string;
  status: "pending" | "completed" | "error";
}

export interface SubAgent {
  id: string;
  name: string;
  subAgentName: string;
  input: any;
  output?: any;
  status: "pending" | "active" | "completed" | "error";
}

export interface FileItem {
  path: string;
  content: string;
}

export interface TodoItem {
  id: string;
  content: string;
  status: "pending" | "in_progress" | "done";
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Thread {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
}
