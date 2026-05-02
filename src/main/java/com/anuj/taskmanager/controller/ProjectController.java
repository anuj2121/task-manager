
package com.anuj.taskmanager.controller;
import com.anuj.taskmanager.entity.User;
import com.anuj.taskmanager.entity.Project;
import com.anuj.taskmanager.services.ProjectService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "*") 
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    // 🔥 ADMIN only
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Project createProject(@RequestBody Project project, Authentication auth) {
        String email = auth.getName();
        return projectService.createProject(project, email);
    }
    @PostMapping("/{projectId}/members")
    public Project addMember(
        @PathVariable Long projectId,
        @RequestParam Long userId) {

    return projectService.addMember(projectId, userId);
    }
    @GetMapping("/{projectId}/members")
    public List<User> getMembers(@PathVariable Long projectId) {
    return projectService.getMembers(projectId);
    }
    @DeleteMapping("/{projectId}/members")
    public Project removeMember(
        @PathVariable Long projectId,
        @RequestParam Long userId) {

    return projectService.removeMember(projectId, userId);
    }

    // 🔓 Logged-in users
    @GetMapping
    public List<Project> getAllProjects() {
        return projectService.getAllProjects();
    }
}