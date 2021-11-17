from django.conf import settings
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .serializers import UserSerializer, UserEssentialsSerializer
from .models import User
import jwt
import datetime


class RegisterView(APIView):
    def post(self, request):
        serialized_user = UserSerializer(data=request.data)
        serialized_user.is_valid(raise_exception=True)
        serialized_user.save()

        response = Response()
        response.data = {
            'message': 'success',
            'data': serialized_user.data
        }
        return response


class LoginView(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password']

        user = User.objects.filter(email=email).first()

        if user is None:
            raise AuthenticationFailed('User not found!')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect password!')

        payload = {
            'id': user.id,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=6),
            'iat': datetime.datetime.utcnow()
        }

        token = jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')

        response = Response()
        response.set_cookie(key='jwt', value=token, httponly=True, samesite="None", secure=True)
        response.data = {'message': 'success'}
        return response


class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.set_cookie(key='jwt', value="", httponly=True, samesite="None", secure=True)
        response.data = {'message': 'success'}
        return response


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = User.objects.filter(id=payload['id']).first()
        serialized_user = UserSerializer(user)

        response = Response()
        response.data = {
            'message': 'success',
            'data': serialized_user.data
        }
        return response


class UsersView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        users = User.objects.all()
        serialized_users = UserEssentialsSerializer(users, many=True)

        response = Response()
        response.data = {
            'message': 'success',
            'data': serialized_users.data
        }
        return response


class UpdateView(APIView):
    def get_object(self, pk):
        try:
            return User.objects.get(pk=pk)
        except User.DoesNotExist:
            raise Http404

    def put(self, request, pk, format=None):
        token = request.COOKIES.get('jwt')
        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms='HS256')
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')

        user = self.get_object(pk)

        if payload['id'] != user.id:
            raise AuthenticationFailed('Unauthorized! You can only edit your info')

        serialized_user = UserSerializer(user, data=request.data)
        serialized_user.is_valid(raise_exception=True)
        serialized_user.save()

        response = Response()
        response.data = {
            'message': 'success',
            'data': serialized_user.data
        }
        return response
