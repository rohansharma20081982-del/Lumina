import os
import urllib.request
import ssl

ssl._create_default_https_context = ssl._create_unverified_context

IMAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'images')

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

ABOUT_IMAGES = {
    # Team member portraits - professional headshots
    'team/adrian-cole.jpg': 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&w=400',
    'team/elena-voss.jpg': 'https://images.pexels.com/photos/3785077/pexels-photo-3785077.jpeg?auto=compress&w=400',
    'team/marcus-webb.jpg': 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&w=400',
    'team/isabelle-roux.jpg': 'https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&w=400',
    'team/david-kim.jpg': 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&w=400',
    # Craftsmanship / workshop images
    'craftsmanship.jpg': 'https://images.pexels.com/photos/1170572/pexels-photo-1170572.jpeg?auto=compress&w=800',
    'workshop.jpg': 'https://images.pexels.com/photos/4491881/pexels-photo-4491881.jpeg?auto=compress&w=800',
    'artisan.jpg': 'https://images.pexels.com/photos/1762851/pexels-photo-1762851.jpeg?auto=compress&w=800',
    # About hero background
    'hero-bg.jpg': 'https://images.pexels.com/photos/1314644/pexels-photo-1314644.jpeg?auto=compress&w=1920',
}

def main():
    count = 0
    about_dir = os.path.join(IMAGES_DIR, 'about')

    print('--- Downloading about page images ---')
    for path, url in ABOUT_IMAGES.items():
        dest = os.path.join(about_dir, path)
        if download(url, dest):
            count += 1

    print(f'\nDone! Downloaded {count} about page images.')

if __name__ == '__main__':
    main()
