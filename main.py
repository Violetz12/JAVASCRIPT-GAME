import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from supabase import create_client, Client

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
supabase: Client = create_client(url, key)

app = Flask(__name__)
CORS(app)

@app.route('/new', methods=['POST'])
def add_leaderboard():
    data = request.get_json()
    if data.get("score") >= 100:
        return jsonify({"error": "Score must be less than 100"}), 400
    
    response = supabase.table("leaderboard").insert({
        "player": data.get("player"),
        "score": data.get("score")
    }).execute()
    return jsonify({"success": True, "data": response.data}), 201

#hewlpewlp
@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    try:
        response = supabase.table("leaderboard").select("player,score").order("score", desc=True).limit(10).execute()
        return jsonify({"leaderboard": response.data}), 200
    except Exception as e:
        app.logger.error(f"Error fetching leaderboard: {str(e)}")
        return jsonify({"error": "Database connection error", "details": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)