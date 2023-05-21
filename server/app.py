from flask import send_file, request, Flask
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
from pptx import Presentation
from pylokit import Office
from io import BytesIO
from PIL import Image
import urllib.request
import requests
import tempfile
import zipfile
import pyrebase
import math
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
    urls = data.get("urls")
    metadata = data.get("metadata")
    filename = metadata["name"].split("--")[0]
    filename_without_extension = os.path.splitext(filename)[0]

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

    # Reset the buffer's position to the beginning
    output_buffer.seek(0)

    # Set the destination path for the file upload
    folder_name = "jpg-to-pdf/modified"
    destination_path = f"{folder_name}/{filename_without_extension}.pdf"

    # Upload the single image file to Firebase Storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child(destination_path).put(output_buffer)

    # Get the download URL
    download_url = storage.child(destination_path).get_url(None)

    # Close the buffer
    pdf.close()
    output_buffer.close()

    return download_url


@app.route("/api/pdf-to-jpg", methods=["POST"])
@cross_origin(supports_credentials=True)
def pdf_to_jpg():
    # Get the JSON data containing URLs
    data = request.get_json()
    urls = data.get("urls")
    metadata = data.get("metadata")
    filename = metadata["name"].split("--")[0]
    filename_without_extension = os.path.splitext(filename)[0]

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
            image_path = os.path.join("images", f"{filename_without_extension}_{i}.jpg")
            pix.save(image_path)

    # Check the number of images
    if num_pages > 1:
        # Create a zip file containing the images
        zip_data = BytesIO()
        with zipfile.ZipFile(zip_data, "w") as zipf:
            for i in range(num_pages):
                image_path = os.path.join(
                    "images", f"{filename_without_extension}_{i}.jpg"
                )
                zipf.write(image_path, f"{filename_without_extension}_{i}.jpg")

        # Reset the position of the zip_data object to the beginning
        zip_data.seek(0)

        # Set the destination path for the file upload
        folder_name = "pdf-to-jpg/modified"
        destination_path = f"{folder_name}/{filename_without_extension}.zip"

        # Upload the zip file to Firebase Storage
        firebase = pyrebase.initialize_app(firebase_config)
        storage = firebase.storage()
        storage.child(destination_path).put(zip_data)

        # Generate the download URL and metadata for the zip file
        zip_url = storage.child(destination_path).get_url(None)

        # Clean up temporary files
        for i in range(num_pages):
            image_path = os.path.join("images", f"{filename_without_extension}_{i}.jpg")
            os.remove(image_path)

        return zip_url
    elif num_pages == 1:
        # Generate the download URL for the single image
        image_path = os.path.abspath(
            os.path.join("images", f"{filename_without_extension}.jpg")
        )

        # Set the destination path for the file upload
        folder_name = "pdf-to-jpg/modified"
        destination_path = f"{folder_name}/{filename_without_extension}.jpg"

        # Upload the single image file to Firebase Storage
        firebase = pyrebase.initialize_app(firebase_config)
        storage = firebase.storage()
        storage.child(destination_path).put(image_path)

        # Generate the download URL for the single image
        image_url = storage.child(destination_path).get_url(None)

        # Clean up temporary files
        os.remove(image_path)

        return image_url


@app.route("/api/delete-pages", methods=["POST"])
@cross_origin(supports_credentials=True)
def delete_pages():
    data = request.get_json()
    urls = data.get("urls")
    pages = data.get("pages")
    metadata = data.get("metadata")
    filename = metadata["name"].split("--")[0]
    filename_without_extension = os.path.splitext(filename)[0]

    response = requests.get(urls)
    with open("delete.pdf", "wb") as file:
        file.write(response.content)

    pdf = fitz.open("delete.pdf")

    for page_number in sorted(pages, reverse=True):
        pdf.delete_page(page_number - 1)

    output_file_path = "output.pdf"
    pdf.save(output_file_path)
    pdf.close()

    # Set the destination path for the file upload
    folder_name = "delete-pages/modified"
    destination_path = f"{folder_name}/{filename_without_extension}-modified.pdf"

    # Upload the single image file to Firebase Storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child(destination_path).put(output_file_path)

    # Generate the download URL for the modified PDF
    pdf_url = storage.child(destination_path).get_url(None)

    # Clean up temporary files
    os.remove("delete.pdf")
    os.remove(output_file_path)

    return pdf_url


