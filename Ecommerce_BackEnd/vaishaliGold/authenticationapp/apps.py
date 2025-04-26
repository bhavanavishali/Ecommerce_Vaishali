# authenticationapp/apps.py
from django.apps import AppConfig

class AuthenticationConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'authenticationapp'  # Must match app directory name

    def ready(self):
        print("AppConfig.ready() called")  # Debug to confirm loading
        import authenticationapp.signals  # Import signals