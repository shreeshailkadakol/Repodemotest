import os
import json
from datetime import datetime
import matplotlib.pyplot as plt
import base64

# Paths
results_path = './reports/allure/allure-results'
chart_image_path = './reports/test_summary_chart.png'

# Initialize counts
total = passed = failed = broken = 0
start_times = []
end_times = []

# Check if results directory exists
if not os.path.exists(results_path):
    print(f"Warning: Allure results directory '{results_path}' does not exist.")
    print("This may happen if no tests were run or all tests failed before completion.")
    print("Creating a default summary...")
    # Create an empty summary and exit gracefully
    total = passed = failed = broken = 0
else:
    # Parse Allure result JSON files
    for file in os.listdir(results_path):
        if file.endswith("-result.json"):
            file_path = os.path.join(results_path, file)
            with open(file_path, 'r', encoding='utf-8') as json_file:
                data = json.load(json_file)
                if 'status' in data:
                    status = data['status']
                    total += 1
                    if status == 'passed':
                        passed += 1
                    elif status == 'failed':
                        failed += 1
                    elif status == 'broken':
                        broken += 1

                    # Time handling
                    if 'start' in data:
                        start_times.append(data['start'])
                    if 'stop' in data:
                        end_times.append(data['stop'])

# Compute Start, End, Duration
if start_times and end_times:
    start_time = min(start_times) / 1000  # Convert ms to sec
    end_time = max(end_times) / 1000
    start_dt = datetime.fromtimestamp(start_time)
    end_dt = datetime.fromtimestamp(end_time)
    duration_sec = end_time - start_time
    duration_str = str(datetime.utcfromtimestamp(duration_sec).strftime("%H:%M:%S"))
else:
    start_dt = end_dt = "Unknown"
    duration_str = "Unknown"

# Debug Print
print(f"Total: {total}, Passed: {passed}, Failed: {failed}, Broken: {broken}")
print(f"Start: {start_dt}, End: {end_dt}, Duration: {duration_str}")

# Generate Bar Chart
if total > 0:
    labels = ['Passed', 'Failed', 'Broken']
    counts = [passed, failed, broken]
    colors = ['#4CAF50', '#F44336', '#FFC107']

    plt.figure(figsize=(6,4))
    bars = plt.bar(labels, counts, color=colors)
    plt.title('Test Execution Summary')
    plt.ylabel('Number of Tests')
    plt.grid(axis='y', linestyle='--', alpha=0.7)

    # Adding data labels on top of bars
    for bar in bars:
        height = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, height, str(height), ha='center', va='bottom')

    plt.tight_layout()
    plt.savefig(chart_image_path)
    plt.close()
else:
    print("No test cases found to generate chart.")

# Encode chart to base64 (only if chart exists)
chart_base64 = ""
if os.path.exists(chart_image_path):
    with open(chart_image_path, 'rb') as img_file:
        chart_base64 = base64.b64encode(img_file.read()).decode('utf-8')

# Generate chart image HTML (only if chart was created)
chart_html = ""
if chart_base64:
    chart_html = f"""
    <div class="chart">
      <h3>Test Results Overview:</h3>
      <img src="data:image/png;base64,{chart_base64}" alt="Test Summary Chart" />
    </div>
    """

# Generate Rich HTML Email Body
email_body = f"""
<!DOCTYPE html>
<html>
<head>
  <style>
    body {{
      font-family: Arial, sans-serif;
    }}
    .report-container {{
      border: 1px solid #ddd;
      padding: 20px;
      max-width: 700px;
      margin: auto;
      background-color: #f9f9f9;
    }}
    h2 {{
      text-align: center;
      color: #333;
    }}
    table {{
      width: 100%;
      border-collapse: collapse;
      margin-top: 15px;
    }}
    th, td {{
      border: 1px solid #ccc;
      padding: 10px;
      text-align: center;
    }}
    th {{
      background-color: #eee;
    }}
    .link {{
      margin-top: 20px;
      text-align: center;
    }}
    .link a {{
      color: #007bff;
      text-decoration: none;
      font-weight: bold;
    }}
    .info {{
      margin-top: 20px;
    }}
  </style>
</head>
<body>
  <div class="report-container">
    <h2>Playwright Test Summary Report</h2>
    <div class="info">
      <p><b>Start Time:</b> {start_dt}</p>
      <p><b>End Time:</b> {end_dt}</p>
      <p><b>Total Duration:</b> {duration_str}</p>
    </div>
    <table>
      <tr>
        <th>Total Tests</th>
        <th>Passed</th>
        <th>Failed</th>
        <th>Broken</th>
      </tr>
      <tr>
        <td>{total}</td>
        <td style="color:green;">{passed}</td>
        <td style="color:red;">{failed}</td>
        <td style="color:orange;">{broken}</td>
      </tr>
    </table>
    {chart_html}
    <div class="link">
      🔗 <a href="https://eng-valtech.github.io/playwright-poc/">View Full Allure Report Here</a>
    </div>
  </div>
</body>
</html>
"""

# Save email body
email_template_path = './reports/email_body.html'
with open(email_template_path, 'w', encoding='utf-8') as f:
    f.write(email_body)

print("Email template and chart with execution info generated successfully.")
