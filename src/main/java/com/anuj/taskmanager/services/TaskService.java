package com.anuj.taskmanager.services;

import com.anuj.taskmanager.entity.*;
import com.anuj.taskmanager.repository.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.anuj.taskmanager.dto.TaskResponse;
import com.anuj.taskmanager.mapper.TaskMapper;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskService {

    // 🔥 Constructor Injection (industry standard)
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;
    private final ProjectRepository projectRepository;

    // 🔥 Create Task (same logic, improved)
    public Task createTask(Task task, Long userId, Long projectId) {

        if (task.getTitle() == null || task.getTitle().isBlank()) {
            throw new RuntimeException("Task title cannot be empty");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));

        task.setAssignedTo(user);
        task.setProject(project);
        task.setCreatedAt(LocalDateTime.now());
        task.setStatus(Status.TODO);

        return taskRepository.save(task);
    }

    // 🔥 Get Tasks by Project (safe)
    public List<Task> getTasksByProject(Long projectId) {

        if (!projectRepository.existsById(projectId)) {
            throw new RuntimeException("Project not found with id: " + projectId);
        }

        return taskRepository.findByProjectId(projectId);
    }

    // 🔥 Update Status (improved validation)
    public Task updateStatus(Long taskId, Status status) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (status == null) {
            throw new RuntimeException("Status cannot be null");
        }

        task.setStatus(status);
        return taskRepository.save(task);
    }
    public Page<Task> getTasksByProject(Long projectId, Pageable pageable) {

    if (!projectRepository.existsById(projectId)) {
        throw new RuntimeException("Project not found");
    }

    return taskRepository.findByProjectId(projectId, pageable);
    }
    public Page<TaskResponse> getTasksDto(Long projectId, Pageable pageable) {
        return taskRepository.findByProjectId(projectId, pageable)
            .map(TaskMapper::toDto);
    }

    // 🔥 EXTRA (for future upgrade → DTO ready)
    public Task assignUser(Long taskId, Long userId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        task.setAssignedTo(user);
        return taskRepository.save(task);
    }
}