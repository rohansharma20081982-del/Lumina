import os
from django.core.management.base import BaseCommand
from django.core.files import File
from django.conf import settings
from PIL import Image, ImageDraw, ImageFont
import io


class Command(BaseCommand):
    help = 'Generate placeholder images for categories and products'

    def handle(self, *args, **options):
        self.generate_category_images()
        self.generate_product_images()
        self.generate_banner_images()
        self.generate_about_images()
        self.copy_to_static_images()
        self.stdout.write(self.style.SUCCESS('All images generated successfully!'))

    def create_gradient(self, width, height, color1, color2, direction='horizontal'):
        """Create a gradient background."""
        img = Image.new('RGB', (width, height))
        draw = ImageDraw.Draw(img)

        for i in range(width if direction == 'horizontal' else height):
            ratio = i / (width if direction == 'horizontal' else height)
            r = int(color1[0] + (color2[0] - color1[0]) * ratio)
            g = int(color1[1] + (color2[1] - color1[1]) * ratio)
            b = int(color1[2] + (color2[2] - color1[2]) * ratio)
            if direction == 'horizontal':
                draw.line([(i, 0), (i, height)], fill=(r, g, b))
            else:
                draw.line([(0, i), (width, i)], fill=(r, g, b))
        return img

    def draw_sunglasses(self, draw, x, y, width, height, frame_color, lens_color):
        """Draw a simple sunglasses icon."""
        # Left lens
        lens_width = width // 3
        lens_height = height // 3
        left_x = x + width // 6
        right_x = x + width // 2 + width // 12

        draw.ellipse([left_x, y + height // 3, left_x + lens_width, y + height // 3 + lens_height], fill=lens_color, outline=frame_color, width=3)
        draw.ellipse([right_x, y + height // 3, right_x + lens_width, y + height // 3 + lens_height], fill=lens_color, outline=frame_color, width=3)

        # Bridge
        draw.line([(left_x + lens_width, y + height // 2), (right_x, y + height // 2)], fill=frame_color, width=3)

        # Temples
        draw.line([(left_x, y + height // 2), (x, y + height // 3)], fill=frame_color, width=3)
        draw.line([(right_x + lens_width, y + height // 2), (x + width, y + height // 3)], fill=frame_color, width=3)

    def draw_text_centered(self, draw, text, y, width, font_size=24, fill=(255, 255, 255)):
        """Draw centered text."""
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
        except IOError:
            font = ImageFont.load_default()

        bbox = draw.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        x = (width - text_width) // 2
        draw.text((x, y), text, fill=fill, font=font)

    def generate_category_images(self):
        """Generate images for all categories."""
        categories = [
            ('aviator', 'Aviator', (41, 128, 185), (52, 73, 94), (26, 26, 46)),
            ('wayfarer', 'Wayfarer', (139, 69, 19), (101, 67, 33), (26, 26, 46)),
            ('round', 'Round', (201, 168, 76), (180, 140, 50), (26, 26, 46)),
            ('cat-eye', 'Cat Eye', (192, 57, 43), (169, 50, 38), (26, 26, 46)),
            ('sport', 'Sport', (44, 62, 80), (52, 73, 94), (45, 45, 45)),
            ('square', 'Square', (45, 45, 45), (60, 60, 60), (201, 168, 76)),
        ]

        categories_dir = os.path.join(settings.MEDIA_ROOT, 'categories')
        os.makedirs(categories_dir, exist_ok=True)

        for slug, name, color1, color2, frame_color in categories:
            img = self.create_gradient(400, 400, color1, color2, 'vertical')
            draw = ImageDraw.Draw(img)

            # Draw sunglasses icon
            self.draw_sunglasses(draw, 80, 100, 240, 180, frame_color, (26, 26, 46, 200))

            # Draw category name
            self.draw_text_centered(draw, name, 320, 400, font_size=32, fill=(255, 255, 255))

            # Save image
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=90)
            buffer.seek(0)

            filename = f'{slug}.jpg'
            filepath = os.path.join(categories_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(buffer.read())

            self.stdout.write(f'Generated category image: {filename}')

    def generate_product_images(self):
        """Generate images for all products."""
        products = [
            ('aviator-classic', 'Aviator Classic', (26, 26, 46), (201, 168, 76)),
            ('wayfarer-elite', 'Wayfarer Elite', (139, 69, 19), (26, 26, 46)),
            ('round-gold', 'Round Gold', (201, 168, 76), (26, 26, 46)),
            ('sport-shield', 'Sport Shield', (44, 62, 80), (45, 45, 45)),
            ('cat-eye-noir', 'Cat Eye Noir', (26, 26, 46), (201, 168, 76)),
            ('navigator-silver', 'Navigator Silver', (192, 192, 192), (26, 26, 46)),
            ('square-titanium', 'Square Titanium', (45, 45, 45), (201, 168, 76)),
            ('retro-round', 'Retro Round', (139, 69, 19), (26, 26, 46)),
            ('pilot-pro', 'Pilot Pro', (26, 26, 46), (201, 168, 76)),
            ('oversized-square', 'Oversized Square', (26, 26, 46), (139, 69, 19)),
            ('sport-wrap', 'Sport Wrap', (45, 45, 45), (192, 192, 192)),
            ('butterfly-gold', 'Butterfly Gold', (201, 168, 76), (26, 26, 46)),
            ('solaris-aviator', 'Solaris Aviator', (26, 26, 46), (201, 168, 76)),
            ('nova-round', 'Nova Round', (201, 168, 76), (26, 26, 46)),
            ('eclipse-wayfarer', 'Eclipse Wayfarer', (139, 69, 19), (26, 26, 46)),
            ('aura-cat-eye', 'Aura Cat Eye', (26, 26, 46), (201, 168, 76)),
            ('vertex-square', 'Vertex Square', (45, 45, 45), (201, 168, 76)),
            ('prisma-shield', 'Prisma Shield', (44, 62, 80), (26, 26, 46)),
        ]

        products_dir = os.path.join(settings.MEDIA_ROOT, 'products')
        os.makedirs(products_dir, exist_ok=True)

        for slug, name, bg_color, frame_color in products:
            img = self.create_gradient(600, 600, bg_color, (bg_color[0] // 2, bg_color[1] // 2, bg_color[2] // 2), 'vertical')
            draw = ImageDraw.Draw(img)

            # Draw larger sunglasses icon
            self.draw_sunglasses(draw, 100, 150, 400, 250, frame_color, (26, 26, 46))

            # Draw product name
            self.draw_text_centered(draw, name, 480, 600, font_size=36, fill=(255, 255, 255))

            # Draw brand
            self.draw_text_centered(draw, 'LUMINA', 530, 600, font_size=24, fill=(201, 168, 76))

            # Save image
            buffer = io.BytesIO()
            img.save(buffer, format='JPEG', quality=90)
            buffer.seek(0)

            filename = f'{slug}.jpg'
            filepath = os.path.join(products_dir, filename)
            with open(filepath, 'wb') as f:
                f.write(buffer.read())

            self.stdout.write(f'Generated product image: {filename}')

    def generate_banner_images(self):
        """Generate banner images for homepage and shop."""
        banners_dir = os.path.join(settings.STATICFILES_DIRS[-1], 'banners')
        os.makedirs(banners_dir, exist_ok=True)

        # Homepage hero banner
        img = self.create_gradient(1920, 800, (26, 26, 46), (44, 62, 80), 'horizontal')
        draw = ImageDraw.Draw(img)

        # Draw sunglasses
        self.draw_sunglasses(draw, 700, 200, 500, 350, (201, 168, 76), (26, 26, 46))

        # Draw text
        self.draw_text_centered(draw, 'LUMINA', 50, 1920, font_size=72, fill=(201, 168, 76))
        self.draw_text_centered(draw, 'Luxury Sunglasses', 140, 1920, font_size=48, fill=(255, 255, 255))
        self.draw_text_centered(draw, 'Premium Quality • Timeless Design', 200, 1920, font_size=32, fill=(180, 180, 180))

        # Save banner
        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=90)
        buffer.seek(0)

        with open(os.path.join(banners_dir, 'hero-banner.jpg'), 'wb') as f:
            f.write(buffer.read())

        # Shop page banner
        img = self.create_gradient(1920, 400, (44, 62, 80), (26, 26, 46), 'horizontal')
        draw = ImageDraw.Draw(img)

        self.draw_sunglasses(draw, 800, 50, 300, 200, (201, 168, 76), (26, 26, 46))
        self.draw_text_centered(draw, 'OUR COLLECTION', 280, 1920, font_size=48, fill=(255, 255, 255))

        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=90)
        buffer.seek(0)

        with open(os.path.join(banners_dir, 'shop-banner.jpg'), 'wb') as f:
            f.write(buffer.read())

        self.stdout.write('Generated banner images')

    def generate_about_images(self):
        """Generate about page images."""
        about_dir = os.path.join(settings.STATICFILES_DIRS[-1], 'about')
        os.makedirs(about_dir, exist_ok=True)

        # About hero image
        img = self.create_gradient(800, 600, (26, 26, 46), (139, 69, 19), 'vertical')
        draw = ImageDraw.Draw(img)

        self.draw_sunglasses(draw, 200, 150, 400, 250, (201, 168, 76), (26, 26, 46))
        self.draw_text_centered(draw, 'OUR STORY', 450, 800, font_size=48, fill=(255, 255, 255))

        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=90)
        buffer.seek(0)

        with open(os.path.join(about_dir, 'about-hero.jpg'), 'wb') as f:
            f.write(buffer.read())

        # Team/craftsmanship image
        img = self.create_gradient(600, 400, (44, 62, 80), (26, 26, 46), 'horizontal')
        draw = ImageDraw.Draw(img)

        self.draw_text_centered(draw, 'CRAFTSMANSHIP', 50, 600, font_size=36, fill=(201, 168, 76))
        self.draw_text_centered(draw, 'Attention to Detail', 100, 600, font_size=24, fill=(255, 255, 255))

        buffer = io.BytesIO()
        img.save(buffer, format='JPEG', quality=90)
        buffer.seek(0)

        with open(os.path.join(about_dir, 'craftsmanship.jpg'), 'wb') as f:
            f.write(buffer.read())

        self.stdout.write('Generated about page images')
