import { Task, TaskId } from '.'

export interface QueuedTask {
  task: TaskId
  data: object
}

export interface TaskExecutor {
  registeredTasks: Map<TaskId, Task>
  taskQueue: QueuedTask[]
}
