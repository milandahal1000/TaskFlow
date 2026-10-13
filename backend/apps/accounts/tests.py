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

    def test_change_password_requires_auth_and_updates_user(self):
        user = get_user_model().objects.create_user(
            username='charlie',
            email='charlie@example.com',
            password='OldPassword123!',
        )

        self.client.force_authenticate(user=user)
        response = self.client.put(
            '/api/auth/change-password/',
            {
                'old_password': 'OldPassword123!',
                'new_password': 'NewPassword456!',
            },
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user.refresh_from_db()
        self.assertTrue(user.check_password('NewPassword456!'))

    def test_api_allows_frontend_origin(self):
        response = self.client.options(
            '/api/auth/register/',
            HTTP_ORIGIN='http://localhost:5173',
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('Access-Control-Allow-Origin', response.headers)
