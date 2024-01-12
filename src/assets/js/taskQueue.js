class TaskQueue {
    constructor() {//单例
        if (!TaskQueue.instance) {
            this.queue = [];
            this.isRunning = false;
            TaskQueue.instance = this;
        }
        return TaskQueue.instance;
    }
    // constructor() {//默认
    //     this.queue = [];
    //     this.isRunning = false;
    //   }

    // 添加任务到队列的方法
    enqueue(task) {
        this.queue.push(task);
        this.run();
    }

    async run() {
        if (!this.isRunning && this.queue.length > 0) {
            this.isRunning = true;
            const task = this.queue.shift();
            try {
                await task();
            } catch (error) {
                console.error('任务执行出错:', error);
            }
            this.isRunning = false;
            this.run();
        }
    }
}
const taskQueueInstance = new TaskQueue();
export function taskQueue(task) {
    taskQueueInstance.enqueue(task);
}