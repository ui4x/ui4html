import re
import shutil
from pathlib import Path

source_path = Path(__file__).parent
target_path = Path(__file__).parent.parent / "docs"

example_number = 0

for file_path in sorted(source_path.glob("*.md")):

    lines_in = iter(file_path.read_text().splitlines())
    lines_out = []

    example_in_source = re.compile(
        r"```html example(\s+(?P<template>[\w_]+))?(\s+(?P<start_line>\d+)(-(?P<end_line>\d+))?)?"
    )

    example_snippet = """<sub>{}</sub>
```html
{}
```
{}
{}"""

    running_example = (
        '<iframe style="border:1px solid #404040;border-radius:3px;background-color:#212121;" src="{}"></iframe>'
    )

    try:
        while True:
            line = next(lines_in)
            match = example_in_source.match(line)
            if not match:
                lines_out.append(line)
            else:
                example_number += 1
                meta = match.groupdict()
                example_content = []
                while line := next(lines_in):
                    if line.startswith("```"):
                        break
                    else:
                        example_content.append(line)
                template = Path(f"templates/{meta['template'] or 'solid'}.html").read_text()
                example = template.replace("[title]", f"ui4 Example {example_number}")
                example = example.replace("[content]", "\n".join(example_content))
                start_line = (start_as_str := meta.get("start_line")) and int(start_as_str) or None
                end_line = (end_as_str := meta.get("end_line")) and int(end_as_str) or None
                end_line = end_line or start_line
                start_line = start_line and start_line - 1 or None

                # Save example file
                example_file_name = f"example{example_number:04}.html"
                (target_path / "examples" / example_file_name).write_text(example)

                # Lines to show on site
                example_lines = "\n".join(example_content[slice(start_line, end_line)])
                # example_lines = example_lines.replace("<", "&lt;")  # .replace("\n", "<br/>")

                # Add example table
                example_table = example_snippet.format(
                    f"Example {example_number}".upper(),
                    example_lines,
                    running_example.format(f"examples/{example_file_name}"),
                    f'<a href="examples/{example_file_name}">Open in full screen</a>'
                )

                lines_out.extend(example_table.splitlines())

    except StopIteration:
        pass

    result = "\n".join(lines_out)

    target_file_name = f"{file_path.stem.upper()}.md"
    (target_path / target_file_name).write_text(result)

    print(f"Examples total generating {target_file_name} {str(file_path)}: {example_number}")


shutil.copy(str(Path(__file__).parent.parent / "src" / "ui4.js"), target_path / "examples" / "ui4.js")
