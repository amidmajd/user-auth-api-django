from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator


GENDER_CHOICES = (
    ('Male', 'Male'),
    ('Female', 'Female'),
)


class User(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)  # email is our user identifier
    username = None                                         # no username
    password = models.CharField(max_length=128)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)
    birthday = models.DateField()
    phone_number = models.CharField(max_length=11, validators=[RegexValidator(r'^\d{11}$')])
    address = models.TextField(max_length=300)
    gender = models.CharField(max_length=6, choices=GENDER_CHOICES)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []
