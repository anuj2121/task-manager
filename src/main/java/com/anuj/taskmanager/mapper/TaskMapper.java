package com.anuj.taskmanager.mapper;

import com.anuj.taskmanager.dto.TaskResponse;
import com.anuj.taskmanager.entity.Task;

public class TaskMapper {

    public static TaskResponse toDto(Task task) {
        return TaskResponse.builder()
                .id(task.getId())
                .title(task.getTitle())
                .description(task.getDescription())
                .status(task.getStatus().name())
                .assignedTo(task.getAssignedTo().getName())
                .projectName(task.getProject().getName())
                .build();
    }
}