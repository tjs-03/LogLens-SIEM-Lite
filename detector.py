import re
import json
from parser import parse_log_stream

def load_signatures():
    with open('signatures.json', 'r') as f:
        return json.load(f)

def analyze_and_aggregate_logs(log_file_path):
    signatures = load_signatures()
    alerts = []                  
    ip_attack_counts = {}        
    
    # for tracking 404/403 a temporary counter dict
    ip_error_tracker = {}
    
    for log_entry in parse_log_stream(log_file_path):
        path = log_entry['path']
        status = log_entry['status']
        ip = log_entry['ip']
        
        is_attack = False
        
        # A. Check Signatures (SQLi, XSS, Traversal)
        for attack_type, info in signatures.items():
            if re.search(info['pattern'], path, re.IGNORECASE):
                log_entry['attack_type'] = attack_type
                log_entry['severity'] = info['severity']
                alerts.append(log_entry)
                is_attack = True
                break 
        
        # B. Check Standard Brute Force (401 Status)
        if not is_attack and status == '401':
            log_entry['attack_type'] = 'potential_brute_force'
            log_entry['severity'] = 'medium'
            alerts.append(log_entry)
            is_attack = True
            
        # C. New Logic: Check Suspicious Scanner (404/403 Errors)
        if not is_attack and status in ['403', '404']:
            # IP ka error counter badhao
            ip_error_tracker[ip] = ip_error_tracker.get(ip, 0) + 1
            
            # If any IP Generat Error more then 2 404/403 
            if ip_error_tracker[ip] >= 2: # Its Like 20 to 30 in real world
                # New attack copy in object for ignore duplicates
                scanner_alert = log_entry.copy()
                scanner_alert['attack_type'] = 'suspicious_scanner_anomaly'
                scanner_alert['severity'] = 'medium'
                alerts.append(scanner_alert)
                is_attack = True
            
        # D. Aggregation Logic
        if is_attack:
            if ip in ip_attack_counts:
                ip_attack_counts[ip] += 1
            else:
                ip_attack_counts[ip] = 1
                
    return alerts, ip_attack_counts

if __name__ == "__main__":
    all_alerts, attacker_summary = analyze_and_aggregate_logs("hackertest.log")
    print("\n--- DETECTED ATTACKS (ALERTS) ---")
    print(json.dumps(all_alerts, indent=4))
    print("\n--- AGGREGATION SUMMARY (ATTACKS BY IP) ---")
    print(json.dumps(attacker_summary, indent=4))
