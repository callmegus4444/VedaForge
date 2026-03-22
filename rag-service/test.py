import urllib.request, json, urllib.error
req = urllib.request.Request('http://127.0.0.1:5001/extract', method='POST', data=json.dumps({'filePath':'D:/ALL PROJECTS/vedaforge/backend/uploads/1773904264164-315760660.pdf'}).encode('utf-8'), headers={'Content-Type':'application/json'})
try:
    print(urllib.request.urlopen(req).read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(e.read().decode('utf-8'))
