package com.anuj.taskmanager.services;

import com.anuj.taskmanager.entity.Project;
import com.anuj.taskmanager.entity.User;
import com.anuj.taskmanager.repository.ProjectRepository;
import com.anuj.taskmanager.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    // 🔥 Create Project
    public Project createProject(Project project, String email) {

        User creator = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        project.setCreatedAt(LocalDateTime.now());
        project.setCreatedBy(creator);

        return projectRepository.save(project);
    }
    public Project addMember(Long projectId, Long userId) {

    Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));

    User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));

    // 🔥 FIX: initialize if null
    if (project.getMembers() == null) {
        project.setMembers(new ArrayList<>());
    }

    // avoid duplicates
    if (!project.getMembers().contains(user)) {
        project.getMembers().add(user);
    }

    return projectRepository.save(project);
    }
    public List<User> getMembers(Long projectId) {

    Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));

    return project.getMembers();
    }
    public Project removeMember(Long projectId, Long userId) {

    Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));

    project.getMembers().removeIf(user -> user.getId().equals(userId));

    return projectRepository.save(project);
    }
    // 🔥 Get All Projects
    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }
}