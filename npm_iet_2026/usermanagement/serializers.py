from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
       write_only=True,
       required=True,
       style={'input_type':'password'}
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            is_admin=False,
            is_member=True
        )

        user.set_password(validated_data['password'])
        user.save()

        return user