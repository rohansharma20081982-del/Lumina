import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from store.models import Product, Category


# Map product slugs to local image files
PRODUCT_IMAGE_MAP = {
    'aviator-classic': 'aviator-classic.jpg',
    'wayfarer-elite': 'wayfarer-elite.jpg',
    'round-gold': 'round-gold.jpg',
    'sport-shield': 'sport-shield.jpg',
    'cat-eye-noir': 'cat-eye-noir.jpg',
    'navigator-silver': 'navigator-silver.jpg',
    'square-titanium': 'square-titanium.jpg',
    'retro-round': 'retro-round.jpg',
    'pilot-pro': 'pilot-pro.jpg',
    'oversized-square': 'oversized-square.jpg',
    'sport-wrap': 'sport-wrap.jpg',
    'butterfly-gold': 'butterfly-gold.jpg',
    'solaris-aviator': 'solaris-aviator.jpg',
    'nova-round': 'nova-round.jpg',
    'eclipse-wayfarer': 'eclipse-wayfarer.jpg',
    'aura-cat-eye': 'aura-cat-eye.jpg',
    'vertex-square': 'vertex-square.jpg',
    'prisma-shield': 'prisma-shield.jpg',
}

CATEGORY_IMAGE_MAP = {
    'aviator': 'aviator.jpg',
    'wayfarer': 'wayfarer.jpg',
    'round': 'round.jpg',
    'cat-eye': 'cat-eye.jpg',
    'sport': 'sport.jpg',
    'square': 'square.jpg',
}


class Command(BaseCommand):
    help = 'Update all product and category images from local files'

    def handle(self, *args, **options):
        # Get the frontend images directory
        frontend_images = os.path.join(settings.BASE_DIR, '..', '..', 'images')
        
        # Update categories
        self.stdout.write('Updating category images...')
        for cat in Category.objects.all():
            img_file = CATEGORY_IMAGE_MAP.get(cat.slug)
            if not img_file:
                continue
            
            # Check multiple paths
            paths = [
                os.path.join(settings.MEDIA_ROOT, 'categories', img_file),
                os.path.join(frontend_images, 'categories', img_file),
            ]
            
            for image_path in paths:
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        cat.image.save(img_file, File(f), save=True)
                    self.stdout.write(f'  Category: {cat.name} -> {img_file}')
                    break
            else:
                self.stdout.write(f'  Category: {cat.name} (no image file found)')

        # Update products
        self.stdout.write('\nUpdating product images...')
        for product in Product.objects.all():
            img_file = PRODUCT_IMAGE_MAP.get(product.slug)
            if not img_file:
                self.stdout.write(f'  {product.name}: no mapping')
                continue
            
            # Check multiple paths
            paths = [
                os.path.join(settings.MEDIA_ROOT, 'products', img_file),
                os.path.join(frontend_images, 'products', img_file),
            ]
            
            for image_path in paths:
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        product.image.save(img_file, File(f), save=True)
                    self.stdout.write(f'  Product: {product.name} -> {img_file}')
                    break
            else:
                self.stdout.write(f'  Product: {product.name} (no image file found)')

        self.stdout.write(self.style.SUCCESS('\nAll images updated successfully!'))
