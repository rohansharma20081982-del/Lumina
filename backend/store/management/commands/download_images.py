import os
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

BASE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
IMAGES_DIR = os.path.join(BASE_DIR, '..', 'images')
MEDIA_DIR = os.path.join(BASE_DIR, 'media')

def download(url, dest):
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        data = urllib.request.urlopen(req, timeout=30).read()
        with open(dest, 'wb') as f:
            f.write(data)
        print(f'  OK ({len(data)//1024}KB) -> {os.path.basename(dest)}')
        return True
    except Exception as e:
        print(f'  FAIL: {e} -> {os.path.basename(dest)}')
        return False

# Pexels free sunglasses photos (various styles)
PRODUCT_IMAGES = {
    'aviator-classic': 'https://images.pexels.com/photos/121795/pexels-photo-121795.jpeg?auto=compress&w=800',
    'wayfarer-elite': 'https://images.pexels.com/photos/2767694/pexels-photo-2767694.jpeg?auto=compress&w=800',
    'round-gold': 'https://images.pexels.com/photos/10837797/pexels-photo-10837797.jpeg?auto=compress&w=800',
    'sport-shield': 'https://images.pexels.com/photos/5201935/pexels-photo-5201935.jpeg?auto=compress&w=800',
    'cat-eye-noir': 'https://images.pexels.com/photos/27347004/pexels-photo-27347004.jpeg?auto=compress&w=800',
    'navigator-silver': 'https://images.pexels.com/photos/5202046/pexels-photo-5202046.jpeg?auto=compress&w=800',
    'square-titanium': 'https://images.pexels.com/photos/34978681/pexels-photo-34978681.jpeg?auto=compress&w=800',
    'retro-round': 'https://images.pexels.com/photos/10837797/pexels-photo-10837797.jpeg?auto=compress&w=800',
    'pilot-pro': 'https://images.pexels.com/photos/121795/pexels-photo-121795.jpeg?auto=compress&w=800',
    'oversized-square': 'https://images.pexels.com/photos/5202046/pexels-photo-5202046.jpeg?auto=compress&w=800',
    'sport-wrap': 'https://images.pexels.com/photos/5201935/pexels-photo-5201935.jpeg?auto=compress&w=800',
    'butterfly-gold': 'https://images.pexels.com/photos/27347004/pexels-photo-27347004.jpeg?auto=compress&w=800',
    'solaris-aviator': 'https://images.pexels.com/photos/121795/pexels-photo-121795.jpeg?auto=compress&w=800',
    'nova-round': 'https://images.pexels.com/photos/2767694/pexels-photo-2767694.jpeg?auto=compress&w=800',
    'eclipse-wayfarer': 'https://images.pexels.com/photos/34978681/pexels-photo-34978681.jpeg?auto=compress&w=800',
    'aura-cat-eye': 'https://images.pexels.com/photos/27347004/pexels-photo-27347004.jpeg?auto=compress&w=800',
    'vertex-square': 'https://images.pexels.com/photos/5201935/pexels-photo-5201935.jpeg?auto=compress&w=800',
    'prisma-shield': 'https://images.pexels.com/photos/10837797/pexels-photo-10837797.jpeg?auto=compress&w=800',
}

CATEGORY_IMAGES = {
    'aviator': 'https://images.pexels.com/photos/121795/pexels-photo-121795.jpeg?auto=compress&w=600',
    'wayfarer': 'https://images.pexels.com/photos/2767694/pexels-photo-2767694.jpeg?auto=compress&w=600',
    'round': 'https://images.pexels.com/photos/10837797/pexels-photo-10837797.jpeg?auto=compress&w=600',
    'cat-eye': 'https://images.pexels.com/photos/27347004/pexels-photo-27347004.jpeg?auto=compress&w=600',
    'sport': 'https://images.pexels.com/photos/5201935/pexels-photo-5201935.jpeg?auto=compress&w=600',
    'square': 'https://images.pexels.com/photos/34978681/pexels-photo-34978681.jpeg?auto=compress&w=600',
}

# Unsplash lifestyle/product photos
BANNER_IMAGES = {
    'banners/hero-banner.jpg': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=80',
    'banners/shop-banner.jpg': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&q=80',
}

ABOUT_IMAGES = {
    'about/about-hero.jpg': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80',
    'about/craftsmanship.jpg': 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
}

def main():
    count = 0

    print('--- Downloading product images ---')
    for slug, url in PRODUCT_IMAGES.items():
        filename = f'{slug}.jpg'
        for d in [os.path.join(IMAGES_DIR, 'products'), os.path.join(MEDIA_DIR, 'products')]:
            if download(url, os.path.join(d, filename)):
                count += 1

    print('\n--- Downloading category images ---')
    for slug, url in CATEGORY_IMAGES.items():
        filename = f'{slug}.jpg'
        for d in [os.path.join(IMAGES_DIR, 'categories'), os.path.join(MEDIA_DIR, 'categories')]:
            if download(url, os.path.join(d, filename)):
                count += 1

    print('\n--- Downloading banner images ---')
    for path, url in BANNER_IMAGES.items():
        if download(url, os.path.join(IMAGES_DIR, path)):
            count += 1

    print('\n--- Downloading about images ---')
    for path, url in ABOUT_IMAGES.items():
        if download(url, os.path.join(IMAGES_DIR, path)):
            count += 1

    print(f'\nDone! Downloaded {count} files total.')

if __name__ == '__main__':
    main()
