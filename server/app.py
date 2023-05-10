from flask import Flask, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app, supports_credentials=True)

@app.route('/api/jpg-to-pdf', methods=['POST'])
@cross_origin(supports_credentials=True)
def jpg_to_pdf():
    data = request.get_json()
    url = data.get('url')
    print(url);

    # TODO: Download file from URL and convert to PDF
    # ...

    return {'success': True}

if __name__ == "__main__":
    app.run(debug=True)