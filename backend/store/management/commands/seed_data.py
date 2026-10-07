import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from store.models import Category, Product


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
    help = 'Seed database with initial categories and products'

    def handle(self, *args, **options):
        categories = [
            {'name': 'Aviator', 'slug': 'aviator'},
            {'name': 'Wayfarer', 'slug': 'wayfarer'},
            {'name': 'Round', 'slug': 'round'},
            {'name': 'Cat Eye', 'slug': 'cat-eye'},
            {'name': 'Sport', 'slug': 'sport'},
            {'name': 'Square', 'slug': 'square'},
        ]

        cat_objs = {}
        for cat in categories:
            obj, _ = Category.objects.get_or_create(**cat)
            cat_objs[obj.slug] = obj

            # Set category image from local files
            if not obj.image:
                img_file = CATEGORY_IMAGE_MAP.get(obj.slug)
                if img_file:
                    image_path = os.path.join(settings.MEDIA_ROOT, 'categories', img_file)
                    if not os.path.exists(image_path):
                        image_path = os.path.join(settings.BASE_DIR, '..', '..', 'images', 'categories', img_file)
                    if os.path.exists(image_path):
                        with open(image_path, 'rb') as f:
                            obj.image.save(img_file, File(f), save=True)
                        self.stdout.write(f'Category: {obj.name} (with image)')
                    else:
                        self.stdout.write(f'Category: {obj.name} (no image file)')
                else:
                    self.stdout.write(f'Category: {obj.name}')
            else:
                self.stdout.write(f'Category: {obj.name} (image exists)')

        products = [
            {'slug': 'aviator-classic', 'category': 'aviator', 'name': 'Aviator Classic', 'brand': 'LUMINA', 'price': 21490, 'old_price': 25990, 'rating': 4.8, 'reviews_count': 124, 'colors': ['#1a1a2e', '#c9a84c', '#2d2d2d'], 'badge': 'Best Seller', 'description': 'Timeless aviator design with premium gold-plated frame and UV400 polarized lenses.', 'featured': True},
            {'slug': 'wayfarer-elite', 'category': 'wayfarer', 'name': 'Wayfarer Elite', 'brand': 'LUMINA', 'price': 16990, 'old_price': 21990, 'rating': 4.6, 'reviews_count': 98, 'colors': ['#1a1a2e', '#8b4513'], 'badge': None, 'description': 'Modern take on the classic wayfarer with lightweight titanium frame.', 'featured': True},
            {'slug': 'round-gold', 'category': 'round', 'name': 'Round Gold', 'brand': 'LUMINA', 'price': 23990, 'old_price': 27990, 'rating': 4.9, 'reviews_count': 156, 'colors': ['#c9a84c', '#1a1a2e'], 'badge': 'New', 'description': 'Vintage-inspired round frames in lustrous gold with blue-tinted glass lenses.', 'featured': True},
            {'slug': 'sport-shield', 'category': 'sport', 'name': 'Sport Shield', 'brand': 'LUMINA', 'price': 14990, 'old_price': 18990, 'rating': 4.5, 'reviews_count': 72, 'colors': ['#2d2d2d', '#1a1a2e', '#c9a84c'], 'badge': 'Sale', 'description': 'High-performance wraparound sunglasses with shatterproof polycarbonate lenses.', 'featured': False},
            {'slug': 'cat-eye-noir', 'category': 'cat-eye', 'name': 'Cat Eye Noir', 'brand': 'LUMINA', 'price': 25990, 'old_price': 30990, 'rating': 4.7, 'reviews_count': 89, 'colors': ['#1a1a2e', '#c9a84c'], 'badge': None, 'description': 'Elegant cat-eye silhouette with hand-polished acetate and gradient lenses.', 'featured': True},
            {'slug': 'navigator-silver', 'category': 'aviator', 'name': 'Navigator Silver', 'brand': 'LUMINA', 'price': 22990, 'old_price': 26990, 'rating': 4.4, 'reviews_count': 63, 'colors': ['#c0c0c0', '#1a1a2e'], 'badge': None, 'description': 'Sleek navigator style with brushed silver frame and anti-reflective coating.', 'featured': False},
            {'slug': 'square-titanium', 'category': 'square', 'name': 'Square Titanium', 'brand': 'LUMINA', 'price': 27990, 'old_price': 33990, 'rating': 4.8, 'reviews_count': 112, 'colors': ['#2d2d2d', '#c9a84c'], 'badge': 'Best Seller', 'description': 'Bold square frame crafted from lightweight titanium with spring hinges.', 'featured': True},
            {'slug': 'retro-round', 'category': 'round', 'name': 'Retro Round', 'brand': 'LUMINA', 'price': 18990, 'old_price': None, 'rating': 4.3, 'reviews_count': 47, 'colors': ['#8b4513', '#1a1a2e', '#c0c0c0'], 'badge': None, 'description': 'Classic round frames with tortoiseshell acetate and green-tinted lenses.', 'featured': False},
            {'slug': 'pilot-pro', 'category': 'aviator', 'name': 'Pilot Pro', 'brand': 'LUMINA', 'price': 29990, 'old_price': 36990, 'rating': 4.9, 'reviews_count': 203, 'colors': ['#1a1a2e', '#c9a84c'], 'badge': 'New', 'description': 'Premium pilot sunglasses with dual-bridge design and photochromic lenses.', 'featured': False},
            {'slug': 'oversized-square', 'category': 'square', 'name': 'Oversized Square', 'brand': 'LUMINA', 'price': 21990, 'old_price': None, 'rating': 4.6, 'reviews_count': 84, 'colors': ['#1a1a2e', '#8b4513', '#c9a84c'], 'badge': None, 'description': 'Statement oversized square frame with UV400 protection and scratch-resistant coating.', 'featured': False},
            {'slug': 'sport-wrap', 'category': 'sport', 'name': 'Sport Wrap', 'brand': 'LUMINA', 'price': 13490, 'old_price': 16990, 'rating': 4.2, 'reviews_count': 38, 'colors': ['#2d2d2d', '#c0c0c0'], 'badge': 'Sale', 'description': 'Full-wrap sport sunglasses with rubberized grips and ventilation system.', 'featured': False},
            {'slug': 'butterfly-gold', 'category': 'cat-eye', 'name': 'Butterfly Gold', 'brand': 'LUMINA', 'price': 32990, 'old_price': 38990, 'rating': 4.7, 'reviews_count': 91, 'colors': ['#c9a84c', '#1a1a2e'], 'badge': 'Best Seller', 'description': 'Dramatic butterfly cat-eye with 24k gold-plated temples and crystal embellishments.', 'featured': True},
            {'slug': 'solaris-aviator', 'category': 'aviator', 'name': 'Solaris Aviator', 'brand': 'LUMINA', 'price': 21490, 'old_price': None, 'rating': 4.9, 'reviews_count': 187, 'colors': ['#1a1a2e', '#c9a84c', '#2d2d2d'], 'badge': 'Best Seller', 'description': 'Premium aviator with gold-plated frame and UV400 polarized lenses.', 'featured': True},
            {'slug': 'nova-round', 'category': 'round', 'name': 'Nova Round', 'brand': 'LUMINA', 'price': 16990, 'old_price': None, 'rating': 4.7, 'reviews_count': 134, 'colors': ['#c9a84c', '#1a1a2e'], 'badge': 'New', 'description': 'Vintage-inspired round frames with blue-tinted glass lenses.', 'featured': False},
            {'slug': 'eclipse-wayfarer', 'category': 'wayfarer', 'name': 'Eclipse Wayfarer', 'brand': 'LUMINA', 'price': 14990, 'old_price': 18990, 'rating': 4.8, 'reviews_count': 156, 'colors': ['#1a1a2e', '#8b4513'], 'badge': 'Sale', 'description': 'Modern wayfarer with lightweight titanium frame and gradient lenses.', 'featured': True},
            {'slug': 'aura-cat-eye', 'category': 'cat-eye', 'name': 'Aura Cat Eye', 'brand': 'LUMINA', 'price': 19490, 'old_price': None, 'rating': 5.0, 'reviews_count': 92, 'colors': ['#1a1a2e', '#c9a84c'], 'badge': 'New', 'description': 'Stunning cat-eye silhouette with hand-polished acetate frame.', 'featured': False},
            {'slug': 'vertex-square', 'category': 'square', 'name': 'Vertex Square', 'brand': 'LUMINA', 'price': 13490, 'old_price': None, 'rating': 4.6, 'reviews_count': 78, 'colors': ['#2d2d2d', '#c9a84c'], 'badge': 'New', 'description': 'Bold square frame crafted from lightweight titanium with spring hinges.', 'featured': False},
            {'slug': 'prisma-shield', 'category': 'sport', 'name': 'Prisma Shield', 'brand': 'LUMINA', 'price': 29990, 'old_price': None, 'rating': 4.9, 'reviews_count': 113, 'colors': ['#2d2d2d', '#1a1a2e'], 'badge': 'New', 'description': 'High-performance shield sunglasses with shatterproof polycarbonate lenses.', 'featured': False},
        ]

        for p in products:
            cat_slug = p.pop('category')
            product, created = Product.objects.get_or_create(
                slug=p['slug'],
                defaults={**p, 'category': cat_objs[cat_slug]}
            )

            # Set product image from local files
            if not product.image:
                img_file = PRODUCT_IMAGE_MAP.get(product.slug)
                if img_file:
                    # Try media/products first, then frontend images/products
                    image_path = os.path.join(settings.MEDIA_ROOT, 'products', img_file)
                    if not os.path.exists(image_path):
                        image_path = os.path.join(settings.BASE_DIR, '..', '..', 'images', 'products', img_file)
                    if os.path.exists(image_path):
                        with open(image_path, 'rb') as f:
                            product.image.save(img_file, File(f), save=True)
                        self.stdout.write(f'Product: {product.name} (with image)')
                    else:
                        self.stdout.write(f'Product: {product.name} (no image file found)')
                else:
                    self.stdout.write(f'Product: {product.name}')
            else:
                self.stdout.write(f'Product: {product.name} (image exists)')

        self.stdout.write(self.style.SUCCESS('Database seeded successfully!'))
