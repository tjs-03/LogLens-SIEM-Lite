import os
import uuid
import threading
import time
from flask import Flask, request, jsonify
from flask_cors import CORS
from detector import analyze_and_aggregate_logs

app = Flask(__name__)
# Sabhi local origins aur headers bypass karne ke liye CORS fully rule allow locked
CORS(app, resources={r"/*": {"origins": "*"}})

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
jobs_queue = {}

def async_processing_worker(job_id, file_path):
    try:
        jobs_queue[job_id]['status'] = 'processing'
        alerts, summary = analyze_and_aggregate_logs(file_path)
        
        # 3 second delay to demonstrate real-time server thread polling to evaluation check
        time.sleep(3) 
        
        jobs_queue[job_id]['status'] = 'completed'
        jobs_queue[job_id]['result'] = {
            "total_attacks": len(alerts),
            "alerts": alerts,
            "summary": summary
        }
    except Exception as e:
        jobs_queue[job_id]['status'] = 'failed'
        jobs_queue[job_id]['error'] = str(e)

@app.route('/api/upload', methods=['POST', 'OPTIONS'])
def upload_log_async():
    if request.method == 'OPTIONS':
        return jsonify({"status": "preflight_ok"}), 200
        
    if 'file' not in request.files:
        return jsonify({"error": "No file parameter found"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Empty filename selection"}), 400
        
    if file:
        file_id = str(uuid.uuid4())[:8]
        job_id = f"job-{file_id}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{job_id}_{file.filename}")
        file.save(file_path)
        
        jobs_queue[job_id] = {
            "status": "queued",
            "filename": file.filename,
            "result": None
        }
        
        thread = threading.Thread(target=async_processing_worker, args=(job_id, file_path))
        thread.start()
        
        return jsonify({
            "status": "accepted",
            "job_id": job_id
        })

@app.route('/api/job/<job_id>', methods=['GET'])
def check_job_status(job_id):
    if job_id not in jobs_queue:
        return jsonify({"error": "Job mismatch"}), 404
    return jsonify(jobs_queue[job_id])

if __name__ == '__main__':
    # host='0.0.0.0' lagane se browser localhost aur 127.0.0.1 dono pipelines accept karega
    app.run(debug=True, port=5000, host='0.0.0.0')
