#DB ONLY
from pymongo import MongoClient

mongo_client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=3000, tz_aware=True)
mongo_db = mongo_client["stay_traditional"]

products_collection = mongo_db["products"]
users_collection = mongo_db["users"]
orders_collection = mongo_db["orders"]