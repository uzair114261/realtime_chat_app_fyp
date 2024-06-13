from cryptography.fernet import Fernet
import os

SECRET_KEY = os.environ.get('ENCRYPTION_KEY')

def encrypt_message(message):
    fernet = Fernet(SECRET_KEY)
    encrypted_message = fernet.encrypt(message.encode())
    return encrypted_message.decode()

def decrypt_message(encrypted_message):
    fernet = Fernet(SECRET_KEY)
    decrypted_message = fernet.decrypt(encrypted_message.encode())
    return decrypted_message.decode()
    