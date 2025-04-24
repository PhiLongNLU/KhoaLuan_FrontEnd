import os
from model import User
import pymongo

client = pymongo.MongoClient(os.getenv("SERVER"), os.getenv("PORT"))

db = client[os.getenv("DB_NAME")]

def get_user(google_id):
    return db.get_collection("Users").find_one({"google_id": google_id})

def insert_user(user_dict : dict):
    return db.get_collection("Users").insert_one(user_dict)