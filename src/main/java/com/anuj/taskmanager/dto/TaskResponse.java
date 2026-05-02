package com.anuj.taskmanager.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class TaskResponse {

    private Long id;
    private String title;
    private String description;
    private String status;

    private String assignedTo;
    private String projectName;
}