from PIL import Image, ImageDraw
import random

# Image size
width, height = 1200, 630

# Create a new image with a gradient background
img = Image.new('RGB', (width, height), color=(255, 255, 255))
draw = ImageDraw.Draw(img)

# Create a gradient from top to bottom: yellow to red
for y in range(height):
    r = int(255 * (1 - y / height))  # Red increases
    g = int(255 * (y / height))      # Green decreases
    b = 0                            # Blue stays 0
    for x in range(width):
        draw.point((x, y), fill=(r, g, b))

# Add subtle green hints
for _ in range(50):
    x = random.randint(0, width)
    y = random.randint(0, height)
    draw.ellipse((x-10, y-10, x+10, y+10), fill=(0, 100, 0, 50))

# Add Poké Ball hints: circles
for _ in range(20):
    x = random.randint(50, width-50)
    y = random.randint(50, height-50)
    draw.ellipse((x-20, y-20, x+20, y+20), outline=(0,0,0), width=2)
    draw.ellipse((x-10, y-10, x+10, y+10), fill=(255,0,0))
    draw.ellipse((x-10, y-10, x+10, y+10), fill=(255,255,255), outline=(0,0,0))

# Add sparkles: small stars
def draw_star(draw, x, y, size, color):
    points = []
    for i in range(10):
        angle = i * 36
        if i % 2 == 0:
            r = size
        else:
            r = size / 2
        points.append((x + r * math.cos(math.radians(angle)), y + r * math.sin(math.radians(angle))))
    draw.polygon(points, fill=color)

import math
for _ in range(30):
    x = random.randint(0, width)
    y = random.randint(0, height)
    draw_star(draw, x, y, 5, (255, 255, 0))

# Add light beams: diagonal lines
for _ in range(10):
    x1 = random.randint(0, width//2)
    y1 = random.randint(0, height//2)
    x2 = x1 + random.randint(100, 300)
    y2 = y1 + random.randint(100, 300)
    draw.line((x1, y1, x2, y2), fill=(255, 255, 0), width=3)

# Add badges: simple shapes
for _ in range(5):
    x = random.randint(100, width-100)
    y = random.randint(100, height-100)
    draw.ellipse((x-30, y-30, x+30, y+30), fill=(255, 215, 0), outline=(0,0,0))
    draw.text((x-10, y-10), "★", fill=(0,0,0))

# Save the image
img.save('public/share-bg.png')
print("Image generated and saved as public/share-bg.png")
