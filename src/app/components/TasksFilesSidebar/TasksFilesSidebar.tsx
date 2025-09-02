"use client";

import React, { useState, useMemo, useCallback } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Folder,
  FolderOpen,
  CheckCircle,
  Circle,
  Clock,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import type { TodoItem, FileItem } from "../../types/types";
import styles from "./TasksFilesSidebar.module.scss";

interface TasksFilesSidebarProps {
  todos: TodoItem[];
  files: Record<string, string>;
  onFileClick: (file: FileItem) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const TasksFilesSidebar = React.memo<TasksFilesSidebarProps>(
  ({ todos, files, onFileClick, collapsed, onToggleCollapse }) => {
    const getStatusIcon = useCallback((status: TodoItem["status"]) => {
      switch (status) {
        case "done":
          return <CheckCircle size={16} className={styles.completedIcon} />;
        case "in_progress":
          return <Clock size={16} className={styles.progressIcon} />;
        default:
          return <Circle size={16} className={styles.pendingIcon} />;
      }
    }, []);

    const groupedTodos = useMemo(() => {
      return {
        pending: todos.filter((t) => t.status === "pending"),
        in_progress: todos.filter((t) => t.status === "in_progress"),
        completed: todos.filter((t) => t.status === "done"),
      };
    }, [todos]);

    if (collapsed) {
      return (
        <div className={styles.sidebarCollapsed}>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={styles.toggleButton}
          >
            <ChevronRight size={20} />
          </Button>
        </div>
      );
    }

    return (
      <div className={styles.sidebar}>
        <div className={styles.header}>
          <h2 className={styles.title}>Workspace</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className={styles.toggleButton}
          >
            <ChevronLeft size={20} />
          </Button>
        </div>
        <Tabs defaultValue="tasks" className={styles.tabs}>
          <TabsList className={styles.tabsList}>
            <TabsTrigger value="tasks" className={styles.tabTrigger}>
              Tasks ({todos.length})
            </TabsTrigger>
            <TabsTrigger value="files" className={styles.tabTrigger}>
              Files ({Object.keys(files).length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className={styles.tabContent}>
            <ScrollArea className={styles.scrollArea}>
              {todos.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No tasks yet</p>
                </div>
              ) : (
                <div className={styles.todoGroups}>
                  {groupedTodos.in_progress.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>In Progress</h3>
                      {groupedTodos.in_progress.map((todo, index) => (
                        <div key={`in_progress_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupedTodos.pending.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>Pending</h3>
                      {groupedTodos.pending.map((todo, index) => (
                        <div key={`pending_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {groupedTodos.completed.length > 0 && (
                    <div className={styles.todoGroup}>
                      <h3 className={styles.groupTitle}>Completed</h3>
                      {groupedTodos.completed.map((todo, index) => (
                        <div key={`completed_${todo.id}_${index}`} className={styles.todoItem}>
                          {getStatusIcon(todo.status)}
                          <span className={styles.todoContent}>
                            {todo.content}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="files" className={styles.tabContent}>
            <ScrollArea className={styles.scrollArea}>
              {Object.keys(files).length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No files yet</p>
                </div>
              ) : (
                <div className={styles.fileTree}>
                  {Object.keys(files).map((file) => (
                    <div key={file} className={styles.fileItem}>
                      <div
                        className={styles.fileRow}
                        onClick={() =>
                          onFileClick({ path: file, content: files[file] })
                        }
                      >
                        <FileText size={16} />
                        <span className={styles.fileName}>{file}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    );
  },
);

TasksFilesSidebar.displayName = "TasksFilesSidebar";