@app.route("/api/extract-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def extract_pdf():
    data = request.get_json()
    urls = data.get("urls")
    pages = data.get("pages")
    metadata = data.get("metadata")
    filename = metadata["name"].split("--")[0]
    filename_without_extension = os.path.splitext(filename)[0]

    response = requests.get(urls)

    with open("split.pdf", "wb") as file:
        file.write(response.content)

    # Extract selected pages
    extracted_pages = []
    doc = fitz.open("split.pdf")
    pdf = fitz.open()

    for page_num in sorted(pages, reverse=True):
        page = doc[int(page_num) - 1]  # Page numbers start from 0
        pdf.insert_pdf(doc, from_page=int(page_num) - 1, to_page=int(page_num) - 1)

    # Save the extracted pages to a new PDF file
    output_filename = "extracted_pages.pdf"
    pdf.save(output_filename)
    pdf.close()
    doc.close()

    # Set the destination path for the file upload
    folder_name = "extract-pdf/modified"
    destination_path = f"{folder_name}/{filename_without_extension}-extracted.pdf"

    # Upload the new PDF file to Firebase storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child(destination_path).put(output_filename)

    # Get the download URL
    download_url = storage.child(destination_path).get_url(None)

    # Remove the local files
    os.remove("split.pdf")
    os.remove(output_filename)

    return download_url


@app.route("/api/pdf-to-ppt", methods=["POST"])
@cross_origin(supports_credentials=True)
def pdf_to_ppt():
    # Get the JSON data containing URLs
    data = request.get_json()
    urls = data.get("urls")
    metadata = data.get("metadata")
    filename = metadata["name"].split("--")[0]
    filename_without_extension = os.path.splitext(filename)[0]

    response = requests.get(urls[0])

    # Load the PDF content into a Presentation object
    prs = Presentation()

    # Create a slide for each page in the PDF
    pdf_stream = BytesIO(response.content)
    pdf_stream.seek(0)
    slide_width = prs.slide_width
    slide_height = prs.slide_height
    slide_layout = prs.slide_layouts[1]  # Use the layout for a content slide

    with tempfile.NamedTemporaryFile(delete=False) as pdf_file:
        pdf_file.write(pdf_stream.getvalue())

        pdf_doc = fitz.open(pdf_file.name)
        for page_index in range(len(pdf_doc)):
            slide = prs.slides.add_slide(slide_layout)
            content_slide = slide.shapes

            # Convert PDF page to image
            page = pdf_doc.load_page(page_index)
            pix = page.get_pixmap()

            img = Image.frombytes("RGB", [pix.width, pix.height], pix.samples)

            with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as img_file:
                img.save(img_file.name, format="PNG")

                # Calculate the dimensions while maintaining the aspect ratio
                max_width = slide_width
                max_height = slide_height
                img_width, img_height = img.size
                aspect_ratio = img_width / img_height

                if aspect_ratio > max_width / max_height:
                    width = max_width
                    height = math.ceil(width / aspect_ratio)
                    left = 0
                    top = (max_height - height) / 2
                else:
                    height = max_height
                    width = math.ceil(height * aspect_ratio)
                    top = 0
                    left = (max_width - width) / 2

                # Add the image to the slide
                content_slide.add_picture(img_file.name, left, top, width, height)

    # Save the Presentation as a PPTX file
    converted_pptx = tempfile.NamedTemporaryFile(delete=False, suffix=".pptx")
    prs.save(converted_pptx.name)
    converted_pptx.close()

    # Set the destination path for the file upload
    folder_name = "pdf-to-ppt/modified"
    destination_path = f"{folder_name}/{filename_without_extension}.pptx"

    # Upload the converted PPTX file to Firebase Storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child(destination_path).put(converted_pptx.name)

    # Generate the download URL for the converted PPTX
    pptx_url = storage.child(destination_path).get_url(None)

    # Clean up temporary files
    pdf_file.close()
    pdf_doc.close()
    pdf_stream.close()
    os.remove(converted_pptx.name)
    os.remove(pdf_file.name)

    return pptx_url


@app.route("/api/compress-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def compress_pdf():
    data = request.get_json()
    urls = data.get("urls")

    response = requests.get(urls[0])

    with open("compress.pdf", "wb") as file:
        file.write(response.content)

    pdf = fitz.open("compress.pdf")

    # Compression logic

    return "Uploaded"


@app.route("/api/protect-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def protect_pdf():
    return "Protected"


@app.route("/api/unlock-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def unlock_pdf():
    return "Unlocked"


@app.route("/api/merge-pdf", methods=["POST"])
@cross_origin(supports_credentials=True)
def merge_pdf():
    data = request.get_json()
    urls = data.get("urls")

    merged_pdf = fitz.open()

    for url in urls:
        # Download the PDF file from the URL
        response = requests.get(url)
        with fitz.open(stream=response.content, filetype="pdf") as pdf_file:
            merged_pdf.insert_pdf(pdf_file)

    output_file_path = "output.pdf"
    merged_pdf.save(output_file_path)
    merged_pdf.close()

    # Upload the single image file to Firebase Storage
    firebase = pyrebase.initialize_app(firebase_config)
    storage = firebase.storage()
    storage.child("merged.pdf").put(output_file_path)

    # Generate the download URL for the modified PDF
    pdf_url = storage.child("merged.pdf").get_url(None)

    # Clean up temporary files
    os.remove(output_file_path)

    return pdf_url


if __name__ == "__main__":
    app.run(debug=True)
