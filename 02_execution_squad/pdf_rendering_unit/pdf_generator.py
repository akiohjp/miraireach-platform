#!/usr/bin/env python3
"""
PDF Rendering Unit — AIO Company Core
Converts a Markdown file to a styled PDF and saves it to /reports/.
Usage:
    python pdf_generator.py <path/to/file.md>
Dependencies:
    pip install markdown xhtml2pdf
"""

import argparse
import sys
from io import BytesIO
from pathlib import Path

import markdown
from xhtml2pdf import pisa

# ---------------------------------------------------------------------------
# CSS — Professional report styling
# ---------------------------------------------------------------------------
REPORT_CSS = """
@page {
    size: A4;
    margin: 20mm 18mm 22mm 18mm;
    @frame footer {
        -pdf-frame-content: footer;
        bottom: 10mm;
        margin-left: 18mm;
        margin-right: 18mm;
        height: 8mm;
    }
}

body {
    font-family: Helvetica, Arial, sans-serif;
    font-size: 10.5pt;
    line-height: 1.7;
    color: #1f2937;
    margin: 0;
    padding: 0;
}

h1 {
    font-size: 20pt;
    font-weight: bold;
    color: #111827;
    border-bottom: 3px solid #111827;
    padding-bottom: 6px;
    margin-top: 0;
    margin-bottom: 4px;
}

h2 {
    font-size: 13pt;
    font-weight: bold;
    color: #111827;
    border-left: 4px solid #f59e0b;
    padding-left: 8px;
    margin-top: 24px;
    margin-bottom: 8px;
}

h3 {
    font-size: 11pt;
    font-weight: bold;
    color: #374151;
    margin-top: 16px;
    margin-bottom: 4px;
}

p {
    margin: 0 0 9px;
}

blockquote {
    border-left: 4px solid #f59e0b;
    background: #fffbeb;
    margin: 14px 0;
    padding: 10px 14px;
    font-size: 10.5pt;
    font-style: italic;
    color: #92400e;
}

table {
    width: 100%;
    border-collapse: collapse;
    font-size: 9pt;
    margin: 12px 0;
}

th {
    background-color: #111827;
    color: #ffffff;
    padding: 7px 10px;
    text-align: left;
    font-weight: bold;
}

tr:nth-child(even) td {
    background-color: #f9fafb;
}

td {
    padding: 6px 10px;
    border-bottom: 1px solid #e5e7eb;
    vertical-align: top;
}

pre {
    background: #1f2937;
    color: #d1fae5;
    padding: 12px 14px;
    font-size: 8.5pt;
    line-height: 1.5;
    margin: 12px 0;
}

code {
    font-family: Courier, monospace;
    font-size: 9pt;
}

ul, ol {
    margin: 6px 0 10px 0;
    padding-left: 20px;
}

li {
    margin-bottom: 3px;
}

hr {
    border: none;
    border-top: 1px solid #e5e7eb;
    margin: 16px 0;
}

strong {
    font-weight: bold;
    color: #111827;
}

em {
    font-style: italic;
    color: #6b7280;
}

#footer {
    font-size: 8pt;
    color: #9ca3af;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    padding-top: 4px;
}
"""

HTML_TEMPLATE = """\
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>{css}</style>
</head>
<body>
{body}
<div id="footer">
  AIO Company Core — Confidential Report
</div>
</body>
</html>
"""


def resolve_reports_dir(md_path: Path) -> Path:
    """Walk up the tree to find /reports/; fall back to a sibling /reports/."""
    candidate = md_path.parent
    for _ in range(6):
        reports = candidate / "reports"
        if reports.is_dir():
            return reports
        if candidate == candidate.parent:
            break
        candidate = candidate.parent
    fallback = md_path.parent / "reports"
    fallback.mkdir(parents=True, exist_ok=True)
    return fallback


def convert(md_path: Path) -> Path:
    md_text = md_path.read_text(encoding="utf-8")

    html_body = markdown.markdown(
        md_text,
        extensions=["tables", "fenced_code", "nl2br"],
    )

    html_full = HTML_TEMPLATE.format(css=REPORT_CSS, body=html_body)

    reports_dir = resolve_reports_dir(md_path)
    output_path = reports_dir / f"{md_path.stem}_final.pdf"

    with open(output_path, "wb") as pdf_file:
        result = pisa.CreatePDF(
            src=html_full,
            dest=pdf_file,
            encoding="utf-8",
        )

    if result.err:
        raise RuntimeError(f"PDF generation failed with {result.err} error(s).")

    return output_path


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert a Markdown report to a styled PDF.",
    )
    parser.add_argument(
        "markdown_file",
        type=Path,
        help="Path to the input .md file",
    )
    args = parser.parse_args()

    md_path: Path = args.markdown_file.resolve()

    if not md_path.exists():
        print(f"[ERROR] File not found: {md_path}", file=sys.stderr)
        sys.exit(1)

    if md_path.suffix.lower() != ".md":
        print(f"[ERROR] Expected a .md file, got: {md_path.suffix}", file=sys.stderr)
        sys.exit(1)

    print(f"[PDF Rendering Unit] Converting: {md_path.name} ...")
    output = convert(md_path)
    print(f"[PDF Rendering Unit] Done -> {output}")


if __name__ == "__main__":
    main()
