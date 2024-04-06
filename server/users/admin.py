from django.contrib import admin
from users.models import Users
# Register your models here.

class TodoAdmin(admin.ModelAdmin):
    list_display = ('email', 'password', 'confirmPassword','firstName', 'lastName', 'bio', 'profileImage')
admin.site.register(Users)