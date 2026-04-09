from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta

from .models import Local, Responsavel, Ambiente, Sensor, Historico
from .serializers import (
    LocalSerializer,
    ResponsavelSerializer,
    AmbienteSerializer,
    SensorSerializer,
    HistoricoSerializer
)
from .permissions import IsAdminOuSomenteLeitura

class LocalViewSet(viewsets.ModelViewSet):
    queryset = Local.objects.all()
    serializer_class = LocalSerializer
    permission_classes = [IsAdminOuSomenteLeitura]


class ResponsavelViewSet(viewsets.ModelViewSet):
    queryset = Responsavel.objects.all()
    serializer_class = ResponsavelSerializer
    permission_classes = [IsAdminOuSomenteLeitura]


class AmbienteViewSet(viewsets.ModelViewSet):
    queryset = Ambiente.objects.all()
    serializer_class = AmbienteSerializer
    permission_classes = [IsAdminOuSomenteLeitura]


class SensorViewSet(viewsets.ModelViewSet):
    queryset = Sensor.objects.all()
    serializer_class = SensorSerializer
    permission_classes = [IsAdminOuSomenteLeitura]

class HistoricoViewSet(viewsets.ModelViewSet):
    queryset = Historico.objects.all().order_by('-data_hora')
    serializer_class = HistoricoSerializer
    permission_classes = [IsAdminOuSomenteLeitura]

@api_view(['GET'])
@permission_classes([IsAdminOuSomenteLeitura])
def medicoes_recentes(request):
    limite = timezone.now() - timedelta(hours=24)
    medicoes = Historico.objects.filter(data_hora__gte=limite).order_by('-data_hora')
    serializer = HistoricoSerializer(medicoes, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminOuSomenteLeitura])
def medicoes_por_sensor(request, sensor_id):
    medicoes = Historico.objects.filter(sensor_id=sensor_id).order_by('-data_hora')
    serializer = HistoricoSerializer(medicoes, many=True)
    return Response(serializer.data)