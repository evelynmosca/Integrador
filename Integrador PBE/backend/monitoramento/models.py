from django.db import models
from django.contrib.auth.models import AbstractUser

class Usuario(AbstractUser):
    TIPO_CHOICES = [
        ('Administrador', 'Administrador'),
        ('Usuario', 'Usuario'),
    ]
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES, default='Usuario')

    def __str__(self):
        return self.username


class Local(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Responsavel(models.Model):
    nome = models.CharField(max_length=100)

    def __str__(self):
        return self.nome


class Ambiente(models.Model):
    local = models.ForeignKey(Local, on_delete=models.CASCADE, related_name='ambientes')
    descricao = models.CharField(max_length=255)
    responsavel = models.ForeignKey(Responsavel, on_delete=models.CASCADE, related_name='ambientes')

    def __str__(self):
        return self.descricao


class Sensor(models.Model):
    SENSOR_CHOICES = [
        ('temperatura', 'temperatura'),
        ('umidade', 'umidade'),
        ('luminosidade', 'luminosidade'),
        ('contador', 'contador'),
    ]

    UNIDADE_CHOICES = [
        ('°C', '°C'),
        ('%', '%'),
        ('lux', 'lux'),
        ('uni', 'uni'),
    ]

    sensor = models.CharField(max_length=20, choices=SENSOR_CHOICES)
    identificacao = models.CharField(max_length=50, unique=True)  # mac-address
    latitude = models.DecimalField(max_digits=10, decimal_places=8)
    longitude = models.DecimalField(max_digits=11, decimal_places=8)
    status = models.BooleanField(default=True)
    unidade_med = models.CharField(max_length=10, choices=UNIDADE_CHOICES)
    ambiente = models.ForeignKey(Ambiente, on_delete=models.CASCADE, related_name='sensores')

    def __str__(self):
        return f"{self.sensor} - {self.identificacao}"


class Historico(models.Model):
    sensor = models.ForeignKey(Sensor, on_delete=models.CASCADE, related_name='medicoes')
    valor = models.DecimalField(max_digits=10, decimal_places=2)
    data_hora = models.DateTimeField()

    def __str__(self):
        return f"{self.sensor.sensor} - {self.valor}"