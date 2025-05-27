import pytesseract
from PIL import Image
import pdf2image
from googletrans import Translator
import PyPDF2
import os

# Configurez ce chemin selon votre installation
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'

def test_ocr(image_path):
    """Teste l'extraction de texte depuis une image"""
    try:
        img = Image.open(image_path)
        text = pytesseract.image_to_string(img, lang='fra+eng')
        print("=== TEXTE EXTRAIT ===")
        print(text)
        
        # Test de traduction
        translator = Translator()
        translated = translator.translate(text, dest='fr')
        print("\n=== TRADUCTION ===")
        print(translated.text)
        
        return True
    except Exception as e:
        print(f"ERREUR: {e}")
        return False

if __name__ == "__main__":
    print("=== TEST OCR ===")
    test_file = input("Entrez le chemin vers un fichier image/PDF: ").strip('"')
    
    if os.path.exists(test_file):
        if test_file.lower().endswith(('.png', '.jpg', '.jpeg')):
            print(f"Traitement de l'image {test_file}...")
            success = test_ocr(test_file)
        elif test_file.lower().endswith('.pdf'):
            print(f"Traitement du PDF {test_file}...")
            images = pdf2image.convert_from_path(test_file)
            for i, img in enumerate(images):
                print(f"\n=== PAGE {i+1} ===")
                success = test_ocr(img)
        else:
            print("Format de fichier non supporté")
    else:
        print("Fichier introuvable")