from django.contrib import admin
from .models import Usuario, Local, Responsavel, Ambiente, Sensor, Historico

admin.site.register(Usuario)
admin.site.register(Local)
admin.site.register(Responsavel)
admin.site.register(Ambiente)
admin.site.register(Sensor)
admin.site.register(Historico)