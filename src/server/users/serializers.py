from rest_framework import serializers
from .models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        # serializer data fields
        fields = [
            'id', 'email', 'password', 'first_name', 'last_name',
            'birthday', 'phone_number', 'address', 'gender'
        ]
        extra_kwargs = {
            # don't return password in response
            "password": {'write_only': True}
        }

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            # save hashed password not user input
            instance.set_password(password)
        instance.save()
        return instance
