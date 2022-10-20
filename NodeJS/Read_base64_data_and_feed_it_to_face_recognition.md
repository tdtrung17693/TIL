---
id: 2TDBMSvWJ4bQxpqwbvF9vX
---


# Read base64 data and feed it to face_recognition

face_recognition use PIL library to read image data. PIL need a file or a file-like object to work with. In the case of base64 data, after decode it, we wrap it inside a BytesIO object and pass this object to face_recognition.

```python
data = base64.b64decode(base64_data)
face_recognition.load_image_file(BytesIO(data))
```
