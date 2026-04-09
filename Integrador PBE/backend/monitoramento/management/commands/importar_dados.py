import pandas as pd
from decimal import Decimal
from django.core.management.base import BaseCommand
from monitoramento.models import Local, Responsavel, Ambiente, Sensor, Historico


def to_decimal(valor):
    if pd.isna(valor):
        return None
    return Decimal(str(valor).replace(',', '.').strip())


def to_bool(valor):
    if isinstance(valor, bool):
        return valor
    return str(valor).strip().lower() in ['true', '1', 'sim', 'ativo']


class Command(BaseCommand):
    help = 'Importa os dados dos arquivos CSV para o banco'

    def handle(self, *args, **kwargs):
        pasta = 'database/dados/'

        self.stdout.write(self.style.WARNING('Iniciando importação...'))

        Historico.objects.all().delete()
        Sensor.objects.all().delete()
        Ambiente.objects.all().delete()
        Responsavel.objects.all().delete()
        Local.objects.all().delete()

        df_locais = pd.read_csv(pasta + 'locais.csv', sep=';', encoding='utf-8-sig')
        df_locais.columns = df_locais.columns.str.strip()

        locais_map = {}

        for index, row in df_locais.iterrows():
            local = Local.objects.create(nome=row['local'])
            locais_map[index + 1] = local

        self.stdout.write(self.style.SUCCESS('Locais importados com sucesso.'))

        df_resp = pd.read_csv(pasta + 'responsaveis.csv', sep=';', encoding='utf-8-sig')
        df_resp.columns = df_resp.columns.str.strip()

        responsaveis_map = {}

        for index, row in df_resp.iterrows():
            responsavel = Responsavel.objects.create(nome=row['responsavel'])
            responsaveis_map[index + 1] = responsavel

        self.stdout.write(self.style.SUCCESS('Responsáveis importados com sucesso.'))

        df_amb = pd.read_csv(pasta + 'ambientes.csv', sep=';', encoding='utf-8-sig')
        df_amb.columns = df_amb.columns.str.strip()

        ambientes_map = {}

        for index, row in df_amb.iterrows():
            ambiente = Ambiente.objects.create(
                descricao=row['descricao'],
                local=locais_map[int(row['local'])],
                responsavel=responsaveis_map[int(row['responsavel'])]
            )
            ambientes_map[index + 1] = ambiente

        self.stdout.write(self.style.SUCCESS('Ambientes importados com sucesso.'))

        df_micro = pd.read_csv(pasta + 'microcontroladores.csv', sep=';', encoding='utf-8-sig')
        df_micro.columns = df_micro.columns.str.strip()

        df_sens = pd.read_csv(pasta + 'sensores.csv', sep=';', encoding='utf-8-sig')
        df_sens.columns = df_sens.columns.str.strip()

        sensores_map = {}

        unidade_map = {
            'temperatura': '°C',
            'umidade': '%',
            'luminosidade': 'lux',
            'contador': 'uni'
        }

        for index, row in df_sens.iterrows():
            mic_id = int(row['mic'])
            micro = df_micro.iloc[mic_id - 1]

            unidade = row['unidade_med'] if 'unidade_med' in df_sens.columns else unidade_map.get(str(row['sensor']).strip().lower(), '')

            identificacao_unica = f"{str(micro['mac_address']).strip()}_{str(row['sensor']).strip().lower()}"

            sensor = Sensor.objects.create(
                sensor=str(row['sensor']).strip().lower(),
                identificacao=identificacao_unica,
                latitude=to_decimal(micro['latitude']),
                longitude=to_decimal(micro['longitude']),
                status=to_bool(micro['status']),
                unidade_med=unidade,
                ambiente=ambientes_map[int(micro['ambiente'])]
            )

            sensores_map[index + 1] = sensor

        self.stdout.write(self.style.SUCCESS('Sensores importados com sucesso.'))

        df_hist = pd.read_csv(pasta + 'historicos.csv', sep=';', encoding='utf-8-sig')
        df_hist.columns = df_hist.columns.str.strip()

        for _, row in df_hist.iterrows():
            Historico.objects.create(
                sensor=sensores_map[int(row['sensor'])],
                valor=to_decimal(row['valor']),
                data_hora=pd.to_datetime(row['timestamp'])
            )

        self.stdout.write(self.style.SUCCESS('Históricos importados com sucesso.'))
        self.stdout.write(self.style.SUCCESS('Importação concluída com sucesso!'))