import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://127.0.0.1:8000/api/products/',
    headers={'Content-Type': 'application/json'},
    data=json.dumps({
        'artisan_id': '7454de05-b46e-4e0c-b6dc-88ba93f69f08',
        'price': 500,
        'image_url': '',
        'audio_url': ''
    }).encode('utf-8')
)

try:
    res = urllib.request.urlopen(req)
    print(res.read().decode())
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode())
except Exception as e:
    print("Error:", e)
