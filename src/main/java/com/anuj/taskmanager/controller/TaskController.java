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

    // 🔥 Get Tasks (List)
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<Task>> getTasks(@PathVariable Long projectId) {

        List<Task> tasks = taskService.getTasksByProject(projectId);
        return ResponseEntity.ok(tasks);
    }

    // 🔥 Pagination API
    @GetMapping("/project/{projectId}/paged")
    public ResponseEntity<Page<Task>> getTasksPaged(
            @PathVariable Long projectId,
            Pageable pageable) {

        return ResponseEntity.ok(
                taskService.getTasksByProject(projectId, pageable)
        );
    }

    // 🔥 DTO API
    @GetMapping("/project/{projectId}/dto")
    public ResponseEntity<Page<TaskResponse>> getTasksDto(
            @PathVariable Long projectId,
            Pageable pageable) {

        return ResponseEntity.ok(
                taskService.getTasksDto(projectId, pageable)
        );
    }

    // 🔥 UPDATE STATUS (FIXED)
    @PutMapping("/{id}/status")
    public ResponseEntity<Task> updateStatus(
            @PathVariable Long id,
            @RequestParam Status status) {

        Task updatedTask = taskService.updateStatus(id, status);
        return ResponseEntity.ok(updatedTask);
    }
}