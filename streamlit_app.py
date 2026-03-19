import streamlit as st
import streamlit.components.v1 as components
import os
import re

st.set_page_config(
    page_title="FitMind AI",
    page_icon="🧠",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# Hide Streamlit chrome completely
st.markdown("""
<style>
    #MainMenu, header, footer, .stDeployButton { display: none !important; }
    .main > div { padding: 0 !important; }
    .block-container { padding: 0 !important; max-width: 100% !important; }
    section[data-testid="stSidebar"] { display: none !important; }
    iframe { border: none !important; }
</style>
""", unsafe_allow_html=True)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

def read_file(path):
    try:
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    except:
        return ""

def build_inline_html():
    html = read_file(os.path.join(BASE_DIR, "index.html"))

    # Inline CSS files
    def replace_css(match):
        href = match.group(1)
        # Remove {% static %} tags for inlining
        href = href.replace("{% static '", "").replace("' %}", "")
        css_path = os.path.join(BASE_DIR, href.replace("/", os.sep))
        css = read_file(css_path)
        return f"<style>\n{css}\n</style>"

    html = re.sub(
        r'<link[^>]+rel=["\']stylesheet["\'][^>]+href=["\']([^"\']+\.css)["\'][^>]*\/?>',
        replace_css, html
    )

    # Inline LOCAL JS files (skip CDN scripts)
    def replace_js(match):
        src = match.group(1)
        # Remove {% static %} tags for inlining
        src = src.replace("{% static '", "").replace("' %}", "")
        if src.startswith("http"):
            return match.group(0)  # Keep CDN as-is
        js_path = os.path.join(BASE_DIR, src.replace("/", os.sep))
        js = read_file(js_path)
        return f"<script>\n{js}\n</script>"

    html = re.sub(
        r'<script[^>]+src=["\']([^"\']+)["\'][^>]*><\/script>',
        replace_js, html
    )

    return html

# Build and serve
html_content = build_inline_html()

components.html(
    html_content,
    height=1200,
    scrolling=True
)
