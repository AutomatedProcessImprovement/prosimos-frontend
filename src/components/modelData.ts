export interface ModelTask {
    name: string
    resource: string
}

export interface AllModelTasks {
    [id: string]: ModelTask
}
