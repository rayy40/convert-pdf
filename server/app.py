from flask import send_file, request, Flask
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from io import BytesIO
from PIL import Image
import urllib.request
import requests
import zipfile
import pyrebase
import fitz
import os

load_dotenv()

firebase_config = {
    "apiKey": os.getenv("API_KEY"),
    "authDomain": os.getenv("AUTH_DOMAIN"),
    "projectId": os.getenv("PROJECT_ID"),
    "storageBucket": os.getenv("STORAGE_BUCKET"),
    "messagingSenderId": os.getenv("MESSAGING_SENDER_ID"),
    "appId": os.getenv("APP_ID"),
    "measurementId": os.getenv("MEASUREMENT_ID"),
    "databaseURL": "",
}

app = Flask(__name__)
CORS(app, supports_credentials=True)


@app.route("/api/jpg-to-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def jpg_to_pdf():
    data = request.get_json()
    print(data)
    urls = data.get("urls")

    # Create a new PDF document
    pdf = fitz.open()

    for url in urls:
        # Download image from URL
        with urllib.request.urlopen(url) as img_url:
            img_data = img_url.read()

        # Load the image data into a PIL Image object
        img = Image.open(BytesIO(img_data))

        a4_width = 595.0  # A4 page width
        a4_height = 842.0  # A4 page height
        margin = 28.35  # 1 cm
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
        page.insert_image(
            fitz.Rect(x_pos, y_pos, x_pos + img.width, y_pos + img.height),
            pixmap=fitz.Pixmap(BytesIO(img_data)),
        )

    # Save PDF to file and return download URL
    output_buffer = BytesIO()
    pdf.save(output_buffer)

    # Save PDF to file
    output_buffer.seek(0)  # Reset the buffer's position to the beginning
    with open("output.pdf", "wb") as file:
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


@app.route("/api/pdf-to-jpg", methods=["POST"])
@cross_origin(supports_credentials=True)
def pdf_to_jpg():
    # Get the JSON data containing URLs
    data = request.get_json()
    urls = data.get("urls")

    # Create a directory to store the images
    os.makedirs("images", exist_ok=True)

    # Download the PDF file
    response = requests.get(urls[0])
    with open("input.pdf", "wb") as f:
        f.write(response.content)

    # Open the PDF
    with fitz.open("input.pdf") as doc:
        # Calculate the number of pages
        num_pages = doc.page_count

        # Iterate over each page
        for i, page in enumerate(doc):
            # Get the page as a pixmap
            page = doc.load_page(i)
            pix = page.get_pixmap()

            # Save the pixmap as an image file
            image_path = os.path.join("images", f"file_{i}.png")
            pix.save(image_path)

    # Check the number of images
    if num_pages > 1:
        # Create a zip file containing the images
        zip_data = BytesIO()
        with zipfile.ZipFile(zip_data, "w") as zipf:
            for i in range(num_pages):
                image_path = os.path.join("images", f"file_{i}.png")
                zipf.write(image_path, f"file_{i}.png")

        # Reset the position of the zip_data object to the beginning
        zip_data.seek(0)

        # Upload the zip file to Firebase Storage
        firebase = pyrebase.initialize_app(firebase_config)
        storage = firebase.storage()
        storage.child("converted_images.zip").put(zip_data)

        # Generate the download URL for the zip file
        zip_url = storage.child("converted_images.zip").get_url(None)

        # Clean up temporary files
        for i in range(num_pages):
            image_path = os.path.join("images", f"file_{i}.png")
            os.remove(image_path)

        return zip_url
    elif num_pages == 1:
        # Generate the download URL for the single image
        image_path = os.path.abspath(os.path.join("images", "file_0.png"))

        # Upload the single image file to Firebase Storage
        firebase = pyrebase.initialize_app(firebase_config)
        storage = firebase.storage()
        storage.child("converted_image.png").put(image_path)

        # Generate the download URL for the single image
        image_url = storage.child("converted_image.png").get_url(None)

        # Clean up temporary files
        os.remove(image_path)

        return image_url
    else:
        return "No images found."


@app.route("/api/delete-pages", methods=["POST"])
@cross_origin(supports_credentials=True)
def delete_pages():
    data = request.get_json()
    urls = data.get("urls")
    pages = data.get("pages")

    response = requests.get(urls)
    with open("delete.pdf", "wb") as file:
        file.write(response.content)

    pdf = fitz.open("delete.pdf")

    for page_number in sorted(pages, reverse=True):
        pdf.delete_page(page_number - 1)

    output_file_path = "output.pdf"
    pdf.save(output_file_path)
    pdf.close()

    # Upload the single image file to Firebase Storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child("modified.pdf").put(output_file_path)

    # Generate the download URL for the modified PDF
    pdf_url = storage.child("modified.pdf").get_url(None)

    # Clean up temporary files
    os.remove("delete.pdf")
    os.remove(output_file_path)

    print("Completed")

    return pdf_url


@app.route("/api/compress-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def compress_pdf():
    data = request.get_json()
    urls = data.get("urls")

    print(urls)

    print(data)

    response = requests.get(urls[0])

    with open("compress.pdf", "wb") as file:
        file.write(response.content)

    pdf = fitz.open("compress.pdf")

    compression_quality = 6

    # Iterate through pages
    for page_index in range(len(pdf)):
        # Get the current page
        page = pdf[page_index]

        # Extract images from the page
        images = page.get_pixmap()
        print(images)

        for image_index in range(len(images)):
            print(image_index)
            # Get the current image
            image = images[image_index]

            # Convert Pixmap to Pillow Image
            img = Image.frombytes("RGB", [image.width, image.height], image.samples)

            # Resize or compress the image as desired using Pillow methods
            # Example: Reduce image quality to 80%
            img = img.save("temp.jpg", "JPEG", quality=80)

            # Replace the original image with the compressed one
            page.set_pixmap(image, image_index)

    # Subset embedded fonts
    pdf.subset_fonts()

    # Save the compressed PDF
    pdf.save("compressed.pdf", deflate=compression_quality, garbage=False, clean=True)

    # Close the PDF
    pdf.close()

    return "Uploaded"


if __name__ == "__main__":
    app.run(debug=True)
