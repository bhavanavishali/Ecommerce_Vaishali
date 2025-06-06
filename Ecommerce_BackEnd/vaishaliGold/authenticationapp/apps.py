# authenticationapp/apps.py
from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authenticationapp'  
    def ready(self):
        print("AppConfig.ready() called")  
        import authenticationapp.signals 