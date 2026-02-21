BitLoki2
BitLoki2 is a secure, client-side tool for hiding files inside PNG images. It’s the next iteration of the original BitLoki, designed to make encoding and decoding files intuitive, stealthy, and visually verifiable — all without uploading data to a server.

Features
File-in-Image Steganography – Hide any file inside a PNG image.
Mini Previews – See your uploaded carrier and secret files before encoding.
File Size Display – Verify capacity before encoding.
Stealth Mode – Encoded images appear normal with a subtle filename tweak (e added).
Decoded Preview – View extracted files directly in your browser.
Download Button – Easily download the encoded or decoded file.
Fullscreen Decoded Preview – Inspect extracted images without leaving the page.
Fully Client-Side – No server required; everything runs in your browser.

How It Works:
Encode a File
Select a carrier PNG image.
Select the file you want to hide.
Download the encoded PNG (filename remains recognizable with a subtle “e” marker).

Decode a File
Upload the encoded PNG.
Preview the hidden file directly in the browser.
Download it if desired.
The encoding method uses a custom marker appended to the carrier PNG to store file data. Only BitLoki2 can decode images encoded with it.

Usage
Open index.html in your browser.
Drag and drop or select your carrier and secret files.
Click Download Encoded Image.
To extract, upload the encoded PNG under the Decode section and click Extract Hidden File.

Technologies
HTML / CSS / JavaScript – Lightweight, client-side web tool.
Blob API & FileReader – Handles file encoding and decoding entirely in-browser.
No backend required – Fully offline and secure.

Folder Structure
bitloki2/
 ├── index.html
 ├── style.css
 ├── script.js
 └── README.md

Security Notes
All operations are client-side; no files are uploaded or stored externally.
Encoded files are only decodable using BitLoki2.
Stealth mode ensures encoded PNGs appear visually identical to original images.
Future Enhancements
Optional encryption layer for additional security.
Support for hiding larger files efficiently.
Multi-carrier image encoding.

License
MIT License – free to use, modify, and share.
