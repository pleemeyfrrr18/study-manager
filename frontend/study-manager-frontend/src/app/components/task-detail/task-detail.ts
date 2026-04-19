import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task';

@Component({
  selector: 'app-task-detail',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './task-detail.html',
  styleUrl: './task-detail.css',
})
export class TaskDetail implements OnInit {
  task: any = null;
  errorMessage = '';
  isLoading = false;
  isEditing = false;

  statusChoices = [
    { value: 'todo', label: 'To Do' },
    { value: 'doing', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  editTask = { title: '', description: '', deadline: '', status: 'todo', priority: false };

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadTask(+id);
  }

  loadTask(id: number) {
    this.isLoading = true;
    this.taskService.getTask(id).subscribe({
      next: (data) => {
        this.task = data;
        this.editTask = {
          title: data.title,
          description: data.description,
          deadline: data.deadline,
          status: data.status,
          priority: data.priority
        };
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorMessage = 'Failed to load task';
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  saveTask() {
    this.taskService.updateTask(this.task.id, this.editTask).subscribe({
      next: (data) => {
        this.task = data;
        this.isEditing = false;
        this.cdr.detectChanges();
      },
      error: () => { this.errorMessage = 'Failed to update task'; }
    });
  }

  changeStatus(status: string) {
    this.taskService.updateTask(this.task.id, { status }).subscribe({
      next: (data) => {
        this.task = data;
        this.cdr.detectChanges();
      },
      error: () => { this.errorMessage = 'Failed to update status'; }
    });
  }

  deleteTask() {
    this.taskService.deleteTask(this.task.id).subscribe({
      next: () => this.router.navigate(['/tasks']),
      error: () => { this.errorMessage = 'Failed to delete task'; }
    });
  }
}