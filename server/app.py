from flask import send_file, request, Flask
from flask_cors import CORS, cross_origin
from io import BytesIO
from PIL import Image
import urllib.request
import fitz

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/jpg-to-pdf', methods=['POST'])
@cross_origin(supports_credentials=True)
def jpg_to_pdf():
    data = request.get_json()
    print(data)
    urls = data.get('urls')
    
    # Create a new PDF document
    pdf = fitz.open()
    
    for url in urls:
            # Download image from URL
            with urllib.request.urlopen(url) as img_url:
                img_data = img_url.read()

            # Load the image data into a PIL Image object
            img = Image.open(BytesIO(img_data))

            a4_width = 595.0 # A4 page width 
            a4_height = 842.0 # A4 page height 
            margin = 28.35 # 1 cm 
            max_width = a4_width - 2 * margin
            max_height = a4_height - 2 * margin

            # Resize the image while maintaining its aspect ratio
            img.thumbnail((max_width, max_height))

            # Add new page with A4 dimensions
            page = pdf.new_page(width=a4_width, height=a4_height)

            # Get the dimensions of the resized image
            img_width, img_height = img.size

            # Calculate position to center image
            x_pos = (a4_width - img_width) / 2
            y_pos = (a4_height - img_height) / 2

            # Insert image into PDF page
            page.insert_image(fitz.Rect(x_pos, y_pos, x_pos + img.width, y_pos + img.height), pixmap=fitz.Pixmap(BytesIO(img_data)))

    # Save PDF to file and return download URL
    output_buffer = BytesIO()
    pdf.save(output_buffer)
    
    # Save PDF to file
    output_buffer.seek(0)  # Reset the buffer's position to the beginning
    with open('output.pdf', 'wb') as file:
        file.write(output_buffer.read())

    # Close the buffer
    output_buffer.close()
    
    return "Uploaded"
    
    # return send_file(
    #     output_buffer,
    #     download_name='output.pdf',
    #     as_attachment=True,
    #     mimetype='application/pdf'
    # )

if __name__ == "__main__":
    app.run(debug=True)