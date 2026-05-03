package com.anuj.taskmanager.controller;

import com.anuj.taskmanager.entity.*;
import com.anuj.taskmanager.services.TaskService;
import com.anuj.taskmanager.dto.TaskResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;

    // 🔥 Create Task
    @PostMapping
    public ResponseEntity<Task> createTask(
            @RequestBody Task task,
            @RequestParam Long userId,
            @RequestParam Long projectId) {

        Task createdTask = taskService.createTask(task, userId, projectId);
        return ResponseEntity.ok(createdTask);
    }

    // 🔥 OLD API (keep it)
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable Long projectId) {

        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    // 🔥 NEW PAGINATION API (added, not replacing)
    @GetMapping("/project/{projectId}/paged")
    public ResponseEntity<Page<Task>> getTasksPaged(
            @PathVariable Long projectId,
            Pageable pageable) {

        return ResponseEntity.ok(
                taskService.getTasksByProject(projectId, pageable)
        );
    }
    @GetMapping("/project/{projectId}/dto")
public ResponseEntity<Page<TaskResponse>> getTasksDto(
        @PathVariable Long projectId,
        Pageable pageable) {

    return ResponseEntity.ok(
            taskService.getTasksDto(projectId, pageable)
    );
}

    // 🔥 Update Status
    @PutMapping("/api/tasks/{id}/status")
public Task updateStatus(
        @PathVariable Long id,
        @RequestParam String status) {

    return taskService.updateStatus(id, status);
}
}