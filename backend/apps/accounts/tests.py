from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase


class UserAuthAPITests(APITestCase):
    def test_register_user_success(self):
        payload = {
            'username': 'alice',
            'email': 'alice@example.com',
            'password': 'StrongPass123!',
        }

        response = self.client.post('/api/auth/register/', payload, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(get_user_model().objects.filter(username='alice').exists())

    def test_login_returns_tokens(self):
        get_user_model().objects.create_user(
            username='bob',
            email='bob@example.com',
            password='StrongPass123!',
        )

        response = self.client.post(
            '/api/auth/login/',
            {'username': 'bob', 'password': 'StrongPass123!'},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_current_user_requires_auth(self):
        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
