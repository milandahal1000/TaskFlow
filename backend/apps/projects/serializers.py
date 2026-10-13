from rest_framework import serializers

from .models import Project, Task


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = (
            'id',
            'project',
            'title',
            'description',
            'status',
            'priority',
            'due_date',
            'assignee',
            'created_at',
            'updated_at',
        )
        read_only_fields = ('id', 'created_at', 'updated_at')

    def validate_project(self, value):
        request = self.context.get('request')
        if request and value.owner != request.user:
            raise serializers.ValidationError('You cannot assign tasks to a project you do not own.')
        return value


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = (
            'id',
            'name',
            'description',
            'status',
            'created_at',
            'updated_at',
            'tasks',
        )
        read_only_fields = ('id', 'created_at', 'updated_at', 'tasks')
