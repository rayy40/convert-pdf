from flask import send_file, request, Flask
from flask_cors import CORS, cross_origin
import urllib.request
import os,io, fitz

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/jpg-to-pdf', methods=['POST'])
@cross_origin(supports_credentials=True)
def jpg_to_pdf():
    data = request.get_json()
    url = data.get('url')
    print(url);
    
    # Download image from URL
    with urllib.request.urlopen(url) as img_url:
        img_data = img_url.read()
        
    # Convert image to PDF using PyMuPDF
    with io.BytesIO(img_data) as img_io, io.BytesIO() as pdf_io:
        with fitz.open() as doc:
            doc = fitz.open()
            img = fitz.Pixmap(img_io)
            page = doc.new_page(width = img.width, height = img.height)
            page.insert_image(page.rect, pixmap=img)
            save_path = os.path.join(os.getcwd(), "pdf_files", "converted.pdf")
            doc.save(save_path)

    return "File Uploaded"

if __name__ == "__main__":
    app.run(debug=True)