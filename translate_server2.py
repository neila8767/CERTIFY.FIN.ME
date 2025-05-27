from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr 
import pytesseract
from pdf2image import convert_from_path
from googletrans import Translator
from PIL import Image
import os
import re
from datetime import datetime


app = Flask(__name__)
CORS(app)

translator = Translator()

reader = easyocr.Reader(['fr', 'en'], gpu=False)

def extract_structured_infos_easyocr(image_path):
    # Étape 1 : OCR avec EasyOCR
    results = reader.readtext(image_path, detail=0)
    text = "\n".join(results)

    # Étape 2 : Nettoyage du texte
    text = text.replace('\n', ' ').replace('  ', ' ').strip()
    return text

def extract_text_from_pdf(pdf_path):
    images = convert_from_path(pdf_path)
    text = ''
    for image in images:
        text += pytesseract.image_to_string(image, lang='ara+eng+fra') + '\n'
    return text

def translate_to_french(text):
    if not text:
        return None
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    translated_chunks = []
    for chunk in chunks:
        try:
            translated = translator.translate(chunk, src='auto', dest='fr')
            translated_chunks.append(translated.text)
        except Exception as e:
            translated_chunks.append(f"[Erreur traduction : {e}]")
    return ' '.join(translated_chunks)



def translate_to_english(text):
    if not text:
        return None
    chunk_size = 500
    chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
    translated_chunks = []
    for chunk in chunks:
        try:
            translated = translator.translate(chunk, src='auto', dest='en')
            translated_chunks.append(translated.text)
        except Exception as e:
            translated_chunks.append(f"[Erreur traduction : {e}]")
    return ' '.join(translated_chunks)

     

     

def clean_ocr_text(text):
    """Nettoie légèrement le texte OCR pour faciliter l'extraction."""
    return text.replace('\n', ' ').replace('  ', ' ').strip()

import re

def clean_ocr_text(text):
    return text.replace('\n', ' ').replace('  ', ' ').strip()


def extract_main_info(text):
    text = clean_ocr_text(text)

    def match(pattern):
        m = re.search(pattern, text, re.IGNORECASE)
        return m.group(1).strip() if m else None

    # Diplôme : français + anglais
    diplome = match(r'\b(DOCTORAT|MAST[ÈE]RE|LICENCE|ING[ÉE]NIEUR|DEGREE OF LICENCE|MASTER|ENGINEER|DOCTORATE)\b')
    if diplome:
        diplome = diplome.replace("DEGREE OF ", "").upper()  # Standardiser

    # Nom complet : français
    nom_complet = match(r'D[ée]cern[ée] [àa] ([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)')
    # Si pas trouvé, tenter version anglaise
    if not nom_complet:
        nom_complet = match(r'Awarded to\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)')

    nom, prenom = None, None
    if nom_complet:
        parts = nom_complet.strip().split()
        if len(parts) >= 2:
            nom = parts[0]
            prenom = ' '.join(parts[1:])

    # Date de naissance : FR + EN
    date_naissance = match(r'N[ée]\(e\)\s+le\s+(\d{4}-\d{2}-\d{2})') or match(r'Born on\s+(\d{4}-\d{2}-\d{2})')

    # Lieu de naissance : FR + EN
    lieu_naissance = match(r'\d{4}-\d{2}-\d{2}\s+[àa]\s+([A-Za-z]+)') or match(r'in\s+([A-Za-z]+)')

    # Spécialité : FR + EN, arrêt à certains mots ou fin de ligne
    speciality_raw = re.search(
        r'(?:Sp[ée]cialit[ée]?|Specialty)\s+(.+?)(?:\s+(?:D[ée]livr[ée]|Issued|Le\s+Recteur|Rector)|$)',
        text,
        re.IGNORECASE
    )
    speciality = None
    if speciality_raw:
        speciality = speciality_raw.group(1).strip()

    return {
        'nom': nom,
        'prenom': prenom,
        'diplome': diplome,
        'speciality': speciality,
        'date_naissance': date_naissance,
        'lieu_naissance': lieu_naissance
    }




def process_file(file_path):
    ext = file_path.lower().rsplit('.', 1)[-1]
    if ext in ['jpg', 'jpeg', 'png']:
        extracted_text = extract_structured_infos_easyocr(file_path)
    elif ext == 'pdf':
        extracted_text = extract_text_from_pdf(file_path)
    else:
        raise ValueError("Format de fichier non supporté")

    original_info = extract_main_info(extracted_text)
   
    diplome = original_info.get('diplome', '')
    if diplome and diplome.upper() in ['MASTER', 'LICENCE', 'DOCTORAT', 'INGENIEUR', 'BACCALAUREAT']:
    # Diplôme en français, pas besoin de traduction
     translated_info = original_info.copy()
    # Si tu veux traduire seulement la spécialité (exemple clé 'speciality')
     translated_info['speciality'] = translate_to_french(original_info['speciality'])
     translated_info['lieu_naissance'] = translate_to_french(original_info['lieu_naissance'])
  
    else:
        translated_info = {}
        for key, value in original_info.items():
            if isinstance(value, str) and value:
                try:
                    translated_value = translate_to_french(value)
                except Exception as e:
                    translated_value = f"[Erreur traduction : {e}]"
            else:
                translated_value = value
            translated_info[key] = translated_value

    # Debug prints
    print("=== Texte original ===")
    print(extracted_text)
    print("=== Infos originales extraites ===")
    print(original_info)
    print("=== Infos traduites extraites ===")
    print(translated_info)

    return {
        'original_info': original_info,
        'translated_info': translated_info
    }


@app.route('/api/process-document', methods=['POST'])
def process_document():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier reçu'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'Nom de fichier vide'}), 400

    temp_dir = 'temp'
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)
    
    try:
        file.save(temp_path)
        result = process_file(temp_path)
         
        print("===== Résultat traitement document =====")
        print("Original info extrait :", result['original_info'])
        print("Translated info extrait :", result['translated_info'])
        print("========================================")


        return jsonify({
            'status': 'success',
            'original_info': result['original_info'],  # Correspond à ce que le frontend attend
            'translated_info': result['translated_info']  # Correspond à ce que le frontend attend
        })
        
    except Exception as e:
     import traceback
     traceback.print_exc()  # Ajoute ceci pour imprimer la stack trace complète
     return jsonify({
        'status': 'error',
        'message': str(e)
     }), 500
 
        
    finally:
        try:
            if os.path.exists(temp_path):
                os.remove(temp_path)
        except Exception as e:
            print(f"Erreur lors de la suppression du fichier temporaire: {e}")



@app.route('/translate-english', methods=['POST'])
def translate():
    data = request.get_json()
    text = data.get('text')
    to_lang = data.get('to', 'en')

    if not text or not to_lang:
        return jsonify({'error': 'Texte ou langue manquante'}), 400

    try:
        chunk_size = 500
        chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
        translated_chunks = []
        for chunk in chunks:
            translated = translator.translate(chunk, src='auto', dest=to_lang)
            translated_chunks.append(translated.text)
        return jsonify({'translatedText': ' '.join(translated_chunks)})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    



if __name__ == '__main__':
    app.run(debug=True, port=5001)
