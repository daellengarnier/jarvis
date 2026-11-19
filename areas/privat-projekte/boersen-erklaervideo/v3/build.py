# Baut video.html aus src.html und dem Beat-Raster der Musik (beats.json)
import json, os
d = os.path.dirname(os.path.abspath(__file__))
beats = json.load(open(os.path.join(d, 'beats.json')))
src = open(os.path.join(d, 'src.html')).read()
open(os.path.join(d, 'video.html'), 'w').write(src.replace('/*BEATS*/[]', json.dumps(beats)))
print('ok', len(beats))
