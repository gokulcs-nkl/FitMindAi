from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__, static_folder='static', static_url_path='/static', template_folder='templates')

@app.route('/')
def index():
    """Serve the main SPA"""
    return render_template('index.html')

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files (CSS, JS, images)"""
    return send_from_directory(os.path.join(app.root_path, 'static'), filename)

# Health check endpoint
@app.route('/api/health', methods=['GET'])
def health_check():
    """Simple health check endpoint"""
    return {'status': 'ok', 'message': 'FitMind AI Backend Running'}, 200

# Error handlers
@app.errorhandler(404)
def not_found(e):
    """Handle 404 errors by serving index.html (SPA routing)"""
    return render_template('index.html'), 200

@app.errorhandler(500)
def server_error(e):
    """Handle 500 errors"""
    return {'error': 'Internal Server Error'}, 500

if __name__ == '__main__':
    # Run in debug mode by default (change to False in production)
    app.run(debug=True, host='0.0.0.0', port=5000)
