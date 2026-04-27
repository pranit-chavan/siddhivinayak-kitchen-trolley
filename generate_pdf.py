import markdown
from xhtml2pdf import pisa

def convert_md_to_pdf(md_file, pdf_file):
    # Read the markdown file
    with open(md_file, 'r', encoding='utf-8') as f:
        md_text = f.read()

    # Convert markdown to html
    html_text = markdown.markdown(md_text, extensions=['tables'])

    # Add basic CSS styling for better PDF look
    html_template = f"""
    <html>
    <head>
        <style>
            body {{ font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }}
            h1 {{ color: #2c3e50; text-align: center; border-bottom: 2px solid #2c3e50; padding-bottom: 10px; }}
            h2 {{ color: #34495e; margin-top: 30px; border-bottom: 1px solid #bdc3c7; padding-bottom: 5px; }}
            h3 {{ color: #2980b9; margin-top: 20px; }}
            p, ul, li {{ font-size: 14px; color: #333; }}
            ul {{ margin-bottom: 15px; }}
            code {{ background-color: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-family: monospace; }}
        </style>
    </head>
    <body>
        {html_text}
    </body>
    </html>
    """

    # Generate PDF
    with open(pdf_file, "w+b") as result_file:
        pisa_status = pisa.CreatePDF(src=html_template, dest=result_file)

    if pisa_status.err:
        print(f"Error occurred while creating PDF: {pisa_status.err}")
    else:
        print(f"Successfully generated {pdf_file}")

if __name__ == "__main__":
    convert_md_to_pdf("Documentation.md", "Documentation.pdf")
