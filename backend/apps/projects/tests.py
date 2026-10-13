from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Project, Task


class ProjectTaskAPITests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username='owner',
            email='owner@example.com',
            password='StrongPass123!',
        )
        self.other_user = get_user_model().objects.create_user(
            username='other',
            email='other@example.com',
            password='StrongPass123!',
        )
        self.project = Project.objects.create(
            owner=self.user,
            name='Website Launch',
            description='Create a launch checklist',
            status='in_progress',
        )
        self.task = Task.objects.create(
            project=self.project,
            title='Finalize homepage copy',
            description='Proofread text for the landing page',
            status='todo',
            priority='high',
        )

    def test_list_projects_for_owner(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.get('/api/projects/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_other_user_cannot_access_foreign_project(self):
        foreign_project = Project.objects.create(
            owner=self.other_user,
            name='Foreign project',
            description='should not be visible',
            status='planning',
        )
        self.client.force_authenticate(user=self.user)

        response = self.client.get(f'/api/projects/{foreign_project.id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_task_created_for_project_owner(self):
        self.client.force_authenticate(user=self.user)

        response = self.client.post(
            '/api/tasks/',
            {
                'project': self.project.id,
                'title': 'Ship final design package',
                'description': 'Package assets and upload them',
                'status': 'todo',
                'priority': 'medium',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Task.objects.filter(title='Ship final design package').count(), 1)
