from flask import Flask
import os

app = Flask(__name__, template_folder='../templates', static_folder='../static')

from modules import routes
