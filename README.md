# Deep Agents UI （魔改版）

该项目fork自官方的deepagents-ui项目，魔改了一些功能。

B站视频链接：https://www.bilibili.com/video/BV1dkaAzAE3P/?vd_source=dc888e407bc7cf296286572a7555e7e3

Deep Agents 是通用的 AI 智能体，能够处理各种复杂度的任务。这是一个用于与 LangChain 的 [`deep-agents`] 包配套使用的 UI 界面。

### 连接到本地 LangGraph 服务器

创建一个 `.env.local` 文件并设置两个变量

```env
NEXT_PUBLIC_DEPLOYMENT_URL="http://localhost:2024" # 或您的服务器 URL
NEXT_PUBLIC_AGENT_ID=<您的 langgraph.json 中的代理 ID>
```

```bash
npm install
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 来测试您的 deep agent！

## 魔改记录

### 1. 启用子图流输出

- **文件**: `src/app/hooks/useChat.ts`
- **修改**: 在 `stream.submit` 配置中添加了 `streamSubgraphs: true` 参数
- **作用**: 启用子图内容的流式输出，使 UI 能够接收和处理子图节点的数据

### 2. 修改数据结构定义

- **文件**: `src/app/hooks/useChat.ts`
- **修改**:
  - 将 `StateType` 中的 `files` 改为 `note`
  - 将回调函数参数 `onFilesUpdate` 改为 `onNoteUpdate`
- **作用**: 适配后端返回的数据结构，使用 `note` 字段存储文件内容

### 3. 优化 SSE 数据处理逻辑

- **文件**: `src/app/hooks/useChat.ts`
- **修改**:
  - 专门处理 `tools` 节点的 `todo` 数据
  - 专门处理 `write_note` 节点的 `note` 数据
  - 添加详细的控制台日志用于调试
- **作用**: 准确提取和处理不同节点类型的任务和文件数据

### 4. 调整 Todo 状态处理

- **文件**: `src/app/types/types.ts`
- **修改**: 将 TodoItem 的状态类型从 `"completed"` 改为 `"done"`
- **作用**: 适配后端返回的任务状态格式

### 5. 更新前端 Todo 显示逻辑

- **文件**: `src/app/components/TasksFilesSidebar/TasksFilesSidebar.tsx`
- **修改**:
  - 将 `getStatusIcon` 函数中的 `"completed"` 状态改为 `"done"`
  - 将 `groupedTodos` 中的筛选条件从 `"completed"` 改为 `"done"`
- **作用**: 正确显示已完成任务的图标和分组

### 主要改进

1. **子图数据支持**: 现在可以接收和显示子图节点返回的数据
2. **任务管理优化**: 正确处理和显示任务状态变化
3. **文件内容展示**: 支持显示 `write_note` 节点生成的文件内容
4. **调试友好**: 添加了详细的日志输出，便于问题排查
