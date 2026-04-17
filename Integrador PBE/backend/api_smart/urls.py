from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from monitoramento.views import (
    me,
    LocalViewSet,
    ResponsavelViewSet,
    AmbienteViewSet,
    SensorViewSet,
    HistoricoViewSet,
    medicoes_recentes,
    medicoes_por_sensor
)

router = DefaultRouter()
router.register(r'locais', LocalViewSet)
router.register(r'responsaveis', ResponsavelViewSet)
router.register(r'ambientes', AmbienteViewSet)
router.register(r'sensores', SensorViewSet)
router.register(r'historicos', HistoricoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('api/me/', me),

    path('api/medicoes-recentes/', medicoes_recentes, name='medicoes_recentes'),
    path('api/medicoes/sensor/<int:sensor_id>/', medicoes_por_sensor, name='medicoes_por_sensor'),
    path('api/', include(router.urls)),
]
