from django.apps import AppConfig



class ProductsappConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'productsapp'

    def ready(self):
        print("AppConfig.ready() called")  # Debug to confirm loading
        import productsapp.signals  # Import signals
