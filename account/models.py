from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from studymate.storage import OverwriteStorage

class AccountManager(BaseUserManager):
    def create_user(self, email, name, username, password=None):
        if not email:
            raise ValueError("Users must have an email address")
        if not username:
            raise ValueError("Users must have a username")
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            username=username,
        )
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, username, password):
        user = self.model(
            email=self.normalize_email(email),
            name=name,
            username=username,
        )
        user.set_password(password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

def get_profile_image_filepath(self, filename):
    return f'profile_images/{self.pk}/{"profile.jpg"}'

def get_default_profile_image():
    return f'profile_images/profile.jpg'

def get_cover_image_filepath(self, filename):
    return f'profile_images/{self.pk}/{"cover.jpg"}'

def get_default_cover_image():
    return f'profile_images/cover.jpg'

class User(AbstractBaseUser, PermissionsMixin):
    email           = models.EmailField(verbose_name="email", max_length=60, unique=True)
    username        = models.CharField(max_length=100, null=False, unique=True)
    name            = models.CharField(max_length=200, null=True)
    bio             = models.TextField(null=True)
    date_joined     = models.DateTimeField(verbose_name="date joined", auto_now_add=True)
    last_login      = models.DateTimeField(verbose_name="last login", auto_now=True)

    is_admin        = models.BooleanField(default = False)
    is_active       = models.BooleanField(default = True)
    is_staff        = models.BooleanField(default = False)
    is_superuser    = models.BooleanField(default = False)

    profile_image   = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_profile_image_filepath, null=True, blank=True, default=get_default_profile_image())
    cover_image     = models.ImageField(max_length=255, storage=OverwriteStorage(), upload_to=get_cover_image_filepath, null=True, blank=True, default=get_default_cover_image())
    hide_email      = models.BooleanField(default=True)

    objects = AccountManager()
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def __str__(self):
        return self.username 
    
    def get_profile_image_filename(self):
        return str(self.profile_image)[str(self.profile_image).index('profile_image/{self.pk}/'):]

    def has_perm(self, perm, obj=None):
        return self.is_admin 
    
    def has_module_perms(self, app_label):
        return True

