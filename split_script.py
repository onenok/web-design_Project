import os
import re

# 建立 js 資料夾
os.makedirs("js", exist_ok=True)

# 正則表達式匹配 <script> 標籤
script_pattern = re.compile(r'<script([^>]*)>(.*?)</script>', re.DOTALL | re.IGNORECASE)

for filename in os.listdir("./pages"):
    if filename.endswith(".html") and filename.lower() != "index.html":
        print(f"Processing {filename}...")
        js_filename = os.path.join("js", os.path.splitext(filename)[0] + ".js")

        with open(os.path.join("./pages", filename), "r", encoding="utf-8") as f:
            html_content = f.read()

        scripts = script_pattern.findall(html_content)

        if scripts:
            with open(js_filename, "w", encoding="utf-8") as js_file:
                js_file.write(f"// Extracted scripts from {filename}\n\n")
                for attrs, content in scripts:
                    # 如果有 src 屬性
                    src_match = re.search(r'src=["\'](.*?)["\']', attrs)
                    if src_match:
                        js_file.write(f"// Referenced external script: {src_match.group(1)}\n")
                    # 如果有內嵌內容
                    if content.strip():
                        js_file.write("(function () {\n")
                        js_file.write(content.strip() + "\n\n")
                        js_file.write("})();\n")
            print(f"Extracted scripts to {js_filename}")