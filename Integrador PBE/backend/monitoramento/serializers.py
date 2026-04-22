import random
from rest_framework import serializers
from .models import Local, Responsavel, Ambiente, Sensor, Historico, Usuario


class LocalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Local
        fields = '__all__'


class ResponsavelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Responsavel
        fields = '__all__'


class AmbienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ambiente
        fields = '__all__'


class SensorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sensor
        fields = '__all__'
        extra_kwargs = {
            'identificacao': {'required': False}
        }

    def gerar_mac_address(self):
        caracteres = '0123456789ABCDEF'
        grupos = []

        for _ in range(6):
            grupo = ''.join(random.choice(caracteres) for _ in range(2))
            grupos.append(grupo)

        return ':'.join(grupos)

    def gerar_identificacao(self, tipo_sensor):
        return f'{self.gerar_mac_address()}_{tipo_sensor}'

    def create(self, validated_data):
        if not validated_data.get('identificacao'):
            tipo_sensor = validated_data.get('sensor')
            nova_identificacao = self.gerar_identificacao(tipo_sensor)

            while Sensor.objects.filter(identificacao=nova_identificacao).exists():
                nova_identificacao = self.gerar_identificacao(tipo_sensor)

            validated_data['identificacao'] = nova_identificacao

        return super().create(validated_data)


class HistoricoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Historico
        fields = '__all__'

    def validate(self, data):
        sensor = data['sensor']
        if not sensor.status:
            raise serializers.ValidationError(
                "Não é permitido registrar medições para sensor inativo"
            )
        return data


class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'username', 'tipo']