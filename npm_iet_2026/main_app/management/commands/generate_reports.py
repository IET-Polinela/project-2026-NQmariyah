import random
from django.core.management.base import BaseCommand
from faker import Faker
from main_app.models import Report  # Sesuaikan dengan nama app Ibu

fake = Faker()

class Command(BaseCommand):
    help = 'Generate fake reports for IET City'

    def add_arguments(self, parser):
        parser.add_argument('num_records', type=int, help='Jumlah data yang ingin dibuat')

    def handle(self, *args, **kwargs):
        num_records = kwargs['num_records']
        
        # Opsi pilihan kategori dan status untuk variasi data
        categories = ['Jalan Rusak', 'Sampah', 'Lampu Mati', 'Drainase', 'Keamanan']
        status_choices = ['REPORTED', 'VERIFIED', 'IN_PROGRESS', 'RESOLVED']

        for _ in range(num_records):
            Report.objects.create(
                title=fake.sentence(nb_words=4),
                category=random.choice(categories),
                description=fake.paragraph(nb_sentences=3),
                location=fake.address(),
                status=random.choice(status_choices),
            )

        self.stdout.write(self.style.SUCCESS(f'Berhasil membuat {num_records} laporan simulasi!'))